import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const Reports = () => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const response = await axios.get('https://localhost:7068/api/Category/item-counts');
        const formatted = response.data.map(cat => ({
          name: cat.categoryName,
          value: cat.itemCount,
        }));
        setCategoryData(formatted);
      } catch (error) {
        console.error('Failed to fetch category counts:', error);
      }
    };

    fetchCategoryCounts();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📊 Category Reports</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Category-wise Item Counts</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
        {/* <h2 className="text-2xl font-bold text-gray-800">📊 Analytics & Reports</h2> */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Category Item Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Item Count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
