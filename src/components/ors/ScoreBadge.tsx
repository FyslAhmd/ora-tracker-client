import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { getScoreLevel, SCORE_COLORS } from '@/utils/constants';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score = 0, size = 'md', showLabel = true }) => {
  const safeScore = score ?? 0;
  const level = getScoreLevel(safeScore);

  return (
    <Badge variant={level} size={size}>
      {safeScore.toFixed(1)}
      {showLabel && <span className="ml-1 capitalize">({level})</span>}
    </Badge>
  );
};

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score = 0, size = 'md', showValue = true }) => {
  const safeScore = score ?? 0;
  const level = getScoreLevel(safeScore);
  const colors = SCORE_COLORS[level];

  const sizes = {
    sm: { container: 'w-16 h-16', text: 'text-sm', stroke: 4 },
    md: { container: 'w-24 h-24', text: 'text-xl', stroke: 6 },
    lg: { container: 'w-32 h-32', text: 'text-2xl', stroke: 8 },
  };

  const config = sizes[size];
  const radius = 50 - config.stroke;
  const circumference = 2 * Math.PI * radius;
  const progress = (safeScore / 100) * circumference;

  return (
    <div className={`${config.container} relative`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={config.stroke}
          fill="none"
          className="text-dark-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke={colors.hex}
          strokeWidth={config.stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${config.text}`} style={{ color: colors.hex }}>
            {safeScore.toFixed(0)}
          </span>
          <span className="text-xs text-gray-400 capitalize">{level}</span>
        </div>
      )}
    </div>
  );
};

export default ScoreBadge;
