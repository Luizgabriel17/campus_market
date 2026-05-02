const express = require("express");
const app = express();

const path = require("path");
const session = require("express-session");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

// 🔌 CONEXÃO COM BANCO (USA O SEU ARQUIVO)
const db = require("./db");

// ROTAS
const authRoutes = require("./routes/auth");
const registerRoutes = require("./routes/register");
const clienteRoutes = require("./routes/cliente");
const dashboardRoutes = require("./routes/dashboard");
const pedidosRoutes = require("./routes/pedidos");
const carrinhoRoutes = require("./routes/carrinho");
const avaliacoesRoutes = require("./routes/avaliacoes");

// =========================
// CONFIGURAÇÕES
// =========================

// CORS (permite React acessar)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// VIEWS (mantém por enquanto)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARES
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// SESSION
app.use(session({
  secret: process.env.SESSION_SECRET || "tcc_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60
  }
}));

// GLOBALS (EJS ainda usa isso)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.url = req.originalUrl;
  res.locals.carrinho = req.session.carrinho || [];
  next();
});


// =========================
// 🔥 API (NOVA PARTE)
// =========================

// TESTE API
app.get("/api/test", (req, res) => {
  res.json({ status: "ok" });
});

// PRODUTOS (exemplo real)
app.get("/api/produtos", async (req, res) => {
  try {
    const [produtos] = await db.query("SELECT * FROM produtos");
    res.json(produtos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
});


// =========================
// FLUXO PRINCIPAL (EJS)
// =========================

// LANDING
app.get("/", (req, res) => {
  res.render("landing");
});

// REDIRECT
app.get("/redirect", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  if (req.session.user.tipo === "vendedor") {
    return res.redirect("/dashboard");
  }

  return res.redirect("/cliente");
});

app.get("/redirect-cliente", (req, res) => {
  res.redirect("/cliente");
});

// =========================
// ROTAS ANTIGAS (EJS)
// =========================

app.use("/", authRoutes);
app.use("/register", registerRoutes);
app.use("/cliente", clienteRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/carrinho", carrinhoRoutes);
app.use("/avaliacoes", avaliacoesRoutes);

// =========================
// ERROS
// =========================

app.use((req, res) => res.status(404).send("Página não encontrada"));

app.use((err, req, res, next) => {
  console.error("ERRO:", err);
  res.status(500).send("Erro interno");
});

// =========================
// SERVIDOR
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});