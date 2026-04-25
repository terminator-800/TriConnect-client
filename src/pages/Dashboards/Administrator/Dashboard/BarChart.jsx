import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data, isLoading = false, error = null, heading = 'Monthly Statistics Overview' }) => {

  if (isLoading) return <p>Loading chart data...</p>;
  if (error) return <p>Failed to load chart data 😢</p>;
  if (!data) return null;

  const source = data;

  const chartData = {
    labels: source.labels,
    datasets: [
      {
        label: 'Job Seekers',
        data: source.totalJobseekers,
        backgroundColor: 'rgba(0, 52, 121, 1)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
      {
        label: 'Employers',
        data: source.totalEmployers,
        backgroundColor: 'rgba(34, 197, 94, 1)',
        borderColor: 'rgba(21, 128, 61, 1)',
        borderWidth: 1,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
      {
        label: 'Agencies',
        data: source.totalAgencies,
        backgroundColor: 'rgba(245, 158, 11, 1)',
        borderColor: 'rgba(180, 83, 9, 1)',
        borderWidth: 1,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
      {
        label: 'Hired',
        data: source.totalHired,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ✅ This allows custom height
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#333',
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: heading,
        font: { size: 16 },
        color: '#111',
        align: 'start',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#555',
        },
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#555',
          stepSize: 1,
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value;
            }
          },
        },
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;