import { pool } from "../database.js";
import { ClientModel } from "../model/client.js";

export default {
  async create ({ name, phone }: Omit<ClientModel, "code">): Promise<void> {
    await pool.query("INSERT INTO client(name, phone) VALUES($1, $2)", [
      name,
      phone,
    ]);
  },

  async search (name: string): Promise<ClientModel | null> {
    try {
      const result = await pool.query("SELECT * FROM client WHERE name = $1", [ name ]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);

      return null;
    }
  },
};
