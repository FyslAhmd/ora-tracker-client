import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineTruck,
} from 'react-icons/hi2';
import { ORSPlan } from '@/types';
import { Card, Badge, Button } from '../ui';
import ScoreBadge, { ScoreGauge } from './ScoreBadge';
import { useAuth } from '@/hooks';
import { formatDate, getStatusBadgeVariant } from '@/utils/constants';

interface ORSCardProps {
  plan: ORSPlan;
  onEdit?: (plan: ORSPlan) => void;
  onDelete?: (plan: ORSPlan) => void;
  onView?: (plan: ORSPlan) => void;
}

const ORSCard: React.FC<ORSCardProps> = ({ plan, onEdit, onDelete, onView }) => {
  const { canEdit, canDelete, user } = useAuth();
  const navigate = useNavigate();

  const canEditThisPlan =
    canEdit &&
    (user?.role === 'admin' ||
      plan.createdBy?._id === user?._id ||
      plan.assignedTo?._id === user?._id);

  const canDeleteThisPlan = canDelete;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="relative overflow-hidden group h-full flex flex-col p-3 sm:p-4 md:p-6">
        {/* Score Indicator Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${
              (plan.overallScore ?? 0) >= 80
                ? '#22c55e'
                : (plan.overallScore ?? 0) >= 60
                  ? '#3b82f6'
                  : (plan.overallScore ?? 0) >= 40
                    ? '#eab308'
                    : (plan.overallScore ?? 0) >= 20
                      ? '#f97316'
                      : '#ef4444'
            } ${plan.overallScore ?? 0}%, #1e293b ${plan.overallScore ?? 0}%)`,
          }}
        />

        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-semibold text-white truncate">{plan.vehicleId}</h3>
              <Badge variant={getStatusBadgeVariant(plan.status)} size="sm">
                {plan.status}
              </Badge>
            </div>

            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <HiOutlineTruck className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>{plan.vehicleType}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineUser className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">
                  {plan.createdBy?.name ?? 'Unknown'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">
                  {formatDate(plan.inspectionDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <ScoreGauge score={plan.overallScore ?? 0} size="sm" />
          </div>
        </div>

        {/* Scores Summary */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-dark-700 grid grid-cols-4 gap-1 sm:gap-2 flex-grow">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Engine</p>
            <ScoreBadge score={plan.scores?.engine ?? 0} size="sm" showLabel={false} />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Brakes</p>
            <ScoreBadge score={plan.scores?.brakes ?? 0} size="sm" showLabel={false} />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Tires</p>
            <ScoreBadge score={plan.scores?.tires ?? 0} size="sm" showLabel={false} />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Safety</p>
            <ScoreBadge score={plan.scores?.safetyEquipment ?? 0} size="sm" showLabel={false} />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-dark-700 flex items-center justify-end gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<HiOutlineEye />}
            onClick={() => (onView ? onView(plan) : navigate(`/ors-plans/${plan._id}`))}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            <span className="hidden sm:inline">View</span>
          </Button>
          {canEditThisPlan && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<HiOutlinePencil />}
              onClick={() => (onEdit ? onEdit(plan) : navigate(`/ors-plans/${plan._id}/edit`))}
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Edit</span>
            </Button>
          )}
          {canDeleteThisPlan && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<HiOutlineTrash />}
              onClick={() => onDelete?.(plan)}
              className="text-red-400 hover:text-red-300 text-xs sm:text-sm px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Delete</span>
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default ORSCard;
