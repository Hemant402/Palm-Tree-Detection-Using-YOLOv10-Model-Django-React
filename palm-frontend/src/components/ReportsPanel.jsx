import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend,
  CartesianGrid
} from "recharts";

export default function ReportsPanel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/palm/report-stats/")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!stats) return <h2>Loading Reports...</h2>;

  const pieData = [
    { name: "Low (<50%)", value: stats.confidence_distribution.low },
    { name: "Medium (50%-80%)", value: stats.confidence_distribution.medium },
    { name: "High (>80%)", value: stats.confidence_distribution.high }
  ];

  const COLORS = ["#ff6b6b", "#ffd93d", "#51cf66"];

  return (
    <div style={{ padding: "20px" }}>
      
      <h2>Palm Detection Reports</h2>
      <p>Total Images: <b>{stats.total_images}</b></p>
      <p>Total Palms Detected: <b>{stats.total_palms}</b></p>

      <br />

      {/* LINE GRAPH */}
      <h3>Palms Detected Per Day</h3>
      <LineChart width={600} height={300} data={stats.daily_stats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="palms" stroke="#8884d8" strokeWidth={3} />
      </LineChart>

      <br /><br />

      {/* BAR GRAPH */}
      <h3>Palms Per Image</h3>
      <BarChart width={600} height={300} data={stats.per_image_stats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="image_id" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="palm_count" fill="#82ca9d" />
      </BarChart>

      <br /><br />

      {/* PIE CHART */}
      <h3>Confidence Level Distribution</h3>
      <PieChart width={400} height={300}>
        <Pie data={pieData} cx={200} cy={150} outerRadius={110} dataKey="value" label>
          {pieData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

    </div>
  );
}


