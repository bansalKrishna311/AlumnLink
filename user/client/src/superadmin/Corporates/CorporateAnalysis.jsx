import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/axios'; 
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CorporateAnalysis = () => {
  const [corporates, setCorporates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCorporates = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/admin/corporates');
        setCorporates(response.data);
      } catch (error) {
        console.error('Error fetching corporates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCorporates();
  }, []);

  // Grouping corporates by month for graph data
  const getMonthlyData = () => {
    const monthlyData = {};
    corporates.forEach((corporate) => {
      const month = new Date(corporate.createdAt).toLocaleString('default', { month: 'long' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    return monthlyData;
  };

  const monthlyData = getMonthlyData();

  const chartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Number of Corporates',
        data: Object.values(monthlyData),
        backgroundColor: '#1D4ED8',
        borderColor: '#1E40AF',
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-6">
      <div className="card w-full max-w-3xl shadow-lg  p-8">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">
          Corporate Analysis
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div>
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CorporateAnalysis;
