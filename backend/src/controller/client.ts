import { pool } from "../database.js";
import { ClientModel } from "../model/client.js";

export default {
  async create ({ name, phone, totalPurchase }: Omit<ClientModel, "code">): Promise<void> {
    await pool.query("INSERT INTO client(name, phone, totalPurchase) VALUES($1, $2, $3)", [
      name,
      phone,
      totalPurchase,
    ]);
  },
  async search (name: string): Promise<ClientModel | null> {
    try {
      const result = await pool.query("SELECT * FROM client WHERE name = $1", [ name ]);

      if (result.rows.length === 0) {
        return null;
      }

      return {
        name: result.rows[0].name,
        code: result.rows[0].code,
        phone: result.rows[0].phone,
        totalPurchase: result.rows[0].totalpurchase,
      } as ClientModel;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);

      return null;
    }
  },
};
