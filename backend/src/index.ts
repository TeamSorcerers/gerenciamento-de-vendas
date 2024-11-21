import express from "express";
import cors from "cors";

import { register } from "./router/register.js";
import { view } from "./router/view.js";
import { update } from "./router/update.js";

const server = express();

server.use(express.json());
server.use(express.urlencoded());
server.use(cors({
  origin: "*",
  allowedHeaders: "*",
}));

server.use(register);
server.use(view);
server.use(update);

server.listen(process.env.PORT_SERVER, () => console.log("Servidor online!"));
