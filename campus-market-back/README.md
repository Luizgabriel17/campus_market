# Campus Market Backend

Backend da plataforma Campus Market desenvolvido com NestJS, Prisma ORM, PostgreSQL e JWT.

---

# Tecnologias

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Bcrypt

---

# Funcionalidades Implementadas

## Autenticação

* Cadastro de usuários
* Login com JWT
* Hash de senhas com Bcrypt
* Controle de perfis:

```text
CLIENTE
VENDEDOR
ADMIN
```

* Proteção de rotas com JWT
* Controle de permissões com Roles Guard

---

## Categorias

* Criar categoria
* Listar categorias
* Associação de produtos a categorias

---

## Produtos

* Cadastro de produtos
* Edição de produtos
* Exclusão lógica (INATIVO)
* Controle de estoque
* Associação produto → vendedor
* Upload de imagem (estrutura preparada)

---

## Carrinho

* Criar carrinho automaticamente
* Adicionar produto
* Atualizar quantidade
* Remover produto
* Limpar carrinho

Validações:

* Estoque disponível
* Produto existente
* Quantidade válida

---

## Pedidos

* Criar pedido a partir do carrinho
* Histórico de compras do cliente
* Histórico de vendas do vendedor
* Atualização de status

Status disponíveis:

```text
PENDENTE
PAGO
ENVIADO
ENTREGUE
CANCELADO
```

---

## Pagamentos

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

O vendedor pode:

* Aprovar pagamento
* Recusar pagamento

Ao aprovar:

```text
Pagamento → APROVADO
Pedido → PAGO
```

---

## Dashboard do Vendedor

* Visualização dos pedidos recebidos
* Identificação do cliente
* Identificação dos produtos vendidos
* Valor total do pedido
* Aprovação de pagamento
* Confirmação de entrega

---

# Instalação

Instalar dependências:

```bash
npm install
```

---

# Variáveis de Ambiente

Criar arquivo:

```env
.env
```

Exemplo:

```env
DATABASE_URL="postgresql://postgres:SENHA@localhost:5432/campusmarket"

JWT_SECRET="campusmarket123"

PORT=3001
```

---

# Banco de Dados

Gerar Prisma Client:

```bash
npx prisma generate
```

Criar tabelas:

```bash
npx prisma db push
```

Abrir Prisma Studio:

```bash
npx prisma studio
```

---

# Executar Projeto

Modo desenvolvimento:

```bash
npm run start:dev
```

Servidor:

```text
http://localhost:3001
```

---

# Estrutura dos Módulos

```text
src/

auth/
users/
categories/
products/
cart/
orders/
payments/
prisma/
common/
```

---

# Rotas Principais

## Auth

POST /auth/register

POST /auth/login

---

## Categorias

GET /categories

POST /categories

---

## Produtos

GET /products

POST /products

PATCH /products/:id

DELETE /products/:id

---

## Carrinho

GET /cart

POST /cart/items

PUT /cart/items/:productId

DELETE /cart/items/:productId

DELETE /cart

---

## Pedidos

POST /orders

GET /orders/my-purchases

GET /orders/seller

PUT /orders/:id/status

PUT /orders/:id/payment

---

# Status Atual

Implementado:

✅ JWT

✅ Controle de perfis

✅ Categorias

✅ Produtos

✅ Carrinho

✅ Pedidos

✅ Pagamentos

✅ Dashboard do vendedor

✅ Controle de estoque

✅ Histórico de compras

✅ Histórico de vendas

---
