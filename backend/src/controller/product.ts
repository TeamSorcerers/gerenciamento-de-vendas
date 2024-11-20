import { pool } from "../database.js";
import { ProductModel } from "../model/product.js";

export default {
  async create ({ name, price, amountAvailable }: Omit<ProductModel, "code">): Promise<void> {
    await pool.query("INSERT INTO product(name, price, amount_available) VALUES($1, $2, $3)", [
      name,
      price,
      amountAvailable,
    ]);
  },
  async getAll (): Promise<ProductModel[]> {
    const result = await pool.query("SELECT code, name, price, amount_available FROM product");

    return result.rows.map((product) => ({
      name: product.name,
      code: product.code,
      price: product.price,
      amountAvailable: product.amount_available,
    }));
  },
};
