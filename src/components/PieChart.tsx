import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { candidate } from "@/types/poll.types";

function PieChartComponent({ candidates }: { candidates: candidate[] }) {
  const COLORS = [
    "#3B82F6", // blue
    "#EC4899", // pink
    "#F59E0B", // amber
    "#10B981", // emerald
    "#8B5CF6", // violet
    "#EF4444", // red
  ];

  const pieData = candidates
    .filter((opt) => opt.votes > 0) // hide zero-vote slices
    .map((opt) => ({
      name: opt.title,
      value: opt.votes,
    }));

  const isEmpty = pieData.length === 0;

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-72 md:h-96">
        <p className="text-gray-500">No votes to show stats</p>
      </div>
    );
  }

  return (
    <div className="my-4 h-72 md:h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;
