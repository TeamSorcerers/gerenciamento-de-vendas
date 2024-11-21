import router, { Request, Response } from "express";
import { HttpStatusCode } from "../status.js";
import { registerClientSchema } from "../schemas/client.js";
import client from "../controller/client.js";
import { registerProductSchema } from "../schemas/product.js";
import product from "../controller/product.js";
import { registerSaleSchema } from "../schemas/sale.js";
import sale from "../controller/sale.js";

export const register = router();

register.post("/register/client", async (req: Request, res: Response) => {
  const { success, error, data } = registerClientSchema.safeParse(req.body);

  if (!success) {
    res.status(HttpStatusCode.BAD_REQUEST).send({
      ok: false,
      error: {
        type: "validation",
        info: error.errors,
      },
    });

    return;
  }

  if (!data) {
    res.status(HttpStatusCode.BAD_REQUEST).send({
      ok: false,
      error: { type: "invalid-data" },
    });

    return;
  }

  try {
    await client.create(data);
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

register.post("/register/product", async (req: Request, res: Response) => {
  const { success, error, data } = registerProductSchema.safeParse(req.body);

  if (!success) {
    res.status(HttpStatusCode.BAD_REQUEST).send({
      ok: false,
      error: {
        type: "validation",
        info: error.errors,
      },
    });

    return;
  }

  if (!data) {
    res.status(HttpStatusCode.BAD_REQUEST).send({
      ok: false,
      error: { type: "invalid-data" },
    });

    return;
  }

  try {
    await product.create(data);
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

register.post("/register/sale", async (req: Request, res: Response) => {
  const { success, error, data } = registerSaleSchema.safeParse(req.body);

  if (!success) {
    res.status(HttpStatusCode.BAD_REQUEST).send({
      ok: false,
      error: {
        type: "validation",
        info: error.errors,
      },
    });

    return;
  }

  if (!data) {
    res.status(HttpStatusCode.BAD_REQUEST).send({
      ok: false,
      error: { type: "invalid-data" },
    });

    return;
  }

  try {
    for (const item of data.cart) {
      // eslint-disable-next-line no-await-in-loop
      const available = await product.getAmountOf(item.productCode);

      console.log(item.productCode, available);

      if (item.amount > available) {
        res.status(HttpStatusCode.BAD_REQUEST).send({
          ok: false,
          error: { type: "invalid-data" },
        });

        return;
      }
    }
    await sale.register(data);
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
