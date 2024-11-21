import router, { Request, Response } from "express";
import { HttpStatusCode } from "../status.js";
import { stockSchema } from "../schemas/stock.js";
import product from "../controller/product.js";

export const update = router();

update.post("/update/stock", async (req: Request, res: Response) => {
  const { success, data, error } = stockSchema.safeParse(req.body);

  if (!success) {
    console.error(error);

    res.status(HttpStatusCode.BAD_REQUEST).send({
      ok: false,
      error: { type: "invalid-data" },
    });

    return;
  }

  try {
    for (const item of data) {
      // eslint-disable-next-line no-await-in-loop
      await product.update(item.code, item.name, item.price, item.amountAvailable);
    }

    res.status(HttpStatusCode.OK).send({ ok: true });
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
