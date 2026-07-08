# IFRN CampusMarket — Backend (NestJS + Prisma)

Backend da plataforma **CampusMarket** desenvolvido com **NestJS**, **Prisma ORM** e **PostgreSQL**, com autenticação via **JWT**.

## Visão Geral

O backend expõe uma API REST (prefixo global `api`) para:

- Cadastro e autenticação de usuários (`CLIENTE`, `VENDEDOR`, `ADMIN`)
- Verificação de e-mail (OTP) e recuperação de senha (OTP)
- Catálogo de categorias e produtos
- Carrinho e criação de pedidos
- Fluxo de pagamento e atualização de status do pedido
- Endereços
- Upload de imagens com **Cloudinary**
- Notificações:
  - E-mail via **Gmail (SMTP)** com Senha de App
  - Confirmação de entrega com **WhatsApp** (link `wa.me`)

## Stack

- Node.js / TypeScript
- NestJS
- Prisma ORM + PostgreSQL
- JWT + Passport
- Bcrypt (hash de senhas)
- Nodemailer / Gmail SMTP (envio de e-mail)
- Cloudinary (uploads)
- Multer (uploads em memória)
- Bull/BullMQ (fila/infra disponível; jobs de e-mail são tratados pelo MailService)

## Requisitos

- Node.js 22+ (recomendado)
- PostgreSQL
- Variáveis de ambiente configuradas corretamente

## Variáveis de Ambiente

Crie um arquivo `.env` em `campus-market-back/`:

```env
DATABASE_URL="postgresql://USER:SENHA@HOST:5432/campus_market?schema=public"
JWT_SECRET="uma-chave-forte"
PORT=3001

# Frontend URL para CORS
FRONTEND_URL="http://localhost:4200"

# Banco de imagens (Cloudinary)
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
# Notificações por e-mail (Gmail via SMTP)
MAIL_USER="seu-email@gmail.com"
MAIL_PASS="sua-senha-de-app-do-google"
MAIL_FROM="seu-email@gmail.com" # Opcional

# Redis (opcional; usado pela infraestrutura Bull)
REDIS_URL="..."
```

> Observação: `JWT_SECRET` é obrigatório. O backend falha ao iniciar caso não esteja configurado.

## Como Rodar Localmente

### Instalação

```bash
npm install
```

### Banco de Dados

1. Configure o `DATABASE_URL`.
2. Rode as migrações/ajuste do Prisma conforme seu fluxo:

```bash
npx prisma generate
npx prisma db push
```

### Inicialização

```bash
npm run start:dev
```

A API ficará em:

```text
http://localhost:3001/api
```

## Scripts

- `npm run start:dev` — desenvolvimento (watch)
- `npm run build` — build para produção
- `npm run test` — testes
- `npm run lint` — lint

## Arquitetura (Módulos)

- `AuthModule` — autenticação, OTP de e-mail e recuperação de senha
- `UsersModule` — perfil e gerenciamento de dados do usuário
- `SellerModule` — informações e dashboard do vendedor
- `CategoriesModule` — CRUD de categorias
- `ProductsModule` — CRUD de produtos (por vendedor)
- `CartModule` — carrinho do cliente
- `OrdersModule` — criação e atualização de pedidos
- `PaymentsModule` — ações e estados de pagamento
- `AddressModule` — CRUD de endereços
- `UploadModule` + `CloudinaryModule` — upload de imagens
- `MailModule` — envio de e-mails (Gmail SMTP)
- `WhatsappModule` — geração de link WhatsApp para confirmação de entrega

## Rotas Principais (Resumo)

Abaixo, uma referência por contexto (rotas publicadas sob `/api`):

### Autenticação (`/auth`)

- `POST /auth/register` — cadastro + OTP
- `POST /auth/login` — login (JWT)
- `POST /auth/verify-email` — valida OTP e ativa conta
- `POST /auth/resend-code` — reenvia OTP
- `POST /auth/forgot-password` — OTP de recuperação
- `POST /auth/reset-password` — valida OTP e redefine senha
- `GET /auth/me` — perfil autenticado
- `GET /auth/profile` — perfil (variação)

### Categorias (`/categories`)

- `GET /categories` — listar
- `POST /categories` — criar (protegido)
- `DELETE /categories/:id` — remover (protegido)

### Produtos (`/products`)

- `GET /products` — listar
- `GET /products/:id` — detalhes
- `POST /products` — criar (VENDEDOR/ADMIN)
- `PUT /products/:id` — atualizar (VENDEDOR/ADMIN)
- `DELETE /products/:id` — remover (VENDEDOR/ADMIN)
- `GET /products/seller/me` — produtos do vendedor

### Carrinho (`/cart`)

- `GET /cart` — obter carrinho
- `POST /cart/items` — adicionar item
- `PUT /cart/items/:productId` — atualizar quantidade
- `DELETE /cart/items/:productId` — remover item
- `DELETE /cart` — limpar carrinho

### Pedidos (`/orders`)

- `POST /orders` — criar pedido a partir do carrinho
- `GET /orders/my-purchases` — pedidos do cliente
- `GET /orders/seller` — pedidos do vendedor (protegido por role)
- `PUT /orders/:id/status` — atualizar status do pedido
- `PUT /orders/:id/payment` — atualizar status do pagamento (protegido por role)
- `PUT /orders/:id/confirm` — confirmar entrega (gera link WhatsApp)

### Pagamentos (`/payments`)

- `GET /payments` — listar (role)
- `GET /payments/:id` — detalhes
- `PATCH /payments/:id` — atualizar (role)
- `DELETE /payments/:id` — remover (ADMIN)

### Endereços (`/addresses`)

- `POST /addresses` — criar
- `GET /addresses` — listar
- `GET /addresses/:id` — detalhes
- `PATCH /addresses/:id` — atualizar
- `DELETE /addresses/:id` — remover

### Usuários (`/users`)

- `GET /users/me` — dados do usuário
- `GET /users/me/profile` — perfil
- `PATCH /users/me` — atualizar dados
- `PATCH /users/me/password` — alterar senha
- `POST /users/me/avatar` — upload de avatar
- `DELETE /users/me` — excluir conta

### Upload de imagem (`/upload`)

- `POST /upload/product-image` — imagem de produto
- `POST /upload/avatar` — imagem de avatar

## Segurança (Resumo)

As principais proteções e hardenings aplicados:

- `JWT_SECRET` obrigatório (sem fallback inseguro)
- `ValidationPipe` global com:
  - `whitelist: true`
  - `forbidNonWhitelisted: true`
  - `transform: true`
- Guards para autenticação (`JwtAuthGuard`) e autorização por role
- Uploads com:
  - tipos permitidos (jpeg/png/webp)
  - limite de tamanho por request
- Restrições CORS por `FRONTEND_URL`

## Troubleshooting — E-mail OTP

Se o e-mail não chegar:

- confira `MAIL_USER` e `MAIL_PASS` no ambiente
- teste reenvio (`POST /auth/resend-code`)
- verifique caixa de Spam/Promoções no provedor do destinatário

## Observações de Deploy

Este backend usa:

- prefixo global `api`
- porta `PORT` configurável para serviços como Render
- variáveis de ambiente para segredos (não hardcoded)
