import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';

const AdminPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Updated colors: yellow for pending, green for accepted, red for rejected
  const COLORS = ['#eab308', '#22c55e', '#ef4444'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingRes, acceptedRes, rejectedRes] = await Promise.all([
          axiosInstance.get('/links/link-requests'),
          axiosInstance.get('/links/'),
          axiosInstance.get('/links/rejected')
        ]);

        const chartData = [
          { name: 'Pending', value: pendingRes.data.length },
          { name: 'Accepted', value: acceptedRes.data.length },
          { name: 'Rejected', value: rejectedRes.data.length }
        ];

        setData(chartData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="w-full h-96">
        <CardHeader>
          <CardTitle>Link Request Statistics</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-72">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-96">
        <CardHeader>
          <CardTitle>Link Request Statistics</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-72 text-red-500">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-gray-600">Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full h-96">
      <CardHeader>
        <CardTitle>Link Request Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={true}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span className="text-gray-700">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AdminPage;