# 🚀 Guia de Execução - Campus Market

## 📋 Pré-requisitos

- Node.js v18+ e npm
- PostgreSQL (ou Docker para executar via docker-compose)
- Git

## 🔧 Setup Inicial

### 1. Clonar o Repositório
```bash
git clone <seu-repositorio>
cd campus-market
```

### 2. Backend (NestJS)

#### 2.1 Instalar Dependências
```bash
cd campus-market-back
npm install
```

#### 2.2 Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz de `campus-market-back`:

```env
# Banco de dados (via docker-compose)
DATABASE_URL="postgresql://campus_user:campus_pass@localhost:5432/campus_market"

# API
PORT=3000

# JWT
JWT_SECRET="campusmarketjwt"

# Google OAuth
GOOGLE_CLIENT_ID="seu_client_id_do_google"
GOOGLE_CLIENT_SECRET="seu_client_secret_do_google"

# Frontend URL (para redirecionamento após Google login)
FRONTEND_URL="http://localhost:4200"
```

#### 2.3 Setup do Banco de Dados (Usando Docker)

```bash
# Na raiz de campus-market-back, execute:
docker-compose up -d

# Executar migrations do Prisma
npx prisma migrate dev
```

#### 2.4 Executar o Backend
```bash
# Em desenvolvimento (com hot-reload)
npm run start:dev

# Em produção
npm run build
npm run start
```

**O backend estará rodando em:** `http://localhost:3000`

---

### 3. Frontend (Angular)

#### 3.1 Instalar Dependências
```bash
cd campus-market-front
npm install
```

#### 3.2 Verificar Configuração do Ambiente

O arquivo `src/environments/environments.ts` já está configurado com:
```typescript
export const environment = {
  apiUrl: 'http://localhost:3000',
};
```

Se necessário, ajuste a URL da API.

#### 3.3 Executar o Frontend
```bash
# Em desenvolvimento
npm start

# Em produção
npm run build
```

**O frontend estará rodando em:** `http://localhost:4200`

---

## 🔑 Configuração do Google OAuth

### Passo 1: Criar Aplicação no Google Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Vá para "APIs e Serviços" > "Credenciais"
4. Crie uma credencial do tipo "OAuth 2.0 ID do cliente"
5. Tipo de aplicação: "Aplicação Web"
6. URIs autorizados (JavaScript):
   - `http://localhost:4200`
   - `http://localhost:3000`
7. URIs de redirecionamento autorizados:
   - `http://localhost:3000/auth/google/callback`

### Passo 2: Adicionar ao `.env`

```env
GOOGLE_CLIENT_ID="seu_client_id_aqui"
GOOGLE_CLIENT_SECRET="seu_client_secret_aqui"
```

---

## 📝 Testes Iniciais

### Teste 1: Verificar se o Backend está Rodando
```bash
curl http://localhost:3000
# Deve retornar a resposta da aplicação NestJS
```

### Teste 2: Verificar se o Frontend está Rodando
```bash
# Abra no navegador:
http://localhost:4200
# Deve carregar a página de login
```

### Teste 3: Testar Login com Email/Senha

1. Registre um novo usuário pelo endpoint:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste User",
    "email": "teste@example.com",
    "senha": "123456"
  }'
```

2. Abra `http://localhost:4200` no navegador
3. Preencha o formulário com as credenciais criadas
4. Clique em "Entrar"
5. Você deve ser redirecionado para `/dashboard` (se existir)

### Teste 4: Testar Login com Google

1. Abra `http://localhost:4200` no navegador
2. Clique em "Entrar com Google"
3. Autorize a aplicação
4. Você deve ser redirecionado para `/dashboard` (se existir)

---

## 🛠️ Comandos Úteis

### Backend

```bash
# Instalar dependências
npm install

# Desenvolvimento com hot-reload
npm run start:dev

# Build para produção
npm run build

# Executar produção
npm run start

# Executar testes
npm run test

# Executar testes E2E
npm run test:e2e

# Gerar nova migration do Prisma
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrations
npx prisma migrate deploy

# Abrir Prisma Studio
npx prisma studio
```

### Frontend

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm start

# Build para produção
npm run build

# Testes
npm run test

# Lint
npm run lint
```

---

## 📊 Status da Implementação

### ✅ Pronto para Usar
- [x] Tela de Login
- [x] Tela de Registro
- [x] Login com Email/Senha
- [x] Login com Google
- [x] Interceptor JWT
- [x] Guard de Rotas
- [x] Serviço de Autenticação

### 🔄 Em Desenvolvimento (Próximos Passos)
- [ ] Dashboard
- [ ] Perfil do Usuário
- [ ] Esqueci a Senha
- [ ] Validação de Email
- [ ] 2FA
- [ ] Redes Sociais Adicionais

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
# Limpe node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erro: "ECONNREFUSED" (Backend não está rodando)
```bash
# Verifique se o backend está rodando na porta 3000
lsof -i :3000

# Inicie o backend:
cd campus-market-back
npm run start:dev
```

### Erro: "CORS error"
```
# Verifique se o CORS está habilitado no backend
# Arquivo: src/main.ts
# Certifique-se de que a porta do frontend (4200) está liberada
```

### Erro: "GOOGLE_CLIENT_ID is not configured"
```
# Verifique o arquivo .env do backend
# Adicione as credenciais do Google:
GOOGLE_CLIENT_ID="seu_client_id"
GOOGLE_CLIENT_SECRET="seu_client_secret"
```

### Erro: "Token not found"
```javascript
// No console do navegador:
localStorage.getItem('token')
// Se retornar null, o login falhou

// Verifique no Network tab o status da requisição de login
```

---

## 📚 Documentação

Para mais detalhes sobre autenticação, veja:
- [AUTENTICACAO.md](./AUTENTICACAO.md) - Guia completo de autenticação
- [RESUMO_LOGIN.md](./RESUMO_LOGIN.md) - Resumo da implementação

---

## 🎯 Checklist de Inicialização

- [ ] Node.js e npm instalados
- [ ] PostgreSQL/Docker configurado
- [ ] `.env` do backend configurado
- [ ] Google OAuth configurado
- [ ] Backend rodando (`npm run start:dev`)
- [ ] Frontend rodando (`npm start`)
- [ ] Navegador aberto em `http://localhost:4200`
- [ ] Teste login realizado com sucesso

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do terminal
2. Abra a aba "Network" no DevTools (F12) para debug
3. Verifique se as portas 3000 (backend) e 4200 (frontend) estão livres
4. Consulte a documentação nos arquivos `.md`

---

**Pronto para começar! 🎉**

*Última atualização: Maio 2026*
