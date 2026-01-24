import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineChartBar,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import { Card, CardContent, LoadingSpinner, Alert } from '@/components/ui';
import { ScoreGauge } from '@/components/ors';
import { orsService } from '@/services';
import { useAuth } from '@/hooks';
import { ORSPlan } from '@/types';
import { formatDate, getDaysUntilInspection, getInspectionUrgency } from '@/utils/constants';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['ors-stats'],
    queryFn: orsService.getStats,
  });

  const { data: recentPlansData, isLoading: plansLoading } = useQuery({
    queryKey: ['ors-plans', { limit: 5 }],
    queryFn: () => orsService.getAll({ limit: 5, sortBy: '-createdAt' }),
  });

  const stats = statsData?.stats;
  const recentPlans = recentPlansData?.orsPlans || [];

  const statCards = [
    {
      title: 'Total ORS Plans',
      value: stats?.total || 0,
      icon: HiOutlineClipboardDocumentList,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Plans',
      value: stats?.byStatus?.active || 0,
      icon: HiOutlineCheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Average Score',
      value: stats?.averageScore?.toFixed(1) || '0.0',
      icon: HiOutlineChartBar,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/10',
      suffix: '%',
    },
    {
      title: 'Critical Vehicles',
      value: stats?.byScoreLevel?.critical || 0,
      icon: HiOutlineExclamationTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
  ];

  if (statsLoading || plansLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">
          Here's an overview of your fleet's operational roadworthiness status.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden h-full">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                  <div className="order-2 sm:order-1">
                    <p className="text-gray-400 text-xs sm:text-sm">{stat.title}</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1 sm:mt-2">
                      {stat.value}
                      {stat.suffix && <span className="text-sm sm:text-lg">{stat.suffix}</span>}
                    </p>
                  </div>
                  <div className={`order-1 sm:order-2 p-2 sm:p-3 rounded-xl ${stat.bgColor} w-fit`}>
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Score Distribution & Recent Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-white mb-6">Score Distribution</h3>
              <div className="space-y-4">
                {[
                  { level: 'Excellent (90+)', count: stats?.byScoreLevel?.excellent || 0, color: 'bg-green-500' },
                  { level: 'Good (70-89)', count: stats?.byScoreLevel?.good || 0, color: 'bg-lime-500' },
                  { level: 'Fair (50-69)', count: stats?.byScoreLevel?.fair || 0, color: 'bg-yellow-500' },
                  { level: 'Poor (30-49)', count: stats?.byScoreLevel?.poor || 0, color: 'bg-orange-500' },
                  { level: 'Critical (<30)', count: stats?.byScoreLevel?.critical || 0, color: 'bg-red-500' },
                ].map((item) => {
                  const total = stats?.total || 1;
                  const percentage = (item.count / total) * 100;
                  return (
                    <div key={item.level}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{item.level}</span>
                        <span className="text-white font-medium">{item.count}</span>
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className={`h-full ${item.color} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Plans */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-white mb-6">Recent Inspections</h3>
              {recentPlans.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No ORS plans found</p>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {recentPlans.map((plan: ORSPlan) => {
                    const urgency = getInspectionUrgency(plan.nextInspectionDate);
                    const daysUntil = getDaysUntilInspection(plan.nextInspectionDate);
                    
                    return (
                      <div
                        key={plan._id}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-dark-700/30 hover:bg-dark-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <ScoreGauge score={plan.overallScore ?? 0} size="sm" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-white text-sm sm:text-base">{plan.vehicleId}</span>
                              <span className="text-gray-500 hidden sm:inline">•</span>
                              <span className="text-gray-400 text-xs sm:text-sm">{plan.vehicleType}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                              Inspected on {formatDate(plan.inspectionDate)}
                            </p>
                          </div>
                        </div>
                        <div className="sm:text-right ml-auto sm:ml-0 pl-12 sm:pl-0">
                          <p
                            className={`text-xs sm:text-sm font-medium ${
                              urgency === 'overdue'
                                ? 'text-red-400'
                                : urgency === 'urgent'
                                  ? 'text-orange-400'
                                  : urgency === 'upcoming'
                                    ? 'text-yellow-400'
                                    : 'text-gray-400'
                            }`}
                          >
                            {urgency === 'overdue'
                              ? `${Math.abs(daysUntil)} days overdue`
                              : `${daysUntil} days until next`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alerts Section */}
      {(stats?.byScoreLevel?.critical || 0) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Alert variant="warning" title="Attention Required">
            There are {stats?.byScoreLevel?.critical} vehicles with critical ORS scores that require
            immediate attention.
          </Alert>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
