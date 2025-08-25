
import React from 'react';
import type { EnvironmentName } from '../types';

interface VisualSpecimenProps {
  environment: EnvironmentName | 'Earth';
  simulationYears: number;
}

const VisualSpecimen: React.FC<VisualSpecimenProps> = ({ environment, simulationYears }) => {
  let adaptiveFill = "url(#defaultGradient)";
  let filterEffect = '';
  let text = 'Original Specimen';
  let strokeColor = 'stroke-gray-300';
  let strokeWidth = '2';

  const adaptationStrength = Math.min(1, simulationYears / 50000000);

  if (environment === 'Mars') {
    const intensity = 300 + Math.floor(adaptationStrength * 600);
    adaptiveFill = `url(#marsGradient)`;
    strokeColor = `stroke-orange-${intensity > 900 ? 900 : intensity}`;
    strokeWidth = `${2 + 2 * adaptationStrength}`;
    filterEffect = `drop-shadow(0 0 ${2 + 8 * adaptationStrength}px rgba(255, 100, 0, ${0.5 * adaptationStrength}))`;
    text = 'Mars-Adapted Specimen';
  } else if (environment === 'Europa') {
    const intensity = 300 + Math.floor(adaptationStrength * 600);
    adaptiveFill = `url(#europaGradient)`;
    strokeColor = `stroke-blue-${intensity > 900 ? 900 : intensity}`;
    strokeWidth = `${2 + 1.5 * adaptationStrength}`;
    filterEffect = `drop-shadow(0 0 ${2 + 8 * adaptationStrength}px rgba(0, 150, 255, ${0.5 * adaptationStrength}))`;
    text = 'Europa-Adapted Specimen';
  } else if (environment === 'Enceladus') {
    const intensity = 300 + Math.floor(adaptationStrength * 600);
    adaptiveFill = `url(#enceladusGradient)`;
    strokeColor = `stroke-lime-${intensity > 900 ? 900 : intensity}`;
    strokeWidth = `${2 + 1 * adaptationStrength}`;
    filterEffect = `drop-shadow(0 0 ${2 + 8 * adaptationStrength}px rgba(0, 255, 100, ${0.7 * adaptationStrength}))`;
    text = 'Enceladus-Adapted Specimen';
  } else if (environment === 'Titan') {
    const intensity = 300 + Math.floor(adaptationStrength * 600);
    adaptiveFill = `url(#titanGradient)`;
    strokeColor = `stroke-yellow-${intensity > 900 ? 900 : intensity}`;
    strokeWidth = `${2 + 2 * adaptationStrength}`;
    filterEffect = `drop-shadow(0 0 ${2 + 8 * adaptationStrength}px rgba(255, 200, 0, ${0.4 * adaptationStrength}))`;
    text = 'Titan-Adapted Specimen';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h4 className="text-xl font-medium mb-4 text-center h-12">{text}</h4>
      <svg className={`w-32 h-32 md:w-40 md:h-40`} style={{ filter: filterEffect }} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="defaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="marsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
          <linearGradient id="europaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="enceladusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <linearGradient id="titanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <path
          d="M50 10 C 45 10, 40 15, 40 20 C 40 25, 45 30, 50 30 C 55 30, 60 25, 60 20 C 60 15, 55 10, 50 10 Z 
             M45 30 L40 50 C35 60, 35 70, 40 75 L45 80 L50 90 L55 80 L60 75 C65 70, 65 60, 60 50 L55 30 Z"
          fill={adaptiveFill}
          className={`${strokeColor} transition-all duration-1000 ease-in-out`}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default VisualSpecimen;
