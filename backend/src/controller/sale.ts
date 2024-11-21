import { pool } from "../database.js";
import { SaleModel } from "../model/sale.js";
import { SaleProduct } from "../model/saleProduct.js";
import product from "./product.js";

type ISaleRegister = Omit<SaleModel, "code"> & {cart: Omit<SaleProduct, "saleCode">[]};

export default {
  async calculateTotal (cart: Omit<SaleProduct, "saleCode">[]): Promise<number> {
    let total = 0;

    for (const item of cart) {
      // eslint-disable-next-line no-await-in-loop
      const price = await product.getPriceOf(item.productCode);

      total += price * item.amount;
    }

    return total;
  },
  async register ({ clientCode, paymentMethod, cart }: ISaleRegister): Promise<void> {
    const total = await this.calculateTotal(cart);

    for (const item of cart) {
      // eslint-disable-next-line no-await-in-loop
      const available = Math.max(0, await product.getAmountOf(item.productCode) - item.amount);

      // eslint-disable-next-line no-await-in-loop
      await product.updateAmountOf(item.productCode, available);
    }

    const result = await pool.query("INSERT INTO sale(client_code, payment_method, price) VALUES($1, $2, $3) RETURNING code;", [
      clientCode, paymentMethod, total,
    ]);

    const saleCode = result.rows[0].code as number;

    await Promise.all(cart.map((product) => pool.query("INSERT INTO sale_product(sale_code, product_code, amount) VALUES($1, $2, $3)", [
      saleCode, product.productCode, product.amount,
    ])));
  },
  async report (): Promise<{
    totalSale: number,
    totalSaleByClient: number
  }> {
    const result = await pool.query("SELECT count(*) AS exact_count FROM sale");
    const totalSale = result.rows[0]?.exact_count ?? 0;

    const result2 = await pool.query("SELECT count(*) AS exact_count FROM client");
    const clientCount = result2.rows[0]?.exact_count ?? 0;

    return {
      totalSale,
      totalSaleByClient: Math.floor(totalSale / clientCount),
    };
  },
};
