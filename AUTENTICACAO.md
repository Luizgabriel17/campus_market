# Guia de Autenticação - Campus Market

## Visão Geral

Este guia descreve como usar a tela de login implementada no Campus Market com suporte a:
- Login com email e senha
- Login com Google OAuth
- Validação de formulário
- Proteção de rotas com JWT

---

## Funcionalidades Implementadas

### 1. **Tela de Login Melhorada**
- Design responsivo e moderno
- Validação em tempo real dos campos
- Visualização/ocultação de senha
- Indicadores visuais de carregamento
- Mensagens de erro e sucesso

### 2. **Login com Email e Senha**
```typescript
// O formulário envia:
{
  email: "usuario@example.com",
  senha: "senha_minimo_6_caracteres"
}

// A resposta inclui:
{
  token: "eyJhbGc...",
  user: {
    id: "uuid",
    nome: "Nome do Usuário",
    email: "usuario@example.com"
  }
}
```

### 3. **Login com Google**
- Redireciona para o Google OAuth
- Cria usuario automaticamente se não existir
- Retorna JWT token
- Salva token no localStorage

### 4. **Interceptor de Autenticação**
- Adiciona automaticamente o token JWT em todas as requisições
- Header: `Authorization: Bearer {token}`

### 5. **Guard de Rotas**
- Protege rotas autenticadas
- Redireciona para login se não autenticado

---

## Configuração

### Backend (NestJS)

#### Variáveis de Ambiente (`.env`)
```env
# Banco de dados
DATABASE_URL="postgresql://campus_user:campus_pass@localhost:5432/campus_market"

# API
PORT=3000

# JWT
JWT_SECRET="campusmarketjwt"

# Google OAuth
GOOGLE_CLIENT_ID="seu_client_id_aqui"
GOOGLE_CLIENT_SECRET="seu_client_secret_aqui"

# Frontend URL (para redirecionamento após Google login)
FRONTEND_URL="http://localhost:4200"
```

#### Instalar Dependências
```bash
cd campus-market-back
npm install
```

#### Executar o Backend
```bash
npm run start:dev
```

### Frontend (Angular)

#### Dependências Necessárias
- @angular/forms (Validação de formulário)
- @angular/common/http (HTTP Client)
- rxjs (Reactive Programming)

Já estão instaladas no `package.json`

#### Executar o Frontend
```bash
cd campus-market-front
npm install
npm start
```

O frontend estará disponível em: `http://localhost:4200`

---

## 📚 Arquitetura e Estrutura

### Serviço de Autenticação
**Arquivo:** `src/app/core/services/auth.ts`

```typescript
// Métodos disponíveis:
authService.login(data)           // Faz login com email/senha
authService.saveToken(token)      // Salva token no localStorage
authService.getToken()            // Recupera token do localStorage
authService.logout()              // Remove token do localStorage
```

### Componente de Login
**Arquivo:** `src/app/features/auth/pages/login/login.component.ts`

Funcionalidades:
- Validação de email (obrigatório, formato válido)
- Validação de senha (obrigatória, mínimo 6 caracteres)
- Botão de visibilidade de senha
- Indicador de carregamento
- Mensagens de erro e sucesso

### Callback do Google
**Arquivo:** `src/app/features/auth/pages/auth-callback/auth-callback.component.ts`

Processa o redirecionamento após login com Google:
1. Captura token da URL
2. Salva token no localStorage
3. Redireciona para dashboard

### Interceptor
**Arquivo:** `src/app/core/interceptors/auth-interceptor.ts`

Adiciona automaticamente o header `Authorization: Bearer {token}` em todas as requisições HTTP autenticadas.

### Guard de Rotas
**Arquivo:** `src/app/core/guards/auth-guard.ts`

Protege rotas que requerem autenticação. Exemplo:

```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]  // ← Protegida
  }
];
```

---

## 🌐 Flow de Login com Google

```
1. Usuário clica "Entrar com Google"
   ↓
2. Redireciona para: http://localhost:3000/auth/google
   ↓
3. Backend redireciona para Google OAuth
   ↓
4. Usuário autoriza no Google
   ↓
5. Google retorna para: http://localhost:3000/auth/google/callback
   ↓
6. Backend cria/busca usuário no banco de dados
   ↓
7. Backend gera JWT token
   ↓
8. Backend redireciona para: http://localhost:4200/auth/callback?token={JWT}
   ↓
9. Frontend salva token no localStorage
   ↓
10. Frontend redireciona para /dashboard
```

---

## 🎨 Estilo e Responsividade

A tela de login possui:
- ✅ Gradiente de fundo moderno
- ✅ Card com sombra e animação
- ✅ Design responsivo para mobile (< 480px)
- ✅ Suporte a modo escuro (prefers-color-scheme)
- ✅ Animações suaves

### Pontos de Breakpoint
- Desktop: > 768px
- Tablet: 480px - 768px
- Mobile: < 480px

---

## 🔒 Segurança

### ✅ Implementado
- Validação de email e senha no frontend
- JWT token salvo no localStorage
- Token enviado em header Authorization
- Proteção de rotas com guard

### 📌 Recomendações Adicionais
- [ ] Usar HttpOnly Cookies ao invés de localStorage (mais seguro)
- [ ] Implementar refresh token
- [ ] Rate limiting no backend
- [ ] HTTPS em produção
- [ ] CSRF protection

---

## 🧪 Testando a Autenticação

### Teste 1: Login com Email/Senha
1. Abra `http://localhost:4200`
2. Digite email: `teste@example.com`
3. Digite senha: `123456`
4. Clique em "Entrar"
5. Se sucesso, token será salvo e usuário redirecionado

### Teste 2: Login com Google
1. Abra `http://localhost:4200`
2. Clique em "Entrar com Google"
3. Autorize a aplicação
4. Se sucesso, token será salvo e usuário redirecionado

### Teste 3: Verificar Token
No console do navegador (F12):
```javascript
localStorage.getItem('token')
```

---

## 🐛 Troubleshooting

### Problema: CORS error
**Solução:** Backend deve ter CORS habilitado para a porta do frontend (4200)

### Problema: Google login não funciona
**Verificar:**
- Google Client ID está correto no `.env`
- Google Client Secret está correto
- Redirects URI está configurado no Google Console

### Problema: Token não é salvo
**Verificar:**
- localStorage não está desabilitado no navegador
- Response do backend inclui campo `token`

---

## 📦 Endpoints da API

### POST /auth/register
Registrar novo usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "123456"
  }'
```

### POST /auth/login
Fazer login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "123456"
  }'
```

### GET /auth/google
Iniciar OAuth com Google
```bash
# Abre no navegador:
http://localhost:3000/auth/google
```

### GET /auth/me
Obter dados do usuário autenticado
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer {token}"
```

---

## 📝 Próximos Passos

- [ ] Criar página de registro
- [ ] Implementar esqueci a senha
- [ ] Adicionar autenticação social (GitHub, Facebook)
- [ ] Implementar refresh token
- [ ] Dashboard do usuário
- [ ] Perfil do usuário com edição

---

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Logs do backend: `npm run start:dev`
2. Console do navegador: F12
3. Network tab para debug de requisições

---

**Última atualização:** Maio 2026
