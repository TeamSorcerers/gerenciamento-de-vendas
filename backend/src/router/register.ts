import router, { Request, Response } from "express";
import { HttpStatusCode } from "../status.js";

export const register = router();

register.post("/register/client", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send("ok");
});

register.post("/register/product", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send("ok");
});

register.post("/register/sale", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send("ok");
});
