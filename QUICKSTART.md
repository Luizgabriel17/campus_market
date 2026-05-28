# 🎯 Quick Start - Tela de Login Campus Market

## ⚡ Iniciar Rapidamente

### 1️⃣ Backend
```bash
cd campus-market-back
npm install
docker-compose up -d  # Inicia o banco de dados
npx prisma migrate dev  # Configura banco
npm run start:dev
```
✅ Backend rodando em `http://localhost:3000`

### 2️⃣ Frontend
```bash
cd campus-market-front
npm install
npm start
```
✅ Frontend rodando em `http://localhost:4200`

---

## 🔐 Testar Login

### Via Email/Senha
1. Criar usuário:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"User","email":"user@test.com","senha":"123456"}'
```

2. Abrir `http://localhost:4200` no navegador
3. Preencher credenciais
4. Clique em "Entrar" ✅

### Via Google
1. Configure credenciais no `.env`
2. Clique em "Entrar com Google" ✅

---

## 📱 O que foi criado

| Componente | Arquivo | Status |
|------------|---------|--------|
| Login | `auth/pages/login/` | ✅ |
| Registro | `auth/pages/register/` | ✅ |
| Google Callback | `auth/pages/auth-callback/` | ✅ |
| Auth Service | `core/services/auth.ts` | ✅ |
| Auth Interceptor | `core/interceptors/auth-interceptor.ts` | ✅ |
| Auth Guard | `core/guards/auth-guard.ts` | ✅ |

---

## 📄 Documentação

- 📖 [AUTENTICACAO.md](./AUTENTICACAO.md) - Documentação completa
- 📋 [RESUMO_LOGIN.md](./RESUMO_LOGIN.md) - Resumo da implementação
- 🚀 [GUIA_EXECUCAO.md](./GUIA_EXECUCAO.md) - Passo a passo de execução

---

## ✨ Funcionalidades

- ✅ Tela de login moderna e responsiva
- ✅ Validação de formulário em tempo real
- ✅ Login com email e senha
- ✅ Login com Google OAuth
- ✅ Tela de registro
- ✅ JWT Authentication
- ✅ HTTP Interceptor automático
- ✅ Route Guard para proteger rotas

---

## 🔗 Links Úteis

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`
- Prisma Studio: `npx prisma studio` (após conectar BD)

---

**Tudo pronto! 🎉**

Dúvidas? Veja a documentação nos arquivos `.md`
