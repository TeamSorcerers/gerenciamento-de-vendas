import express from "express";
import cors from "cors";

import { register } from "./router/register.js";
import { view } from "./router/view.js";
import sale from "./controller/sale.js";

await sale.register({
  clientCode: 10,
  paymentMethod: 1,
  price: 120,
  products: [],
});

const server = express();

server.use(express.json());
server.use(express.urlencoded());
server.use(cors({
  origin: "*",
  allowedHeaders: "*",
}));

server.use(register);
server.use(view);

server.listen(process.env.PORT_SERVER, () => console.log("pai ta on"));
