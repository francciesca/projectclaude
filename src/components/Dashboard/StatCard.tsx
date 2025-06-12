import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  onClick?: () => void;
  subtitle?: string;
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-500',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-100'
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-500',
    text: 'text-green-600',
    hover: 'hover:bg-green-100'
  },
  yellow: {
    bg: 'bg-yellow-50',
    iconBg: 'bg-yellow-500',
    text: 'text-yellow-600',
    hover: 'hover:bg-yellow-100'
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-500',
    text: 'text-red-600',
    hover: 'hover:bg-red-100'
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-500',
    text: 'text-purple-600',
    hover: 'hover:bg-purple-100'
  }
};

export function StatCard({ title, value, icon: Icon, color, onClick, subtitle }: StatCardProps) {
  const styles = colorStyles[color];
  
  return (
    <div
      onClick={onClick}
      className={`${styles.bg} ${onClick ? `${styles.hover} cursor-pointer` : ''} rounded-xl p-6 transition-all duration-200 hover:shadow-lg border border-gray-100`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${styles.text} mb-1`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`${styles.iconBg} p-3 rounded-lg`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
}