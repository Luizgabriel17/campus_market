# 🎓 IFRN CampusMarket — Documentação Técnica Completa

Bem-vindo à documentação oficial do **IFRN CampusMarket**, um ecossistema de marketplace local desenvolvido para simplificar o comércio independente de lanches e conveniências entre estudantes e servidores dentro do campus universitário.

Este sistema foi projetado sob a premissa do modelo de **Aluno Vendedor Independente** (os produtos são preparados externamente, trazidos prontos ao campus e entregues diretamente nos pontos de retirada).

---

## 🏗️ 1. Arquitetura do Sistema

O projeto é dividido em uma estrutura monorepo desacoplada:

```text
campus-market/
│
├── campus-market-back/      # API Restful (NestJS, Prisma, PostgreSQL/SQLite)
│   ├── prisma/             # Schema do Banco de Dados e Migrations
│   └── src/                # Código-fonte NestJS (Módulos, Controllers, Services, Guards)
│
└── campus-market-front/     # Aplicação Single Page (Angular 17+, Bootstrap, CSS)
    └── src/app/            # Componentes, Páginas, Serviços de API e Guards
```

---

## 🔒 2. Relatório de Auditoria de Segurança

O sistema foi auditado sob as melhores práticas da OWASP (Open Web Application Security Project) para mitigar riscos de intrusão e manipulação de dados:

1. **Prevenção contra Injeção de SQL (SQL Injection):**
   * **Mecanismo:** Uso do ORM **Prisma**. Toda e qualquer consulta ao banco de dados utiliza consultas parametrizadas por padrão sob a Engine do Prisma. Nenhuma string SQL bruta contendo parâmetros do usuário é executada.
2. **Criptografia e Proteção de Credenciais:**
   * **Mecanismo:** Criptografia unidirecional usando **bcrypt** com fator de custo de salting configurado em `10` em `auth.service.ts` do backend. Senhas brutas nunca entram no banco de dados e as senhas novas geradas na recuperação são criptografadas antes de serem salvas.
3. **Autenticação e Autorização por Token (JWT):**
   * **Mecanismo:** Uso de **JSON Web Tokens (JWT)** assinados de forma segura e configurados com expiração automática (`1 dia`).
   * **Route Guards:** Endpoints restritos são protegidos pelo `JwtAuthGuard`. As rotas operacionais exclusivas dos vendedores (como criação de produtos e controle de pedidos) são duplamente protegidas com o `RolesGuard` (`src/common/guards/roles.guard.ts`) validando os privilégios declarados no token.
4. **Sanitização e Validação de Dados:**
   * **Mecanismo:** Validação ativa em nível global no NestJS utilizando `ValidationPipe` e validadores de classe (`class-validator`, `class-transformer`) nos DTOs (Data Transfer Objects). Parâmetros adicionais são descartados e formatos inválidos de e-mails ou números de telefones são bloqueados imediatamente nas rotas.
5. **CORS (Cross-Origin Resource Sharing):**
   * **Mecanismo:** CORS restrito explicitamente à origem permitida do frontend (`http://localhost:4200`) e cabeçalhos autorizados no arquivo de entrada `main.ts` do backend.
6. **Gerenciamento Seguro de Segredos:**
   * **Mecanismo:** Credenciais do SMTP de e-mails (`MAIL_USER`, `MAIL_PASS`) e a chave de criptografia do token (`JWT_SECRET`) são injetadas em tempo de execução via variáveis de ambiente (`.env`), sem qualquer dado sigiloso hardcoded nos arquivos de código.

---

## 📋 3. Schema do Banco de Dados (Prisma)

Abaixo estão descritas as principais tabelas estruturadas em `prisma/schema.prisma`:

* **User (Usuário):** Guarda credenciais, avatar e o tipo de conta (`CLIENTE`, `VENDEDOR`, `ADMIN`).
* **Product (Produto):** Armazena as vitrines, com preço, estoque, status e vínculo obrigatório ao `User` (vendedor) e `Category` (categoria).
* **Category (Categoria):** Categorias como "Salgados", "Doces" e "Bebidas".
* **Address (Endereço):** Pontos de retirada cadastrados pelo vendedor ou endereços de entrega dos clientes. O ponto padrão padrão configurado é o *Centro de Vivência do IF-PAR*.
* **Order & OrderItem (Pedidos):** Estrutura que liga o cliente ao vendedor, guardando o valor total, endereço de retirada, observações do pedido e o horário acordado para retirada.
* **Payment (Pagamento):** Registra o valor, o método escolhido (PIX ou Dinheiro) e o status do pagamento (`PENDENTE`, `APROVADO`, `RECUSADO`).
* **EmailVerification (Códigos OTP):** Tabela temporária para armazenar códigos OTP de 6 dígitos para confirmação de e-mail e recuperação de senhas expirando em 15 minutos.

---

## ⚙️ 4. Fluxos de Funcionalidades Básicas e Avançadas

