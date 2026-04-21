const express = require("express");
const app = express();

const path = require("path");
const session = require("express-session");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

require("dotenv").config();

// ROTAS
const authRoutes = require("./routes/auth");
const registerRoutes = require("./routes/register");
const clienteRoutes = require("./routes/cliente");
const dashboardRoutes = require("./routes/dashboard");
const pedidosRoutes = require("./routes/pedidos");
const carrinhoRoutes = require("./routes/carrinho");
const avaliacoesRoutes = require("./routes/avaliacoes");

// VIEWS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARES
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 🔥 SESSION SIMPLES (SEM MYSQL)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60
  }
}));

// GLOBALS
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ROTAS
app.use("/", authRoutes);
app.use("/register", registerRoutes);
app.use("/cliente", clienteRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/carrinho", carrinhoRoutes);
app.use("/avaliacoes", avaliacoesRoutes);

// TESTE
app.get("/api/test", (req, res) => {
  res.json({ status: "ok" });
});

// PÁGINAS
app.get("/", (req, res) => res.render("landing"));
app.get("/redirect", (req, res) => res.render("redirect"));
app.get("/redirect-cliente", (req, res) => res.render("redirect-cliente"));

// ERROS
app.use((req, res) => res.status(404).send("Página não encontrada"));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Erro interno");
});

// PORTA
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Servidor rodando na porta", PORT);
});