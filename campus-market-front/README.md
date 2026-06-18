# Campus Market - Frontend

Frontend da plataforma Campus Market desenvolvido em Angular.

O sistema permite que alunos comprem lanches de vendedores dentro do ambiente acadêmico, acompanhem seus pedidos e realizem pagamentos. Os vendedores podem cadastrar produtos, acompanhar pedidos recebidos e controlar entregas.

---

# Tecnologias Utilizadas

* Angular 20+
* TypeScript
* RxJS
* Angular Router
* Angular Signals
* Bootstrap (opcional)
* HTML5
* CSS3
* JWT Authentication

---

# Requisitos

* Node.js 22+
* npm 10+
* Backend Campus Market rodando
* Banco PostgreSQL configurado

---

# Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/campus-market-front.git

cd campus-market-front
```

Instale as dependências:

```bash
npm install
```

---

# Configuração da API

Verifique se os serviços utilizam a URL correta do backend.

Exemplo:

```typescript
private readonly apiUrl = 'http://localhost:3001/api';
```

Caso utilize Codespaces ou outro ambiente, ajuste conforme necessário.

---

# Executando o Projeto

Iniciar Angular:

```bash
npm start
```

ou

```bash
ng serve
```

A aplicação ficará disponível em:

```text
http://localhost:4200
```

---

# Estrutura Principal

```text
src/
 ├── app/
 │   ├── core/
 │   │   ├── services/
 │   │   ├── guards/
 │   │   └── interceptors/
 │   │
 │   ├── pages/
 │   │   ├── login/
 │   │   ├── register/
 │   │   ├── home/
 │   │   ├── cart/
 │   │   ├── checkout/
 │   │   ├── my-orders/
 │   │   └── vendedor/
 │   │
 │   ├── shared/
 │   └── app.routes.ts
 │
 └── assets/
```

---

# Funcionalidades Implementadas

## Autenticação

### Login

Permite acesso ao sistema através de:

* E-mail
* Senha

Após autenticação:

* JWT é armazenado
* Usuário permanece autenticado
* Redirecionamento por perfil

### Cadastro

Permite criar usuários:

* Cliente
* Vendedor

---

# Cliente

## Home

Página principal do cliente.

Exibe:

* Lista de lanches
* Nome do vendedor
* Estoque disponível
* Descrição
* Imagem
* Preço

Permite:

* Adicionar ao carrinho
* Abrir carrinho
* Acompanhar pedidos
* Fazer logout

---

## Carrinho

Exibe:

* Produtos adicionados
* Quantidade
* Valor unitário
* Valor total

Permite:

* Remover item
* Finalizar compra

---

## Checkout

Permite escolher:

* PIX
* Dinheiro (CASH)

Ao confirmar:

* Pedido é criado
* Estoque é atualizado
* Carrinho é limpo

---

## Meus Pedidos

Tela responsiva baseada no layout da Home.

Exibe:

* Número do pedido
* Data
* Status
* Nome do vendedor
* Produtos comprados
* Forma de pagamento
* Valor total

Status possíveis:

```text
PENDENTE
PAGO
ENTREGUE
CANCELADO
```

---

# Área do Vendedor

## Dashboard

Recebe pedidos em tempo real.

Atualização automática:

```text
A cada 10 segundos
```

Exibe:

* Cliente
* Produtos vendidos
* Quantidades
* Valor total
* Data do pedido

---

## Aprovação de Pagamento

O vendedor pode:

```text
PENDENTE -> PAGO
```

Botão:

```text
Confirmar Pagamento
```

---

## Entrega

Após pagamento:

```text
PAGO -> ENTREGUE
```

Botão:

```text
Entregar Pedido
```

---

## Cadastro de Lanches

Permite cadastrar:

* Nome
* Categoria
* Preço
* Estoque
* Descrição
* Imagem

Cada produto fica associado ao vendedor logado.

---

# Serviços Disponíveis

## AuthService

Responsável por:

* Login
* Logout
* JWT
* Usuário logado

---

## ProductService

Responsável por:

* Listar produtos
* Criar produtos
* Atualizar produtos
* Remover produtos

---

## CartService

Responsável por:

* Obter carrinho
* Adicionar itens
* Remover itens

---

## OrderService

Responsável por:

* Criar pedidos
* Buscar pedidos do cliente
* Buscar pedidos do vendedor
* Atualizar pagamento
* Atualizar status

---

# Rotas Principais

## Públicas

```text
/login
/register
```

---

## Cliente

```text
/home
/cart
/checkout
/my-orders
```

---

## Vendedor

```text
/vendedor/dashboard
/vendedor/products
/vendedor/products-form
```

---

# Segurança

Implementado:

* JWT Authentication
* Auth Interceptor
* Route Guards
* Controle de Perfil

Perfis:

```text
CLIENTE
VENDEDOR
ADMIN
```

---

# Fluxo Completo

1. Cliente realiza login
2. Cliente adiciona itens ao carrinho
3. Cliente finaliza pedido
4. Pedido é enviado ao vendedor
5. Vendedor confirma pagamento
6. Pedido muda para PAGO
7. Vendedor entrega lanche
8. Pedido muda para ENTREGUE
9. Cliente acompanha tudo em "Meus Pedidos"

---

# Comandos Úteis

Instalar dependências:

```bash
npm install
```

Executar:

```bash
npm start
```

Build:

```bash
ng build
```

Build Produção:

```bash
ng build --configuration production
```

Executar testes:

```bash
ng test
```

---

# Status Atual do Projeto

Funcionalidades concluídas:

* Autenticação JWT
* Cadastro de usuários
* Cadastro de categorias
* Cadastro de produtos
* Carrinho
* Checkout
* Pedidos
* Pagamentos
* Dashboard do vendedor
* Exibição do vendedor nos produtos
* Exibição do vendedor nos pedidos
* Atualização automática de pedidos
