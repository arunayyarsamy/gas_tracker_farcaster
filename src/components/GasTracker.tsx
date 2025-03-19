import { useEffect, useCallback, useState } from 'react';
import sdk, { type FrameContext } from '@farcaster/frame-sdk';

export default function GasTracker() {
    const [ethGas, setEthGas] = useState<{ safe: string; average: string; fast: string } | null>(null);
    const [baseGas, setBaseGas] = useState<{ safe: string; average: string; fast: string } | null>(null);
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const [context, setContext] = useState<FrameContext>();

    useEffect(() => {
        const fetchGas = async () => {
            try {
                const response = await fetch(
                  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`, {
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
                  return;
                //   return res.status(500).json({ error: "Failed to fetch gas prices" });
                }
            
                const gasPriceGwei = parseInt(data.result, 16) / 1e9;

                let parsedData = {
                    safe: gasPriceGwei.toFixed(2),
                    average: (gasPriceGwei * 1.1).toFixed(2), // Estimated average (10% increase)
                    fast: (gasPriceGwei * 1.2).toFixed(2), // Estimated fast (20% increase)
                };

                setEthGas(parsedData);
              } catch (error) {
                console.error("Internal Server Error:", error);
                // res.status(500).json({ error: "Internal Server Error" });
              }

            try {
              const response = await fetch(
                `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`, {
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
                return;
              //   return res.status(500).json({ error: "Failed to fetch gas prices" });
              }
          
              const gasPriceGwei = parseInt(data.result, 16) / 1e9;

              let parsedData = {
                  safe: gasPriceGwei.toFixed(2),
                  average: (gasPriceGwei * 1.1).toFixed(2), // Estimated average (10% increase)
                  fast: (gasPriceGwei * 1.2).toFixed(2), // Estimated fast (20% increase)
              };

              setBaseGas(parsedData);
            } catch (error) {
              console.error("Internal Server Error:", error);
              // res.status(500).json({ error: "Internal Server Error" });
            }
        };

        fetchGas();
        const interval = setInterval(fetchGas, 30000); // Refresh every 30s

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const load = async () => {
          setContext(await sdk.context);
          sdk.actions.ready();
        };
        if (sdk && !isSDKLoaded) {
          setIsSDKLoaded(true);
          load();
        }
      }, [isSDKLoaded]);

    return (
        <>
            <h1 className="text-2xl font-bold text-center mb-4">Gas Tracker</h1>
            <br />
            <br />
            <div className="p-4 bg-gray-900 text-white rounded-xl">
                <h2 className="text-xl font-bold">⛽ Ethereum Gas Tracker</h2>
                {ethGas ? (
                    <div className="mt-2">
                        <p>🟢 Safe: {ethGas.safe} gwei</p>
                        <p>🟡 Average: {ethGas.average} gwei</p>
                        <p>🔴 Fast: {ethGas.fast} gwei</p>
                    </div>
                ) : (
                    <p>Loading gas prices...</p>
                )}
            </div>
            <br />
            <br />
            <div className="p-4 bg-gray-900 text-white rounded-xl">
                <h2 className="text-xl font-bold mt-4">⛽ Base Gas Tracker</h2>
                {baseGas ? (
                    <div className="mt-2">
                        <p>🟢 Safe: {baseGas.safe} gwei</p>
                        <p>🟡 Average: {baseGas.average} gwei</p>
                        <p>🔴 Fast: {baseGas.fast} gwei</p>
                    </div>
                ) : (
                    <p>Loading gas prices...</p>
                )}
            </div>
        </>
    );
}