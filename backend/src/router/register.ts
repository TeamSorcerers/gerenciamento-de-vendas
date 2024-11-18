import router, { Request, Response } from "express";
import { HttpStatusCode } from "../status.js";
import { registerClientSchema } from "../schemas/client.js";
import client from "../controller/client.js";

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

register.post("/register/product", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send("ok");
});

register.post("/register/sale", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send("ok");
});
