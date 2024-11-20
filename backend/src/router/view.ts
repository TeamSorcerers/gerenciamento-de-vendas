import router, { Request, Response } from "express";
import { HttpStatusCode } from "../status.js";
import client from "../controller/client.js";
import product from "../controller/product.js";

export const view = router();

view.get("/view/product/all", async (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(await product.getAll());
});

view.get("/view/client/all", async (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(await client.getAll());
});

view.post("/view/client", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send("ok");
});

view.post("/view/stock", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send("ok");
});

view.post("/view/report", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send("ok");
});