### 🔑 Autenticação e Registro Seguro
* **Fluxo de Confirmação:** O registro de usuários cria a conta como pendente de verificação (`emailVerified: false`). Um código OTP de 6 dígitos é enviado ao e-mail institucional do estudante. A conta é liberada após a digitação correta do código.

### 📧 Sistema de Recuperação de Senha (Esqueci a Senha)
* **Envio OTP via Nodemailer:** Através da rota `/auth/forgot-password`, o backend valida o e-mail, gera um código OTP e o despacha utilizando o `MailService` (`mail.service.ts`) via o transporte SMTP do **Nodemailer**.
* **Redefinição:** Na interface de redefinição (/forgot-password), o usuário fornece o código recebido, digita a nova senha, confirma e realiza a troca reativa via `/auth/reset-password`.

### 🛒 Carrinho e Checkout Customizado
* **Pontos de Retirada:** O cliente pode cadastrar endereços no perfil. Por padrão, o *Centro de Vivência do IF-PAR* é cadastrado como ponto inicial.
* **Agendamento de Retirada:** No carrinho, o cliente escolhe a data e horário de retirada através do seletor `datetime-local` responsivo. Os dados são convertidos de forma legível (ex: `06/07/2026 às 14:30`) antes de chegarem ao vendedor.

### 📊 Painel de Vendas (Vendedor)
* **Métricas do Painel:** Exibição do Faturamento Total, Pedidos Pendentes, A preparar e Entregues no topo.
* **Ações Rápidas:** Botões para confirmar o pagamento (`APROVADO`), finalizar a entrega (`ENTREGUE`) ou realizar o cancelamento completo do pedido.
* **Cancelamento Seguro:** O botão "Cancelar Pedido" atualiza o status do pedido para `CANCELADO` e altera o status do pagamento para `RECUSADO` no banco de dados.

### 📲 Integração Direta com WhatsApp (`wa.me`)
Tanto clientes quanto vendedores possuem canais de chat abertos de forma rápida para facilitar as entregas no campus:
* **Meus Pedidos (Cliente):** Se o pedido estiver ativo (não entregue ou cancelado), um botão reativo "Contatar Vendedor" redireciona para o link `https://wa.me/55[Telefone]?text=[Mensagem]`.
* **Painel de Pedidos (Vendedor):** Botão "WhatsApp Cliente" disponível nos cards ativos para tirar dúvidas sobre pontos de retirada ou lanches.
* **Mapeamento:** O frontend higieniza o telefone limpando caracteres não-numéricos e insere o código do país `55` automaticamente caso não esteja presente.

---

## 🎨 5. Sistema de Animações e Design (UX/UI)

Para garantir uma interface reativa, viva e moderna que atenda aos padrões exigentes de UX/UI, implementei as seguintes animações CSS:

1. **Staggered Cards (Cascade Entrance):**
   * **Mecanismo:** Ao carregar a Home, a página de Meus Pedidos ou o Dashboard, os cards entram de baixo para cima sequencialmente com atrasos baseados no índice do loop Angular (`[style.--index]="i"`).
2. **Micro-interações Reativas:**
   * **Botões:** Efeitos de hover tridimensionais, transições de preenchimento suaves e clique elástico (`transform: scale(0.98)`).
   * **Carrinho:** O badge vermelho do cabeçalho reage com uma animação de pulso (`scalePop`) toda vez que um produto é inserido no carrinho.
   * **Categorias:** Carousel horizontal reativo a toques e gestos no mobile com animação ativa no pill selecionado.
3. **Timeline Visual de Acompanhamento (Cliente):**
   * Uma linha de progresso contendo ícones animados mostra em qual etapa o lanche se encontra: `Pedido Realizado 📝` ➔ `Pronto para Retirada 🛍️` ➔ `Entregue 🎁`.

---

## 🚀 6. Como Executar o Projeto Localmente

### Pré-requisitos
* **Node.js** v22 ou superior
* **npm** v10 ou superior
* Banco de Dados **PostgreSQL** instalado e ativo (ou SQLite caso configurado no Prisma)

### Configuração do Backend
1. Navegue até a pasta do backend:
   ```bash
   cd campus-market-back
   ```
2. Crie e configure o arquivo `.env` na raiz da pasta seguindo o modelo:
   ```env
   DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/campusmarket"
   JWT_SECRET="chave_segura_de_criptografia"
   MAIL_USER="seu-email-smtp@gmail.com"
   MAIL_PASS="sua-senha-de-aplicativo-smtp"
   PORT=3001
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Gere o cliente do Prisma e empurre a estrutura de tabelas ao banco:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```
   *O backend estará rodando em:* `http://localhost:3001`

### Configuração do Frontend
1. Navegue até a pasta do frontend:
   ```bash
   cd ../campus-market-front
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento do Angular:
   ```bash
   npm start
   ```
   *O frontend estará aberto em:* `http://localhost:4200`
