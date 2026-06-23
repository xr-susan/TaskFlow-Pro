/**
 * Analytics page
 */

import Statistics from '../components/Statistics/Statistics';

const Analytics = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Analytics</h1>
        <p className="text-[13px] text-neutral-400 dark:text-neutral-500 mt-0.5">
          Track your productivity
        </p>
      </div>
      <Statistics />
    </div>
  );
};

export default Analytics;
