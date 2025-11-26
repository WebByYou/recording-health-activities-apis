import express, { Application } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

dotenv.config();

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

import { authenticateToken } from "./middlewares/auth.middleware";

const app: Application = express();
app.use(express.json());
app.use(cors());

// Serve Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Apply auth middleware globally
app.use((req, res, next) => {
  if (req.path.startsWith("/api-docs")) {
    return next();
  }
  authenticateToken(req, res, next);
});

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at:`);
  console.log(`- Local:   http://localhost:${port}`);
  console.log(`- Network: http://192.168.1.122:${port}`);
});
