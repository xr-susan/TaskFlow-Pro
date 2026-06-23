/**
 * Statistics component
 * Refined analytics with clean chart styling
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useTaskStore } from '../../stores/taskStore';
import { formatDateShort } from '../../utils/formatDate';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

const Statistics = () => {
  const { getStatistics, darkMode } = useTaskStore();
  const stats = getStatistics();

  const text = darkMode ? '#6e7585' : '#9ca2b1';
  const grid = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  const cards = [
    { label: 'Total', value: stats.total, color: 'bg-neutral-900 dark:bg-white' },
    { label: 'Done', value: stats.completed, color: 'bg-success' },
    { label: 'Active', value: stats.active, color: 'bg-accent' },
    { label: 'Overdue', value: stats.overdue, color: 'bg-danger' },
  ];

  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [stats.priorityDistribution.high, stats.priorityDistribution.medium, stats.priorityDistribution.low],
      backgroundColor: ['#d92d20', '#d98c00', '#1a9e6e'],
      borderWidth: 0,
      borderRadius: 6,
      barPercentage: 0.6,
    }],
  };

  const categoryData = {
    labels: stats.categoryDistribution.map((c) => c.categoryName),
    datasets: [{
      data: stats.categoryDistribution.map((c) => c.count),
      backgroundColor: ['#635bff', '#1a9e6e', '#d98c00', '#d92d20', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'],
      borderWidth: 0,
      spacing: 2,
    }],
  };

  const weeklyData = {
    labels: stats.weeklyTrend.map((d) => formatDateShort(d.date)),
    datasets: [{
      label: 'Completed',
      data: stats.weeklyTrend.map((d) => d.completed),
      borderColor: '#635bff',
      backgroundColor: darkMode ? 'rgba(99,91,255,0.08)' : 'rgba(99,91,255,0.06)',
      fill: true,
      tension: 0.35,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: '#635bff',
      pointBorderColor: darkMode ? '#171a21' : '#fff',
      pointBorderWidth: 2,
    }],
  };

  const barOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#171a21', titleFont: { size: 12 }, bodyFont: { size: 12 }, padding: 10, cornerRadius: 8 } },
    scales: {
      y: { beginAtZero: true, ticks: { color: text, stepSize: 1, font: { size: 11 } }, grid: { color: grid, drawBorder: false } },
      x: { ticks: { color: text, font: { size: 11 } }, grid: { display: false } },
    },
  };

  const lineOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#171a21', titleFont: { size: 12 }, bodyFont: { size: 12 }, padding: 10, cornerRadius: 8 } },
    scales: {
      y: { beginAtZero: true, ticks: { color: text, stepSize: 1, font: { size: 11 } }, grid: { color: grid, drawBorder: false } },
      x: { ticks: { color: text, font: { size: 11 } }, grid: { display: false } },
    },
  };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="surface p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${card.color}`} />
              <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">{card.label}</span>
            </div>
            <p className="text-xl font-semibold text-neutral-900 dark:text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Completion rate */}
      <div className="surface p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Completion</h3>
          <span className="text-sm font-semibold text-accent">{stats.completionRate}%</span>
        </div>
        <div className="h-2 bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${stats.completionRate}%`,
              background: 'linear-gradient(90deg, #635bff 0%, #8b7dff 100%)',
            }}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="surface p-5">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Priority</h3>
          <div className="h-48">
            <Bar data={priorityData} options={barOpts} />
          </div>
        </div>
        <div className="surface p-5">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Categories</h3>
          <div className="h-48 flex items-center justify-center">
            {stats.categoryDistribution.some((c) => c.count > 0) ? (
              <Doughnut
                data={categoryData}
                options={{
                  responsive: true, maintainAspectRatio: false, cutout: '65%',
                  plugins: { legend: { position: 'bottom', labels: { color: text, padding: 12, usePointStyle: true, pointStyleWidth: 6, font: { size: 11 } } } },
                }}
              />
            ) : (
              <p className="text-xs text-neutral-400">No data</p>
            )}
          </div>
        </div>
      </div>

      {/* Weekly trend */}
      <div className="surface p-5">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Weekly trend</h3>
        <div className="h-48">
          <Line data={weeklyData} options={lineOpts} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
