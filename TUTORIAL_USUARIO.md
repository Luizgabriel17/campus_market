# 📖 Tutorial: Como Usar a Tela de Login

## 👨‍💼 Para o Desenvolvedor

### Setup Inicial (5 minutos)

#### Passo 1: Instalar Dependências Backend
```bash
cd campus-market-back
npm install
```

#### Passo 2: Configurar Banco de Dados
```bash
# Subir PostgreSQL com Docker
docker-compose up -d

# Executar migrations
npx prisma migrate dev
```

#### Passo 3: Configurar Google OAuth
Edite `.env` na pasta backend:
```env
GOOGLE_CLIENT_ID="seu_client_id_aqui"
GOOGLE_CLIENT_SECRET="seu_client_secret_aqui"
```

#### Passo 4: Executar Backend
```bash
npm run start:dev
```

#### Passo 5: Instalar Dependências Frontend
```bash
cd campus-market-front
npm install
npm start
```

**✅ Pronto! Acesse `http://localhost:4200`**

---

## 👤 Para o Usuário Final

### Fluxo 1: Registrar Nova Conta

```
1. Acesse http://localhost:4200/register

2. Preencha os dados:
   └─ Nome Completo: "João Silva"
   └─ Email: "joao@example.com"
   └─ Senha: "min6chars"
   └─ Confirmar Senha: "min6chars"

3. Clique em "Criar Conta"

4. Aguarde... (você verá um spinner)

5. Se sucesso:
   └─ Mensagem verde aparece
   └─ Redireciona para /dashboard automaticamente
   └─ Token salvo no navegador

6. Se erro:
   └─ Mensagem vermelha aparece
   └─ Corrija os dados e tente novamente
```

### Fluxo 2: Fazer Login com Email/Senha

```
1. Acesse http://localhost:4200 (ou clique em "Faça login")

2. Preencha os dados:
   └─ Email: seu email registrado
   └─ Senha: sua senha

3. Clique no ícone "👁️ Mostrar" para visualizar senha (opcional)

4. Clique em "Entrar"

5. Aguarde... (botão fica desabilitado)

6. Se sucesso:
   └─ "Login realizado com sucesso!" (verde)
   └─ Redireciona para /dashboard em 1.5s
   └─ Token JWT armazenado

7. Se erro:
   └─ Mensagem de erro vermelha aparece
   └─ Exemplo: "Email ou senha incorretos. Tente novamente."
```

### Fluxo 3: Fazer Login com Google

```
1. Acesse http://localhost:4200

2. Clique em "Entrar com Google"

3. Você será redirecionado para Google

4. Autorize a aplicação
   └─ Escolha a conta do Google
   └─ Clique em "Autorizar"

5. Será redirecionado de volta para a aplicação

6. Veja o spinner "Autenticando..."

7. Se sucesso:
   └─ Redireciona para /dashboard
   └─ Token salvo automaticamente

8. Se erro:
   └─ Vê mensagem de erro
   └─ Retorna para página de login
```

---

## 🎨 Elementos Visuais da Tela

### Tela de Login

```
╔════════════════════════════════════════╗
║                                        ║
║         🔐 CampusMarket 🔐             ║ ← Logo com gradiente
║         Entre na sua conta              ║ ← Subtítulo
║                                        ║
║  ┌──────────────────────────────────┐  ║
║  │ Email                            │  ║ ← Campo de entrada
║  │ seu.email@example.com            │  ║
║  └──────────────────────────────────┘  ║
║                                        ║
║  ┌──────────────────────────────────┐  ║
║  │ Senha            👁️ Mostrar      │  ║ ← Botão toggle
║  │ ••••••••••                       │  ║
║  └──────────────────────────────────┘  ║
║                                        ║
║  ┌──────────────────────────────────┐  ║
║  │       🔄 Entrar                  │  ║ ← Botão com spinner
║  └──────────────────────────────────┘  ║
║                                        ║
║         ─ ou ─                          ║ ← Divisor
║                                        ║
║  ┌──────────────────────────────────┐  ║
║  │  G  Entrar com Google            │  ║ ← Botão Google
║  └──────────────────────────────────┘  ║
║                                        ║
║  Não tem uma conta? Crie uma agora ►   ║ ← Link para registro
║                                        ║
╚════════════════════════════════════════╝

Gradiente Background: Roxo (start) → Violeta (end)
```

### Validação Visual

```
Campo com Erro:
┌──────────────────────────────┐
│ Email                        │
│ seu.email@example.com        │
│ ✗ Email inválido             │  ← Texto vermelho
└──────────────────────────────┘
  └─ Fundo rosa claro (feedback)

Campo Válido:
┌──────────────────────────────┐
│ Email                        │
│ usuario@example.com          │
│ ✓ (sem mensagem)             │
└──────────────────────────────┘
  └─ Fundo branco (normal)
```

