import React, { useEffect, useState } from "react";
import apiService from "../apiService";

const COLORS = {
  itemCount: "bg-indigo-500",   // Tailwind color
  totalStock: "bg-emerald-500",
};

const CategoryRankingProgress = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [rankingKey, setRankingKey] = useState("totalStock");

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const data = await apiService.getCategoryItemCounts();
        const formatted = data.map((cat) => ({
          name: cat.categoryName,
          itemCount: cat.itemCount,
          totalStock: cat.totalStock,
        }));
        setCategoryData(formatted);
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      }
    };

    fetchCategoryCounts();
  }, []);

  const sortedData = [...categoryData]
    .sort((a, b) => b[rankingKey] - a[rankingKey])
    .slice(0, 10);

  const maxValue = sortedData[0]?.[rankingKey] || 1;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 transition-all hover:shadow-lg">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          🏅 Category Ranking Overview
        </h2>
        <div className="flex items-center gap-2">
          <label htmlFor="rankingKey" className="text-sm font-medium text-gray-600">
            Rank by:
          </label>
          <select
            id="rankingKey"
            value={rankingKey}
            onChange={(e) => setRankingKey(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="itemCount">Item Count</option>
            <option value="totalStock">Total Stock</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {sortedData.map((cat, i) => {
          const percent = ((cat[rankingKey] / maxValue) * 100).toFixed(1);
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span className="truncate w-3/4">{i + 1}. {cat.name}</span>
                <span>{cat[rankingKey]}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 ${COLORS[rankingKey]} transition-all duration-500`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryRankingProgress;
