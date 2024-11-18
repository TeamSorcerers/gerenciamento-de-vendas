import router, { Request, Response } from "express";
import { HttpStatusCode } from "../status.js";

export const update = router();

update.post("/update/stock", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send("ok");
});
