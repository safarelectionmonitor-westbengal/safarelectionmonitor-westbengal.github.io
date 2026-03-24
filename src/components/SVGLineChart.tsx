import React, { useMemo } from 'react';
import { Party } from '../types';
import { PARTY_COLORS } from '../data/mockData';

interface DataPoint {
  year: number;
  value: number;
}

interface SVGLineChartProps {
  data: Record<Party, DataPoint[]>;
  activeParties: Party[];
  width?: number;
  height?: number;
  showLabels?: boolean;
}

export const SVGLineChart: React.FC<SVGLineChartProps> = ({ 
  data, 
  activeParties, 
  width = 400, 
  height = 200,
  showLabels = false
}) => {
  const years = [2011, 2016, 2021, 2026];
  const padding = 30; // Increased padding for labels
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const getX = (year: number) => {
    const index = years.indexOf(year);
    return padding + (index / (years.length - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    // Assuming vote share is between 0 and 100
    return height - padding - (value / 100) * chartHeight;
  };

  const lines = useMemo(() => {
    return activeParties.map(party => {
      const points = data[party] || [];
      if (points.length < 2) return null;

      const pathData = points
        .sort((a, b) => a.year - b.year)
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.value)}`)
        .join(' ');

      return (
        <path
          key={party}
          d={pathData}
          fill="none"
          stroke={PARTY_COLORS[party]}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500"
        />
      );
    });
  }, [data, activeParties, width, height]);

  const dots = useMemo(() => {
    return activeParties.flatMap(party => {
      const points = data[party] || [];
      return points.map(p => (
        <g key={`${party}-${p.year}`}>
          <circle
            cx={getX(p.year)}
            cy={getY(p.value)}
            r="4"
            fill={PARTY_COLORS[party]}
            className="transition-all duration-500"
          />
          {showLabels && p.value > 0 && (
            <text
              x={getX(p.year)}
              y={getY(p.value) - 12}
              fill={PARTY_COLORS[party]}
              fontSize="10"
              fontWeight="700"
              textAnchor="middle"
              className="font-sans pointer-events-none"
            >
              {p.value.toFixed(1)}%
            </text>
          )}
        </g>
      ));
    });
  }, [data, activeParties, width, height, showLabels]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
      {/* Grid Lines */}
      {[0, 25, 50, 75, 100].map(v => (
        <line
          key={v}
          x1={padding}
          y1={getY(v)}
          x2={width - padding}
          y2={getY(v)}
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}
      
      {/* Year Labels */}
      {years.map(year => (
        <text
          key={year}
          x={getX(year)}
          y={height - 5}
          fill="#64748b"
          fontSize="11"
          fontWeight="600"
          textAnchor="middle"
          className="font-sans"
        >
          {year}
        </text>
      ))}

      {lines}
      {dots}
    </svg>
  );
};
