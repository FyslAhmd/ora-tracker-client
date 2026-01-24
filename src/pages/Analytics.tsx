import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  HiOutlineChartBar,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
} from 'react-icons/hi2';
import { Card, CardContent, LoadingSpinner, Alert } from '@/components/ui';
import { orsService } from '@/services';
import { SCORE_COLORS, ScoreLevel } from '@/utils/constants';

const Analytics: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ors-stats'],
    queryFn: orsService.getStats,
  });

  const stats = data?.stats;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        Failed to load analytics data. Please try again.
      </Alert>
    );
  }

  const scoreDistribution = [
    { level: 'excellent' as ScoreLevel, label: 'Excellent (90+)', count: stats?.byScoreLevel?.excellent || 0 },
    { level: 'good' as ScoreLevel, label: 'Good (70-89)', count: stats?.byScoreLevel?.good || 0 },
    { level: 'fair' as ScoreLevel, label: 'Fair (50-69)', count: stats?.byScoreLevel?.fair || 0 },
    { level: 'poor' as ScoreLevel, label: 'Poor (30-49)', count: stats?.byScoreLevel?.poor || 0 },
    { level: 'critical' as ScoreLevel, label: 'Critical (<30)', count: stats?.byScoreLevel?.critical || 0 },
  ];

  const statusDistribution = [
    { status: 'draft', label: 'Draft', count: stats?.byStatus?.draft || 0, color: '#f59e0b' },
    { status: 'active', label: 'Active', count: stats?.byStatus?.active || 0, color: '#22c55e' },
    { status: 'completed', label: 'Completed', count: stats?.byStatus?.completed || 0, color: '#3b82f6' },
    { status: 'archived', label: 'Archived', count: stats?.byStatus?.archived || 0, color: '#6b7280' },
  ];

  const total = stats?.total || 1;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="h-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white">Total Inspections</h3>
                <div className="p-1.5 sm:p-2 bg-primary-500/10 rounded-lg">
                  <HiOutlineChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-white">{stats?.total || 0}</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">Total ORS plans in system</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white">Average Score</h3>
                <div className={`p-1.5 sm:p-2 rounded-lg ${
                  (stats?.averageScore || 0) >= 70 ? 'bg-green-500/10' : 'bg-yellow-500/10'
                }`}>
                  {(stats?.averageScore || 0) >= 70 ? (
                    <HiOutlineArrowTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  ) : (
                    <HiOutlineArrowTrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  )}
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-white">
                {stats?.averageScore?.toFixed(1) || '0.0'}%
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">Fleet average roadworthiness</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sm:col-span-2 lg:col-span-1"
        >
          <Card className="h-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white">Pass Rate</h3>
                <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
                  <HiOutlineChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-white">
                {total > 0
                  ? (
                      ((stats?.byScoreLevel?.excellent || 0) + (stats?.byScoreLevel?.good || 0)) /
                      total *
                      100
                    ).toFixed(1)
                  : '0.0'}
                %
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">Vehicles with Good or Excellent score</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Score Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Score Distribution</h3>
              <div className="space-y-3 sm:space-y-4">
                {scoreDistribution.map((item) => {
                  const percentage = total > 0 ? (item.count / total) * 100 : 0;
                  const colors = SCORE_COLORS[item.level];
                  
                  return (
                    <div key={item.level}>
                      <div className="flex justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
                        <span className="text-gray-400 truncate mr-2">{item.label}</span>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <span className="text-white font-medium">{item.count}</span>
                          <span className="text-gray-500 hidden sm:inline">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="h-2.5 sm:h-3 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: colors.hex }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Status Distribution</h3>
              <div className="space-y-3 sm:space-y-4">
                {statusDistribution.map((item) => {
                  const percentage = total > 0 ? (item.count / total) * 100 : 0;
                  
                  return (
                    <div key={item.status}>
                      <div className="flex justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
                        <span className="text-gray-400">{item.label}</span>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-white font-medium">{item.count}</span>
                          <span className="text-gray-500 hidden sm:inline">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="h-2.5 sm:h-3 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Fleet Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <div className="p-3 sm:p-4 bg-dark-700/50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-400 mb-1">Vehicles Needing Attention</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-400">
                  {(stats?.byScoreLevel?.poor || 0) + (stats?.byScoreLevel?.critical || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Poor or Critical score</p>
              </div>
              
              <div className="p-3 sm:p-4 bg-dark-700/50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-400 mb-1">Active Inspections</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">{stats?.byStatus?.active || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Currently active plans</p>
              </div>
              
              <div className="p-3 sm:p-4 bg-dark-700/50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-400 mb-1">Pending Review</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-400">{stats?.byStatus?.draft || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Draft plans pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Analytics;
