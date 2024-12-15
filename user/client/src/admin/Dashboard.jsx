import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import 'chart.js/auto'; // This imports all chart types
import { useState, useEffect } from 'react';

const AdminPage = () => {
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    // Mock API call to fetch total students data
    setTotalStudents(150); // Replace with actual data fetching
  }, []);

  const pieData = {
    labels: ['Science', 'Arts', 'Commerce', 'Other'],
    datasets: [
      {
        label: 'Students Distribution',
        data: [40, 30, 50, 30],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Student Enrollment',
        data: [50, 70, 80, 90, 100, 110, 130],
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">Admin Dashboard</h1>

      {/* Cube Box for Total Students */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-medium mb-4">Total Students</h2>
        <div className="text-center text-4xl font-bold">{totalStudents}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-medium mb-4">Students Distribution</h2>
          <Doughnut data={pieData} />
        </div>

        {/* Line Graph */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-medium mb-4">Student Enrollment Trend</h2>
          <Line data={lineData} />
        </div>

      </div>
    </div>
  );
};

export default AdminPage;
