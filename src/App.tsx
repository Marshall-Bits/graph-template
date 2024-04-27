import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "./App.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getIndexOfColumn } from "./helpers/cleanXlData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

interface DataItem {
  [key: string]: any;
}

function App() {
  const [items, setItems] = useState<DataItem[]>([]);
  const [chartData, setChartData] = useState<ChartData>([]);

  const cleanData = (data: string[][]) => {
    const fontIndex: number = getIndexOfColumn("fuente de emisión", data);
    const co2eIndex: number = getIndexOfColumn("CO2e", data);

    const chartData = {
      labels: data.map((row) => row[fontIndex]),
      datasets: [
        {
          label: data[0][co2eIndex],
          data: data.map((row) => row[co2eIndex]),
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgba(255, 99, 132, 0.2)",
        },
      ],
    };

    setChartData(chartData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (!evt.target) {
        return;
      }
      // Parse data
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });

      // Get first worksheet
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      // Convert array of arrays
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      setItems(data);
      cleanData(data);
    };
    reader.readAsBinaryString(file);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "CO2e por fuente de emisión",
      },
    },
  };

  return (
    <>
      <h1>Chart</h1>
      <input type="file" onChange={handleFileUpload} />
      <div>
        {chartData && <Bar data={chartData} options={chartOptions} />}
        <pre>{JSON.stringify(items, null, 2)}</pre>
      </div>
    </>
  );
}

export default App;