### Mensagens de Feedback

```
Sucesso:
╔════════════════════════════════════════╗
║ ✓ Login realizado com sucesso!         │ ← Verde
║ Redirecionando...                      │
╚════════════════════════════════════════╝

Erro:
╔════════════════════════════════════════╗
║ ⚠️ Email ou senha incorretos.          │ ← Vermelho
║ Tente novamente.                       │
╚════════════════════════════════════════╝
```

---

## 🔄 Estados dos Componentes

### Botões

```
ESTADO 1: Normal (Habilitado)
┌─────────────────────┐
│ Entrar              │ ← Preto/Gradiente
└─────────────────────┘

ESTADO 2: Hover (Mouse Over)
┌─────────────────────┐
│ Entrar              │ ← Mais escuro, elevado
└─────────────────────┘
  Sombra aumentada

ESTADO 3: Carregando (Desabilitado)
┌─────────────────────┐
│ 🔄 (spinner)        │ ← Opaco, não clicável
└─────────────────────┘

ESTADO 4: Ativo (Click)
┌─────────────────────┐
│ Entrar              │ ← Voltando ao normal
└─────────────────────┘
  Sombra reduzida
```

### Campos de Entrada

```
VAZIO/NORMAL:
┌────────────────────────────────┐
│ seu.email@example.com          │ ← Placeholder cinza
└────────────────────────────────┘

FOCO:
┌────────────────────────────────┐
│ usuario@example.com│           │ ← Cursor piscando
└────────────────────────────────┘
  Borda roxo (primária)
  Sombra interna roxo claro

COM ERRO:
┌────────────────────────────────┐
│ invalido                        │
└────────────────────────────────┘
  Borda vermelha
  Fundo rosa claro
```

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Tab` | Navegar entre campos |
| `Enter` | Submeter formulário |
| `Shift+Tab` | Navegar para trás |
| `Escape` | (Futuro) Limpar campo |

---

## 📱 Responsividade

### Desktop (> 768px)
```
┌──────────────────────────────────────┐
│                                      │
│  ┌──────────────────────────────┐   │
│  │                              │   │
│  │   Card (400px)               │   │
│  │   Padding: 40px              │   │
│  │                              │   │
│  └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

### Tablet (480px - 768px)
```
┌────────────────────────────┐
│                            │
│  ┌──────────────────────┐ │
│  │                      │ │
│  │   Card (menor)       │ │
│  │   Padding: 25px      │ │
│  │                      │ │
│  └──────────────────────┘ │
│                            │
└────────────────────────────┘
```

### Mobile (< 480px)
```
┌──────────────────┐
│                  │
│  Card (100%)    │
│  Padding: 15px  │
│                  │
│                  │
│                  │
│                  │
└──────────────────┘
```

---

## 🔍 Dicas de Uso

### Para Testar Login
1. **Use email válido**: `usuario@example.com`
2. **Senha mínimo 6**: `senha123`
3. **Verifique typos**: Email é case-insensitive, mas caracteres importam

### Para Testar Google
1. Use uma conta Gmail real
2. Aceite as permissões
3. Primeira autenticação pode demorar um pouco

### Debugging
1. Abra DevTools: `F12`
2. Aba "Network": veja requisições
3. Aba "Console": veja erros
4. Aba "Application": veja token no localStorage

```javascript
// No console (F12):
localStorage.getItem('token')  // Ver token
localStorage.removeItem('token')  // Remover token
console.log('Token:', localStorage.getItem('token'))
```

---

## 🆘 Problemas Comuns e Soluções

### "Erro ao conectar ao servidor"
- [ ] Backend está rodando? (`npm run start:dev`)
- [ ] Porta 3000 está livre?
- [ ] URL do backend está correta?

### "Email ou senha inválidos"
- [ ] Email existe no banco?
- [ ] Senha está correta?
- [ ] Verifique maiúsculas/minúsculas no email

### "Google login não funciona"
- [ ] Client ID está configurado?
- [ ] Client Secret está correto?
- [ ] Redirect URI está no Google Console?

### "Token não é salvo"
- [ ] localStorage está habilitado?
- [ ] Backend retorna campo `token`?
- [ ] Verifique network tab

---

## 💡 Melhor Prática

✅ Fazer:
- Use email real para Google
- Digite senha com cuidado
- Verifique se campos são obrigatórios
- Clique apenas uma vez no botão
- Aguarde o processo completar

❌ Não fazer:
- Não refresque página durante login
- Não clique múltiplas vezes
- Não limpe localStorage enquanto usa
- Não compartilhe token

---

*Tutorial completo de uso da tela de login - Campus Market 2026*
