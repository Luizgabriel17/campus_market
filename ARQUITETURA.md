# 🏗️ Arquitetura de Autenticação - Campus Market

## 📊 Diagrama Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        NAVEGADOR WEB                            │
│  http://localhost:4200                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              ANGULAR FRONTEND (SPA)                      │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │   Login     │  │  Register    │  │   Callback   │   │  │
│  │  │ Component   │  │  Component   │  │  Component   │   │  │
│  │  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘   │  │
│  │         │                │                │            │  │
│  │         └────────────────┼────────────────┘            │  │
│  │                          │                             │  │
│  │  ┌───────────────────────▼─────────────────────────┐  │  │
│  │  │          Auth Service                           │  │  │
│  │  │  - login()                                      │  │  │
│  │  │  - register()                                   │  │  │
│  │  │  - saveToken()                                  │  │  │
│  │  │  - getToken()                                   │  │  │
│  │  │  - logout()                                     │  │  │
│  │  └───────────────┬────────────────────────────────┘  │  │
│  │                  │                                    │  │
│  │  ┌──────────────┴─────────────────────────────────┐  │  │
│  │  │       HttpClient (com Interceptor)             │  │  │
│  │  ├────────────────────────────────────────────────┤  │  │
│  │  │  - authInterceptor (adiciona Bearer token)     │  │  │
│  │  └─────────────┬────────────────────────────────┘  │  │
│  │               │                                    │  │
│  │  ┌────────────▼────────────────────────────────┐  │  │
│  │  │      Route Guard (authGuard)                │  │  │
│  │  │  - Protege rotas autenticadas               │  │  │
│  │  │  - Redireciona para login se não auth       │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │                                                  │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                  │
└─────────────────────┼──────────────────────────────────┘
                      │
        HTTP REQUEST  │  (Auth Header: Bearer {token})
                      │
        ┌─────────────▼──────────────────────┐
        │   BACKEND API (NestJS)             │
        │   http://localhost:3000            │
        ├────────────────────────────────────┤
        │                                    │
        │  POST /auth/login                  │
        │  POST /auth/register               │
        │  GET  /auth/google                 │
        │  GET  /auth/google/callback        │
        │  GET  /auth/me                     │
        │                                    │
        │  ┌──────────────────────────────┐  │
        │  │  Auth Controller             │  │
        │  │  Auth Service                │  │
        │  │  - login()                   │  │
        │  │  - register()                │  │
        │  │  - validateGoogleLogin()     │  │
        │  │  JWT Generation              │  │
        │  └───────────────┬──────────────┘  │
        │                  │                 │
        │  ┌───────────────▼──────────────┐  │
        │  │  Database (PostgreSQL)       │  │
        │  │  - users table               │  │
        │  │  - passwords hashed          │  │
        │  │  - google_id field           │  │
        │  └──────────────────────────────┘  │
        │                                    │
        └────────────────────────────────────┘
                      │
                      │ Redirect
                      │ (com token na URL)
                      │
        ┌─────────────▼──────────────────────┐
        │   Google OAuth                     │
        │   (Se login com Google)            │
        └────────────────────────────────────┘
```

---

## 🔄 Fluxo de Autenticação

### Fluxo 1: Login com Email/Senha

```
Usuário                Frontend                Backend             Database
   │                    │                       │                    │
   │ 1. Preenche form   │                       │                    │
   ├───────────────────►│                       │                    │
   │                    │ 2. POST /auth/login   │                    │
   │                    ├──────────────────────►│                    │
   │                    │                       │ 3. Valida email    │
   │                    │                       ├───────────────────►│
   │                    │                       │ 4. Busca usuário   │
   │                    │                       │◄───────────────────┤
   │                    │                       │                    │
   │                    │                       │ 5. Compara senha   │
   │                    │                       │ (bcrypt)           │
   │                    │                       │                    │
   │                    │ 6. Retorna JWT token  │                    │
   │                    │◄──────────────────────┤                    │
   │                    │                       │                    │
   │ 7. Salva token     │                       │                    │
   │◄───────────────────┤                       │                    │
   │                    │                       │                    │
   │ 8. Redireciona     │                       │                    │
   │    para dashboard  │                       │                    │
