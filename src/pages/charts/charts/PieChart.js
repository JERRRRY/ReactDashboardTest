import React from 'react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// 🟦 Label showing `name (percent%)` with correct total
const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, index, name, value, payload }) => {
  const total = payload.total; // total was injected manually
  const percent = ((value / total) * 100).toFixed(0);

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={COLORS[index % COLORS.length]}
      textAnchor={x > cx ? 'start' : 'end'}
      fontSize={12}
      dominantBaseline="central"
    >
      {`${name} (${percent}%)`}
    </text>
  );
};

// 🟨 Tooltip without percent (optional: you can add it too)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const name = payload[0].name;
    return (
      <div style={{ background: '#fff', border: '1px solid #ccc', padding: 10 }}>
        <p style={{ margin: 0 }}>{name}</p>
        <p style={{ margin: 0 }}>Count: {value}</p>
      </div>
    );
  }
  return null;
};

const CustomPieChart = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Inject total into each item so `payload.total` exists
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RePieChart>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={dataWithTotal}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={renderCustomLabel}
          outerRadius={120}
          dataKey="value"
          nameKey="name"
        >
          {dataWithTotal.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </RePieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
