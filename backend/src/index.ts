import express from "express";
import cors from "cors";

import { register } from "./router/register.js";

const server = express();

server.use(express.json());
server.use(express.urlencoded());
server.use(cors({
  origin: "*",
  allowedHeaders: "*",
}));

server.use(register);

server.listen(process.env.PORT_SERVER, () => console.log("pai ta on"));