```

### Fluxo 2: Login com Google

```
Usuário        Frontend    Google      Backend         Database
   │             │           │            │              │
   │ 1. Clica    │           │            │              │
   │   "Google"  │           │            │              │
   ├────────────►│           │            │              │
   │             │ 2. Redireciona         │              │
   │             │    para Google         │              │
   │             ├──────────────────────► │              │
   │ 3. Autoriza │                        │              │
   │    no Google│                        │              │
   ├────────────►│                        │              │
   │             │ 4. Callback            │              │
   │             │ com authorization code │              │
   │             │◄──────────────────────┤              │
   │             │                        │              │
   │             │ 5. Exchange code       │              │
   │             │ for token              │              │
   │             ├───────────────────────►│              │
   │             │                        │ 6. Cria ou   │
   │             │                        │ busca usuario │
   │             │                        ├─────────────►│
   │             │                        │ 7. Retorna   │
   │             │                        │ usuario      │
   │             │                        │◄─────────────┤
   │             │                        │              │
   │             │ 8. JWT token           │              │
   │             │◄───────────────────────┤              │
   │             │                        │              │
   │ 9. Salva    │                        │              │
   │ token       │                        │              │
   │◄────────────┤                        │              │
   │             │                        │              │
   │ 10. Acessa  │                        │              │
   │ dashboard   │                        │              │
```

---

## 🔐 Proteção de Rotas

```
┌────────────────────────────────────────────────┐
│ Usuário tenta acessar rota protegida (/dashboard)
└────────────────┬───────────────────────────────┘
                 │
         ┌───────▼────────────┐
         │   Auth Guard       │
         │  (canActivate)     │
         └───────┬────────────┘
                 │
         ┌───────▼──────────────────┐
         │ Token existe no           │
         │ localStorage?             │
         └───────┬──────────────────┘
                 │
         ┌───────┴──────────┐
         │                  │
    NÃO  │                  │  SIM
         │                  │
    ┌────▼─────┐   ┌────────▼─────┐
    │ Redireciona   │ Valida Token │
    │ para /login   │              │
    └─────────────┘ └────────┬─────┘
                             │
                    ┌────────┴─────────┐
                    │                  │
                VÁLIDO│                 │INVÁLIDO
                    │                  │
             ┌──────▼────┐      ┌──────▼──────┐
             │ Acessa    │      │ Redireciona │
             │ dashboard │      │ para /login │
             └───────────┘      └─────────────┘
```

---

## 🔗 Estrutura de Dados

### User (Database)
```typescript
{
  id: UUID                    // Identificador único
  nome: string               // Nome do usuário
  email: string              // Email (único)
  senha: string              // Hash bcrypt
  googleId?: string          // ID do Google (se login social)
  createdAt: DateTime        // Data de criação
  updatedAt: DateTime        // Última atualização
}
```

### JWT Token
```json
{
  "sub": "uuid-do-usuario",
  "email": "usuario@example.com",
  "nome": "Nome do Usuário",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Response de Login
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "nome": "João",
    "email": "joao@example.com"
  }
}
```

---

## 📡 Endpoints da API

```
POST   /auth/register      - Criar nova conta
POST   /auth/login         - Login com email/senha
GET    /auth/google        - Iniciar OAuth Google
GET    /auth/google/callback - Callback do Google
GET    /auth/me            - Obter dados do usuário (autenticado)
POST   /auth/logout        - Fazer logout (frontend: limpar token)
```

---

## 🔀 Interceptor Flow

```
Requisição HTTP
      │
      ▼
┌─────────────────────────────┐
│ authInterceptor             │
├─────────────────────────────┤
│ 1. Obtém token do storage   │
│ 2. Se existe token:         │
│    - Adiciona header        │
│      Authorization: Bearer  │
│      {token}               │
│ 3. Passa para próximo       │
│    interceptor              │
└─────────┬───────────────────┘
          │
          ▼
    ┌──────────────┐
    │   Backend    │
    │   Processa   │
    └──────┬───────┘
           │
           ▼
    Resposta HTTP
```

---

## 🛡️ Segurança

```
┌─────────────────────────────────────┐
│      CAMADAS DE SEGURANÇA          │
├─────────────────────────────────────┤
│ 1. Frontend                         │
│    - Validação de formulário        │
│    - HTTPS em produção              │
│    - HttpOnly Cookies (recomendado) │
├─────────────────────────────────────┤
│ 2. Network                          │
│    - CORS configurado               │
│    - Header validation              │
├─────────────────────────────────────┤
│ 3. Backend                          │
│    - Validação de entrada (DTO)     │
│    - Hash de senha (bcrypt)         │
│    - JWT com secret                 │
│    - Proteção contra CSRF           │
├─────────────────────────────────────┤
│ 4. Database                         │
│    - Constraints de email único     │
│    - Campos obrigatórios            │
└─────────────────────────────────────┘
```

---

## 📊 Status Codes

| Code | Situação | Solução |
|------|----------|---------|
| 200 | Login sucesso | Salvar token e redirecionar |
| 400 | Dados inválidos | Validar formulário |
| 401 | Credenciais erradas | Mostrar mensagem de erro |
| 403 | Não autorizado | Redirecionar para login |
| 500 | Erro do servidor | Notificar usuário |

---

*Diagrama da arquitetura completa de autenticação - Campus Market 2026*
