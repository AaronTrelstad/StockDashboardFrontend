import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsBoost from "highcharts/modules/boost";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  TextField,
  Typography,
} from "@mui/material";

HighchartsBoost(Highcharts);

interface StockData {
  timestamp: number;
  price: number;
}

interface StockChartProps {
  data: StockData[];
}

interface TransactionLog {
  operation: string;
  timestamp: number;
  shares: number;
  price: number;
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [average, setAverage] = useState<number>(0.0);
  const [max, setMax] = useState<number>(0);
  const [min, setMin] = useState<number>(Infinity);
  const [price, setPrice] = useState<number>(50);

  const [balance, setBalance] = useState<number>(100);
  const [ownedShares, setOwnedShares] = useState<number>(0);
  const [buyShares, setBuyShares] = useState<number>(0);
  const [sellShares, setSellShares] = useState<number>(0);
  const [log, setLog] = useState<TransactionLog[]>([]);

  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      const chart = chartRef.current.chart;

      const formattedData = data.map((item) => [item.timestamp, item.price]);

      chart.series[0].setData(formattedData, true);

      setAverage(
        formattedData.reduce((sum, item) => sum + item[1], 0) /
          formattedData.length
      );

      if (formattedData.length > 0) {
        setPrice(formattedData[formattedData.length - 1][1]);
        setMax(Math.max(max, formattedData[formattedData.length - 1][1]));
        setMin(Math.min(min, formattedData[formattedData.length - 1][1]));
      }
    }
  }, [data]);

  const handleBuy = (newShares: number) => {
    if (newShares * price < balance) {
      setLog((log) => [
        ...log,
        {
          operation: "BUY",
          timestamp: Date.now(),
          shares: newShares,
          price: price,
        },
      ]);

      setOwnedShares(ownedShares + newShares);

      setBalance(balance - newShares * price);
    } else {
      console.log("Not enough money.");
    }
  };

  const handleSell = (newShares: number) => {
    if (newShares <= ownedShares) {
      setLog((log) => [
        ...log,
        {
          operation: "SELL",
          timestamp: Date.now(),
          shares: newShares,
          price: price,
        },
      ]);

      setOwnedShares(ownedShares - newShares);

      setBalance(balance + newShares * price);
    } else {
      console.log("Too many shares");
    }
  };

  const options: Highcharts.Options = {
    chart: {
      type: "line",
      animation: true,
      zooming: {
        type: "x",
      },
    },
    title: {
      text: "Stock Data",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Time",
      },
      tickPixelInterval: 150,
    },
    yAxis: {
      title: {
        text: "Stock Prices",
      },
    },
    series: [
      {
        type: "line",
        name: "Stock Price",
        data: data.map((item) => [item.timestamp, item.price]),
      },
      
    ],
  };

  return (
    <Container>
      <Box mb={4}>
        <Card>
          <CardHeader title="Stock Chart" />
          <CardContent>
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
              ref={chartRef}
            />
          </CardContent>
        </Card>
      </Box>
      <Box mb={4}>
        <Card>
          <CardHeader title="Balance and Shares" />
          <CardContent>
            <Typography variant="body1">
              Balance: ${balance.toFixed(2)}
            </Typography>
            <Typography variant="body1">Shares Owned: {ownedShares}</Typography>
            <Typography variant="body1">
              Current Price: ${price.toFixed(3)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box mb={4}>
        <Card>
          <CardHeader title="Buy Shares" />
          <CardContent>
            <TextField
              type="number"
              InputProps={{
                inputProps: { min: 0 },
              }}
              value={buyShares}
              onChange={(e) => setBuyShares(Number(e.target.value))}
              placeholder="Enter Shares"
              label="Buy Shares"
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "green",
                color: "white",
                "&:hover": { backgroundColor: "darkgreen" },
              }}
              onClick={() => handleBuy(buyShares)}
              fullWidth
            >
              Buy
            </Button>
          </CardContent>
        </Card>
      </Box>
      <Box mb={4}>
        <Card>
          <CardHeader title="Sell Shares" />
          <CardContent>
            <TextField
              type="number"
              InputProps={{
                inputProps: { min: 0 },
              }}
              value={sellShares}
              onChange={(e) => setSellShares(Number(e.target.value))}
              placeholder="Enter Shares"
              label="Sell Shares"
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "red",
                color: "white",
                "&:hover": { backgroundColor: "darkred" },
              }}
              onClick={() => handleSell(sellShares)}
              fullWidth
            >
              Sell
            </Button>
          </CardContent>
        </Card>
      </Box>
      <Box mb={4}>
        <Card>
          <CardHeader title="Statistics" />
          <CardContent>
            <Typography variant="body1">
              Average: {average.toFixed(3)}
            </Typography>
            <Typography variant="body1">Max: {max.toFixed(3)}</Typography>
            <Typography variant="body1">Min: {min.toFixed(3)}</Typography>
          </CardContent>
        </Card>
      </Box>
      <Box>
        <Card>
          <CardHeader title="Transactions" />
          <CardContent>
            {log.map((transaction, index) => (
              <Box key={index} mb={1}>
                <Typography variant="body2">
                  {transaction.operation} {transaction.shares} shares at $
                  {transaction.price.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  Timestamp: {new Date(transaction.timestamp).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default StockChart;
