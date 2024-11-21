import router, { Request, Response } from "express";
import { HttpStatusCode } from "../status.js";
import client from "../controller/client.js";
import product from "../controller/product.js";
import { searchClientSchema } from "../schemas/searchClient.js";
import sale from "../controller/sale.js";

export const view = router();

view.get("/view/product/all", async (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(await product.getAll());
});

view.get("/view/client/all", async (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(await client.getAll());
});

view.post("/view/client", async (req: Request, res: Response) => {
  const { success, data, error } = searchClientSchema.safeParse(req.body);

  if (!success) {
    console.error(error);

    res.status(HttpStatusCode.BAD_REQUEST).send({
      ok: false,
      error: { type: "invalid-data" },
    });

    return;
  }

  try {
    res.status(HttpStatusCode.OK).send({
      ok: true,
      info: await client.search(data.clientCode),
    });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
      ok: false,
      error: {
        type: "internal",
        message: String(error),
      },
    });
  }
});

view.post("/view/stock", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send("ok");
});

view.get("/view/report", async (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(await sale.report());
});
