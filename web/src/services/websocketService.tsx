import { useState, useEffect } from 'react';

const STOCK_WS = 'ws://localhost:8082/ws';

interface StockData {
    timestamp: number;
    price: number;
}

export function useWebSocket() {
    const [stockData, setStockData] = useState<StockData[]>([]);

    useEffect(() => {
        const ws = new WebSocket(STOCK_WS);

        ws.onmessage = (event) => {
            try {
                const data: StockData = JSON.parse(event.data);
                setStockData(prevData => [...prevData, data]);
                console.log('Received data:', data);
            } catch (error) {
                console.error('Error parsing JSON data:', error);
            }
        };

        return () => {
            ws.close();
        };
    }, []);

    return stockData;
}
