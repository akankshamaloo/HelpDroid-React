import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";
// This is just a sample data
const data = [
  { date: "2023-01-02", temperature: 4000, pulse: 2400, spo2: 2500 },
  // ... your data here
];

const LineChartComponent = () => {
  const [graphdata, setGraphData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then((res) => {
        console.log(res);
        setGraphData([]);
      })
      .catch((errr) => {});
  }, []);
  return (
    <LineChart
      width={400}
      height={400}
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 20,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="temperature"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
      <Line type="monotone" dataKey="spo2" stroke="#82ca9d" />
      <Line type="monotone" dataKey="pulse" stroke="#FF8042" />
    </LineChart>
  );
};

export default LineChartComponent;
