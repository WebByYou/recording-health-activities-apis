import express, { Application } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route";

dotenv.config();

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app: Application = express();
app.use(express.json());

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server http://localhost:${port}`);
});
