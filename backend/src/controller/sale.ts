import { pool } from "../database.js";
import { SaleModel } from "../model/sale.js";
import { SaleProduct } from "../model/saleProduct.js";

type ISaleRegister = Omit<SaleModel, "code"> & {products: Omit<SaleProduct, "saleCode">[]};

export default {
  async register ({ clientCode, paymentMethod, price, products }: ISaleRegister): Promise<void> {
    const result = await pool.query("INSERT INTO sale(client_code, payment_method, price) VALUES($1, $2, $3) RETURNING code;", [
      clientCode, paymentMethod, price,
    ]);

    const saleCode = result.rows[0].code as number;

    await Promise.all(products.map((product) => pool.query("INSERT INTO sale_product(sale_code, product_code, amount) VALUES($1, $2, $3)", [
      saleCode, product.productCode, product.amount,
    ])));
  },
};
