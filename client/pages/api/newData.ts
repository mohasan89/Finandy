import type { NextApiRequest, NextApiResponse } from "next";
import { object, number } from "yup";
import fs from "fs";
import path from "path";

type Data = {
  message?: string;
};

const dataSchema = object({
  qty: number().positive().required(),
  value: number().positive().required(),
  price: number().positive().required(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    try {
      const { qty, price, value } = req.body;
      const validation = await dataSchema.validate({ qty, price, value }, { abortEarly: false });
      const file = await import("../../data/data.json");
      const data = file.default;
      //@ts-ignore
      data.unshift({ qty, price, value });

      const dir = path.resolve(process.cwd(), "data", "data.json");
      fs.writeFileSync(dir, JSON.stringify(data, null, 3));
      res.status(201).json({ message: "created" });
    } catch (err: any) {
      return res.status(400).json({ message: err.errors || err.message });
    }
  }
}
