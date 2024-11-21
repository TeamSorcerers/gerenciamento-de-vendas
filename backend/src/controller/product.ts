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
  async getPriceOf (code: number): Promise<number> {
    const result = await pool.query("SELECT price FROM product WHERE code = $1", [ code ]);

    return result.rows[0]?.price ?? 0;
  },
  async getAmountOf (code: number): Promise<number> {
    const result = await pool.query("SELECT amount_available FROM product WHERE code = $1", [ code ]);

    return result.rows[0]?.amount_available ?? 0;
  },
  async updateAmountOf (code: number, amount: number): Promise<void> {
    await pool.query("UPDATE product SET amount_available = $2 WHERE code = $1", [ code, amount ]);
  },
  async update (code: number, name: string, price: number, amount: number) {
    await pool.query("UPDATE product SET name = $2, price = $3, amount_available = $4 WHERE code = $1", [ code, name, price, amount ]);
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
