# Campus Market

Sistema de Marketplace de Lanches para Ambiente Acadêmico.

## Tecnologias Utilizadas

### Frontend

* Angular 20
* TypeScript
* Bootstrap/CSS

### Backend

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication

### Banco de Dados

* PostgreSQL

---

# Estrutura do Projeto

```text
campus-market/
│
├── campus-market-front/     # Frontend Angular
│
└── campus-market-back/      # Backend NestJS
```

---

# Requisitos

Antes de iniciar o projeto, instale:

* Node.js 22+
* npm
* PostgreSQL
* Git

Verifique:

```bash
node -v
npm -v
```

---

# Clonando o Projeto

```bash
git clone URL_DO_REPOSITORIO
```

Entrar no backend:

```bash
cd campus-market-back
```

Entrar no frontend:

```bash
cd campus-market-front
```

---

# Configuração do Banco

Criar banco PostgreSQL:

```sql
CREATE DATABASE campusmarket;
```

---

# Configurar Variáveis de Ambiente

Backend:

Criar arquivo:

```bash
.env
```

Exemplo:

```env
DATABASE_URL="postgresql://postgres:SENHA@localhost:5432/campusmarket"

JWT_SECRET="campusmarket123"

PORT=3001
```

---

# Instalação Backend

Entrar na pasta:

```bash
cd campus-market-back
```

Instalar dependências:

```bash
npm install
```

---

# Prisma

Gerar Client:

```bash
npx prisma generate
```

Criar tabelas:

```bash
npx prisma db push
```

Caso deseje visualizar o banco:

```bash
npx prisma studio
```

---

# Iniciar Backend

```bash
npm run start:dev
```

Servidor:

```text
http://localhost:3001
```

Verifique:

```text
[Nest] Application successfully started
```

---

# Instalação Frontend

Entrar na pasta:

```bash
cd campus-market-front
```

Instalar dependências:

```bash
npm install
```

---

# Iniciar Frontend

```bash
npm start
```

ou

```bash
ng serve
```

Aplicação:

```text
http://localhost:4200
```

---

# Ordem Correta Para Rodar o Projeto

Sempre siga esta ordem:

## 1. Backend

```bash
cd campus-market-back

npm install

npx prisma generate

npx prisma db push

npm run start:dev
```

Aguarde:

```text
Application successfully started
```

---

## 2. Frontend

Abrir outro terminal:

```bash
cd campus-market-front

npm install

npm start
```

Aguarde:

```text
Compiled successfully
```

---

# Usuários do Sistema

## Cliente

Pode:

* Visualizar lanches
* Adicionar ao carrinho
* Realizar pedidos
* Acompanhar pedidos

---

## Vendedor

Pode:

* Cadastrar produtos
* Editar produtos
* Receber pedidos
* Confirmar pagamentos
* Entregar pedidos

---

## Administrador

Pode:

* Gerenciar usuários
* Gerenciar categorias
* Gerenciar vendedores
* Gerenciar produtos

---

# Rotas Principais Backend

## Auth

```text
POST /auth/register
POST /auth/login
```

## Produtos

```text
GET    /products
POST   /products
PATCH  /products/:id
DELETE /products/:id
```

## Categorias

```text
GET    /categories
POST   /categories
```

## Carrinho

```text
GET    /cart
POST   /cart/items
DELETE /cart/items/:productId
```

## Pedidos

```text
POST /orders

GET /orders/my-purchases

GET /orders/seller

PUT /orders/:id/payment

PUT /orders/:id/status
```

---

# Rodando no GitHub Codespaces

Após abrir o Codespace:

Instalar dependências:

```bash
cd campus-market-back
npm install

cd ../campus-market-front
npm install
```

---

## Backend

```bash
cd ../campus-market-back

npx prisma generate

npx prisma db push

npm run start:dev
```

---

## Frontend

Novo terminal:

```bash
cd campus-market-front

npm start
```

---

# Comandos Úteis

Atualizar Prisma:

```bash
npx prisma generate
```

Atualizar banco:

```bash
npx prisma db push
```

Abrir Prisma Studio:

```bash
npx prisma studio
```

Limpar node_modules:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

# Solução de Problemas

## Erro Prisma Client

```bash
npx prisma generate
```

---

## Erro Banco Não Encontrado

Verifique:

```env
DATABASE_URL
```

---

## Erro JWT

Verifique:

```env
JWT_SECRET
```

---

## Frontend não conecta ao Backend

Verifique:

```text
http://localhost:3001
```

e

```typescript
apiUrl = 'http://localhost:3001/api'
```

---

# Status Atual do Projeto

Implementado:

* Login JWT
* Cadastro de usuários
* Categorias
* Produtos
* Carrinho
* Pedidos
* Status de pagamento
* Dashboard do vendedor
* Controle de estoque
* Associação produto → vendedor
* Atualização automática de pedidos do vendedor

Desenvolvido para o projeto Campus Market.
