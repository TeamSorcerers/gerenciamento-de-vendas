import router, { Request, Response } from "express";
import { HttpStatusCode } from "../status.js";

export const view = router();

view.post("/view/client", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send("ok");
});

view.post("/view/stock", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send("ok");
});

view.post("/view/report", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send("ok");
});
