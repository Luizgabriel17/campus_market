const express = require("express");
const app = express();

const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

// ROTAS
const authRoutes = require("./routes/auth");
const registerRoutes = require("./routes/register");
const clienteRoutes = require("./routes/cliente");
const dashboardRoutes = require("./routes/dashboard");
const pedidosRoutes = require("./routes/pedidos");
const carrinhoRoutes = require("./routes/carrinho");
const avaliacoesRoutes = require("./routes/avaliacoes");

// SESSION STORE (compatível com Railway)
const sessionStore = new MySQLStore(process.env.DATABASE_URL);

// CONFIG VIEWS (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// NECESSÁRIO PRA RENDER / PROXY
app.set("trust proxy", 1);

// CORS (libera acesso do seu frontend)
app.use(cors({
  origin: "https://seu-usuario.github.io", // ⚠️ TROQUE PELO SEU
  credentials: true
}));

// MIDDLEWARES
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// SESSION
app.use(session({
  key: "session_cookie",
  secret: process.env.SESSION_SECRET || "tcc_secret",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 1000 * 60 * 60
  }
}));

// GLOBALS
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.session = req.session;
  res.locals.url = req.originalUrl;
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

// PORTA (Render usa dinâmica)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});