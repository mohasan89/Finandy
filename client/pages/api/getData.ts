import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  data?: Array<Object>;
  message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const file = await import("../../data/data.json");
    return res.status(200).json({ data: file.default });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
