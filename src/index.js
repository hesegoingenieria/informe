import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { config } from "./config/index.js";
import { routerApi } from "./routes/index.js";

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set("views", join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.static(join(__dirname, "/public")));

routerApi(app);

app.listen(config.port, () => {
  console.log(`Server on port ${config.port}`);
});
