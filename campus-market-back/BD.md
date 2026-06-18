# BD.md

# Banco de Dados - Campus Market

Documentação da estrutura do banco de dados PostgreSQL utilizada pelo backend do Campus Market.

---

# Tecnologias

* PostgreSQL
* Prisma ORM

---

# Visão Geral

O banco foi modelado para atender três perfis:

```text
CLIENTE
VENDEDOR
ADMIN
```

O sistema permite:

* Cadastro de usuários
* Cadastro de categorias
* Cadastro de produtos
* Carrinho de compras
* Pedidos
* Pagamentos
* Controle de estoque

---

# Diagrama Conceitual

```text
User
 │
 ├── Product
 │
 ├── Cart
 │     │
 │     └── CartItem
 │              │
 │              └── Product
 │
 └── Order
        │
        ├── OrderItem
        │       │
        │       └── Product
        │
        └── Payment
```

---

# Tabela User

Representa todos os usuários do sistema.

```text
User
```

| Campo     | Tipo       |
| --------- | ---------- |
| id        | Int        |
| name      | String     |
| email     | String     |
| password  | String     |
| avatar    | String     |
| role      | Role       |
| status    | UserStatus |
| createdAt | DateTime   |
| updatedAt | DateTime   |

---

## Role

```text
CLIENTE
VENDEDOR
ADMIN
```

---

## UserStatus

```text
ATIVO
INATIVO
```

---

# Tabela Category

Categorias dos lanches.

```text
Category
```

| Campo     | Tipo     |
| --------- | -------- |
| id        | Int      |
| name      | String   |
| createdAt | DateTime |

---

## Exemplo

```text
Salgados
Doces
Bebidas
Combos
```

---

# Tabela Product

Produtos vendidos pelos vendedores.

```text
Product
```

| Campo       | Tipo          |
| ----------- | ------------- |
| id          | Int           |
| sellerId    | Int           |
| categoryId  | Int           |
| name        | String        |
| description | String        |
| imageUrl    | String        |
| price       | Decimal       |
| stock       | Int           |
| status      | ProductStatus |
| createdAt   | DateTime      |
| updatedAt   | DateTime      |

---

## Relacionamentos

```text
Product
 ├── pertence a User (VENDEDOR)
 └── pertence a Category
```

---

## ProductStatus

```text
ATIVO
INATIVO
```

---

# Tabela Cart

Carrinho do cliente.

Cada cliente possui apenas um carrinho.

```text
Cart
```

| Campo     | Tipo     |
| --------- | -------- |
| id        | Int      |
| userId    | Int      |
| createdAt | DateTime |
| updatedAt | DateTime |

---

## Relacionamento

```text
User
 └── Cart
```

---

# Tabela CartItem

Itens armazenados no carrinho.

```text
CartItem
```

| Campo     | Tipo |
| --------- | ---- |
| id        | Int  |
| cartId    | Int  |
| productId | Int  |
| quantity  | Int  |

---

## Relacionamento

```text
Cart
 └── CartItem
       └── Product
```

---

# Tabela Order

Pedido realizado pelo cliente.

```text
Order
```

| Campo      | Tipo        |
| ---------- | ----------- |
| id         | Int         |
| customerId | Int         |
| sellerId   | Int         |
| total      | Decimal     |
| status     | OrderStatus |
| createdAt  | DateTime    |

---

## Relacionamentos

```text
Order
 ├── Cliente
 ├── Vendedor
 ├── Itens
 └── Pagamento
```

---

## OrderStatus

```text
PENDENTE
PAGO
ENVIADO
ENTREGUE
CANCELADO
```

---

# Tabela OrderItem

Itens pertencentes a um pedido.

```text
OrderItem
```

| Campo     | Tipo    |
| --------- | ------- |
| id        | Int     |
| orderId   | Int     |
| productId | Int     |
| quantity  | Int     |
| unitPrice | Decimal |

---

## Relacionamento

```text
Order
 └── OrderItem
        └── Product
```

---

# Tabela Payment

Pagamento associado ao pedido.

```text
Payment
```

| Campo     | Tipo          |
| --------- | ------------- |
| id        | Int           |
| orderId   | Int           |
| amount    | Decimal       |
| method    | PaymentMethod |
| status    | PaymentStatus |
| createdAt | DateTime      |

---

## PaymentMethod

```text
PIX
CASH
```

---

## PaymentStatus

```text
PENDENTE
APROVADO
RECUSADO
```

---

# Fluxo de Compra

## 1. Cliente adiciona produto

```text
Product
 ↓
CartItem
```

---

## 2. Carrinho é criado

```text
User
 ↓
Cart
```

---

## 3. Pedido é gerado

```text
Cart
 ↓
Order
```

---

## 4. Itens são copiados

```text
CartItem
 ↓
OrderItem
```

---

## 5. Pagamento é criado

```text
Order
 ↓
Payment
```

---

## 6. Estoque é reduzido

```text
Product.stock
 ↓
decrement(quantity)
```

---

## 7. Carrinho é limpo

```text
CartItem
 ↓
DELETE
```

---

# Fluxo de Aprovação

```text
Cliente realiza pedido
        ↓
Pagamento PENDENTE
        ↓
Vendedor aprova
        ↓
Pagamento APROVADO
        ↓
Pedido PAGO
        ↓
Entrega realizada
        ↓
Pedido ENTREGUE
```

---

# Regras de Negócio

## Carrinho

* Não permite quantidade menor ou igual a zero
* Não permite estoque insuficiente
* Não permite produto inexistente

---

## Pedido

* Não permite carrinho vazio
* Não permite produtos de vendedores diferentes no mesmo pedido
* Não permite estoque insuficiente

---

## Pagamento

* Apenas o vendedor proprietário pode aprovar
* Apenas o vendedor proprietário pode visualizar seus pedidos

---

# Índices Recomendados

Para crescimento futuro:

```sql
CREATE INDEX idx_product_seller
ON "Product"(sellerId);

CREATE INDEX idx_order_customer
ON "Order"(customerId);

CREATE INDEX idx_order_seller
ON "Order"(sellerId);

CREATE INDEX idx_payment_order
ON "Payment"(orderId);
```

---

# Situação Atual do Banco

Implementado:

✅ Usuários

✅ Perfis (Cliente, Vendedor, Admin)

✅ Categorias

✅ Produtos

✅ Carrinho

✅ Pedidos

✅ Pagamentos

✅ Controle de Estoque

✅ Histórico do Cliente

✅ Histórico do Vendedor

✅ Dashboard do Vendedor

---
