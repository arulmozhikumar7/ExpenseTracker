import React, { useState, useCallback } from "react";
import { useCurrentPng } from "recharts-to-png";
import FileSaver from "file-saver";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const ExpenseChart = ({ expenses }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const chartData = expenses.map((expense) => ({
    name: expense.description,
    value: Math.abs(expense.amount),
  }));

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#8e5ea2", "#3cba9f"];

  const handleFullScreenToggle = () => {
    setIsFullScreen(!isFullScreen);
  };

  const [getPng, { ref, isLoading }] = useCurrentPng();

  const handleDownload = useCallback(async () => {
    const png = await getPng();

    // Verify that png is not undefined
    if (png) {
      // Download with FileSaver
      FileSaver.saveAs(png, "Expenses_Chart.png");
    }
  }, [getPng]);

  return (
    <div
      className={`max-w-2xl p-6 mx-auto my-8 bg-white rounded-md shadow-lg ${
        isFullScreen
          ? "fixed top-0 left-[300px] bottom-[10px] w-full h-[90%]"
          : ""
      } dark:bg-gray-900`}
    >
      <h2 className="mb-4 text-2xl font-bold dark:text-teal-300">
        Expense Chart
      </h2>
      <div className="flex justify-start mb-4">
        <button
          onClick={handleFullScreenToggle}
          className="text-left text-blue-500 hover:underline focus:outline-none"
        >
          {isFullScreen ? "Exit Full Screen" : "View Full Screen"}
        </button>
      </div>
      <ResponsiveContainer width="100%" height={isFullScreen ? "100%" : 300}>
        <PieChart ref={ref}>
          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 mt-4 ml-4 dark:text-white">
        {chartData.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex flex-col items-center mr-4"
          >
            <div
              className="w-4 h-4 mr-2 "
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs">{entry.name}</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleDownload}
        className="px-4 py-2 mt-4 ml-4 text-white bg-blue-500 rounded-md dark:bg-teal-700"
      >
        {isLoading ? "Downloading..." : "Download Chart"}
      </button>
    </div>
  );
};

export default ExpenseChart;
