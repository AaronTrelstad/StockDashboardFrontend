import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsBoost from "highcharts/modules/boost";

HighchartsBoost(Highcharts);

interface StockChartProps {
    data: { timestamp: number; price: number }[];
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null);

    useEffect(() => {
        if (chartRef.current && chartRef.current.chart) {
            const chart = chartRef.current.chart;

            const formattedData = data.map(item => [item.timestamp, item.price]);

            chart.series[0].setData(formattedData, true);
        }
    }, [data]);

    const options: Highcharts.Options = {
        chart: {
            type: "line",
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
                data: data.map(item => [item.timestamp, item.price]),
            },
        ],
    };

    return (
        <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    );
};

export default StockChart;
