import { pool } from "../database.js";
import { ClientModel } from "../model/client.js";

export default {
  async create ({ name, phone }: Omit<ClientModel, "code">): Promise<void> {
    await pool.query("INSERT INTO client(name, phone) VALUES($1, $2)", [
      name,
      phone,
    ]);
  },

  async getAll (): Promise<Omit<ClientModel, "phone">[]> {
    const result = await pool.query("SELECT code, name, phone FROM client");

    return result.rows;
  },

  async getTotalPurchase (code: number): Promise<number> {
    const result = await pool.query("SELECT count(*) AS exact_count FROM sale WHERE client_code = $1", [ code ]);

    return result.rows[0]?.exact_count ?? 0;
  },

  async search (code: number): Promise<ClientModel & { totalPurchase: number } | null> {
    try {
      const result = await pool.query("SELECT * FROM client WHERE code = $1", [ code ]);

      if (result.rows.length === 0) {
        return null;
      }

      const [ info ] = result.rows;

      info.totalPurchase = await this.getTotalPurchase(code);

      return info;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);

      return null;
    }
  },
};
