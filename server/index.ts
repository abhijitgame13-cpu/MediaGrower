import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;



// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (adjust origin to your frontend if deployed separately)
app.use(
  cors({
    origin: "*", // Change to your frontend URL for security (e.g. "https://yourdomain.com")
    credentials: true,
  })
);

// ✅ Session handling
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// ✅ API routes (example)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MediaGrower server is running 🚀" });
});

// ✅ Serve frontend build
const frontendPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(frontendPath));

// SPA Fallback — for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
