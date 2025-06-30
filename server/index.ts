import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.log(`Error ${status}: ${message}`);
  res.status(status).json({ message });
});

async function initializeServer() {
  const server = await registerRoutes(app);
  
  // Environment-specific setup
  if (process.env.NODE_ENV === "development") {
    // Use existing vite.ts for development
    const { setupVite } = await import("./vite.js");
    await setupVite(app, server);
  } else {
    // Production static file serving
    const staticPath = path.resolve(__dirname, "..", "client", "dist");
    console.log(`Serving static files from: ${staticPath}`);
    
    app.use(express.static(staticPath));
    
    // SPA fallback - serve index.html for all non-API routes
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/")) {
        return next();
      }
      
      const indexPath = path.join(staticPath, "index.html");
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.log(`Error serving index.html: ${err.message}`);
          res.status(500).send("Internal Server Error");
        }
      });
    });
  }

  const port = Number(process.env.PORT) || 5000;
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

initializeServer().catch((error) => {
  console.log(`Failed to start server: ${error.message}`);
  process.exit(1);
});