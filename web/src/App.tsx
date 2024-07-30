import { useWebSocket } from "./services/websocketService";
import StockChart from "./components/stockChart";

const App: React.FC = () => {
  const stockData = useWebSocket();

  return (
    <div>
      <h1>Stock Trading Dashboard</h1>
      <div>
        <h2>Real-Time Stock Data Chart</h2>
        <StockChart data={stockData} />
      </div>
    </div>
  );
};

export default App;
