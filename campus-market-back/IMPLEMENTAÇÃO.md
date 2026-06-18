# Documentação Técnica de Implementação

## Arquitetura

O backend segue arquitetura modular do NestJS.

```text
Controller
    ↓
Service
    ↓
Prisma ORM (Facilita a comunicação com o BD)
    ↓
PostgreSQL
```

---

# Fluxo de Autenticação

## Cadastro

```text
POST /auth/register
```

Processo:

1. Recebe dados do usuário
2. Gera hash da senha
3. Salva no banco
4. Retorna usuário criado

---

## Login

```text
POST /auth/login
```

Processo:

1. Busca usuário
2. Compara senha utilizando bcrypt
3. Gera JWT
4. Retorna token

Payload:

```json
{
  "sub": 1,
  "email": "usuario@email.com",
  "role": "CLIENTE"
}
```

---

# Sistema de Permissões

Utiliza:

```text
JwtAuthGuard
RolesGuard
```

Exemplo:

```typescript
@Roles('VENDEDOR')
```

Somente vendedores acessam a rota.

---

# Produtos

Cada produto pertence a:

```text
Categoria
Vendedor
```

Relacionamento:

```text
User
 └── Product
```

Campos:

```text
id
sellerId
categoryId
name
description
imageUrl
price
stock
status
```

---

# Carrinho

Cada cliente possui apenas um carrinho.

Relacionamento:

```text
User
 └── Cart
      └── CartItem
           └── Product
```

Ao adicionar item:

1. Verifica estoque
2. Verifica existência
3. Atualiza quantidade
4. Cria item caso necessário

---

# Criação de Pedido

Fluxo:

```text
Cliente
 ↓
Carrinho
 ↓
Pedido
 ↓
Pagamento
```

Processo:

1. Busca carrinho
2. Valida estoque
3. Calcula total
4. Cria pedido
5. Cria itens do pedido
6. Atualiza estoque
7. Cria pagamento
8. Limpa carrinho

Tudo executado dentro de:

```typescript
prisma.$transaction()
```

Garantindo integridade dos dados.

---

# Controle de Estoque

Ao finalizar pedido:

```typescript
stock: {
  decrement: quantity
}
```

Exemplo:

```text
Estoque inicial: 10

Compra: 2

Resultado: 8
```

---

# Pagamentos

Tabela:

```text
Payment
```

Campos:

```text
amount
method
status
```

Métodos:

```text
PIX
CASH
```

Status:

```text
PENDENTE
APROVADO
RECUSADO
```

---

# Aprovação de Pagamento

Fluxo:

```text
VENDEDOR
 ↓
Pagamento APROVADO
 ↓
Pedido PAGO
```

Processo:

1. Verifica proprietário do pedido
2. Atualiza pagamento
3. Atualiza pedido

---

# Entrega

Fluxo:

```text
PAGO
 ↓
ENTREGUE
```

O vendedor marca o pedido como entregue após a retirada pelo cliente.

---

# Histórico do Cliente

Endpoint:

```text
GET /orders/my-purchases
```

Retorna:

* vendedor
* itens
* pagamento
* status
* total

---

# Histórico do Vendedor

Endpoint:

```text
GET /orders/seller
```

Retorna:

* cliente
* produtos
* total
* pagamento
* status

Somente pedidos pertencentes ao vendedor autenticado.

---

# Segurança

Implementado:

✅ JWT

✅ Bcrypt

✅ Guards

✅ Roles

✅ Validação de estoque

✅ Validação de proprietário do produto

✅ Validação de proprietário do pedido

---

# Fluxo Completo de Compra

```text
Cliente
 ↓
Login
 ↓
Visualiza produtos
 ↓
Adiciona ao carrinho
 ↓
Finaliza compra
 ↓
Pedido criado
 ↓
Pagamento criado
 ↓
Vendedor recebe pedido
 ↓
Vendedor aprova pagamento
 ↓
Pedido muda para PAGO
 ↓
Cliente retira pedido
 ↓
Vendedor marca ENTREGUE
 ↓
Pedido finalizado
```
