import express, { type Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth-routes";
import { ErrorMiddleware } from "./middlewares/error_middleware";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/auth", authRoutes);
app.use(ErrorMiddleware.notFound);
app.use(ErrorMiddleware.returnError);

export default app;
