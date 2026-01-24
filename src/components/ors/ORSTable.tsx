import React from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
} from 'react-icons/hi2';
import { ORSPlan } from '@/types';
import { Badge, Button } from '../ui';
import ScoreBadge from './ScoreBadge';
import { useAuth } from '@/hooks';
import { formatDate, getStatusBadgeVariant } from '@/utils/constants';

interface ORSTableProps {
  plans: ORSPlan[];
  onEdit?: (plan: ORSPlan) => void;
  onDelete?: (plan: ORSPlan) => void;
  onView?: (plan: ORSPlan) => void;
}

const ORSTable: React.FC<ORSTableProps> = ({ plans, onEdit, onDelete, onView }) => {
  const { canEdit, canDelete, user } = useAuth();

  const canEditPlan = (plan: ORSPlan) =>
    canEdit &&
    (user?.role === 'admin' ||
      plan.createdBy?._id === user?._id ||
      plan.assignedTo?._id === user?._id);

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Vehicle</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Type</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Status</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Score</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Inspector</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Inspection Date</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Next Inspection</th>
              <th className="text-right py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <motion.tr
                key={plan._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors"
              >
                <td className="py-3 sm:py-4 px-4 sm:px-6">
                  <span className="font-medium text-white text-sm sm:text-base">{plan.vehicleId}</span>
                </td>
                <td className="py-3 sm:py-4 px-4 sm:px-6 text-gray-300 text-sm sm:text-base">{plan.vehicleType}</td>
                <td className="py-3 sm:py-4 px-4 sm:px-6">
                  <Badge variant={getStatusBadgeVariant(plan.status)} size="sm">
                    {plan.status}
                  </Badge>
                </td>
                <td className="py-3 sm:py-4 px-4 sm:px-6">
                  <ScoreBadge score={plan.overallScore ?? 0} size="sm" showLabel={false} />
                </td>
                <td className="py-3 sm:py-4 px-4 sm:px-6 text-gray-300 text-sm sm:text-base">{plan.createdBy?.name ?? 'Unknown'}</td>
                <td className="py-3 sm:py-4 px-4 sm:px-6 text-gray-300 text-sm sm:text-base">{formatDate(plan.inspectionDate)}</td>
                <td className="py-3 sm:py-4 px-4 sm:px-6 text-gray-300 text-sm sm:text-base">{formatDate(plan.nextInspectionDate)}</td>
                <td className="py-3 sm:py-4 px-4 sm:px-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView?.(plan)}
                      className="p-2"
                    >
                      <HiOutlineEye className="w-4 h-4" />
                    </Button>
                    {canEditPlan(plan) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(plan)}
                        className="p-2"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete?.(plan)}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {plans.length === 0 && (
        <div className="py-12 text-center text-gray-400">
          <p>No ORS plans found</p>
        </div>
      )}
    </div>
  );
};

export default ORSTable;
