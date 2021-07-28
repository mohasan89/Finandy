import type { NextApiRequest, NextApiResponse } from "next";

import fs from "fs";
import path from "path";

type Data = {
  message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "DELETE") {
    try {
      const dir = path.resolve(process.cwd(), "data", "data.json");
      fs.writeFileSync(dir, JSON.stringify([], null, 3));
      res.status(202).json({ message: "deleted" });
    } catch (err: any) {
      return res.status(500).json({ message: err.errors || err.message });
    }
  }
}
