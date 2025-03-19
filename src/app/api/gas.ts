import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(
      `https://base-mainnet.g.alchemy.com/v2/pefitBT4IoHjYSofggXhPe98lRnabUwS`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_gasPrice",
            params: [],
        }),
      }
    );
    const data = await response.json();

    if (!data.result) {
      console.error("Error fetching gas prices:", data);
      return res.status(500).json({ error: "Failed to fetch gas prices" });
    }

    const gasPriceGwei = parseInt(data.result, 16) / 1e9;

    res.status(200).json({
      safe: gasPriceGwei.toFixed(2),
      average: (gasPriceGwei * 1.1).toFixed(2), // Estimated average (10% increase)
      fast: (gasPriceGwei * 1.2).toFixed(2), // Estimated fast (20% increase)
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}