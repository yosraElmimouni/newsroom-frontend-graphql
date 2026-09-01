

interface SparklinePoint {
  value: number;
}

export function Sparkline({ data, color = 'var(--brand-accent)' }: { data: SparklinePoint[]; color?: string }) {
  const width = 96;
  const height = 32;
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;
  const stepX = width / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = height - ((d.value - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(' L')}`;
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="sparkline" preserveAspectRatio="none">
      <path d={areaPath} fill={color} opacity="0.12" stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface SeriesPoint {
  label: string;
  value: number;
}

export function AreaTrendChart({ data, color = 'var(--brand-accent)' }: { data: SeriesPoint[]; color?: string }) {
  const width = 480;
  const height = 200;
  const paddingLeft = 28;
  const paddingBottom = 24;
  const paddingTop = 12;

  const rawMax = Math.max(...data.map((d) => d.value), 1);
  const niceMax = Math.max(4, Math.ceil(rawMax / 2) * 2);
  const steps = 4;
  const stepValue = niceMax / steps;

  const chartWidth = width - paddingLeft;
  const chartHeight = height - paddingBottom - paddingTop;
  const stepX = chartWidth / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => {
    const x = paddingLeft + i * stepX;
    const y = paddingTop + chartHeight - (d.value / niceMax) * chartHeight;
    return { x, y, ...d };
  });

  const linePath = `M${points.map((p) => `${p.x},${p.y}`).join(' L')}`;
  const areaPath = `${linePath} L${points[points.length - 1].x},${paddingTop + chartHeight} L${points[0].x},${
    paddingTop + chartHeight
  } Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="trend-chart" role="img" aria-label="Graphique d'évolution">
      {Array.from({ length: steps + 1 }).map((_, i) => {
        const value = stepValue * i;
        const y = paddingTop + chartHeight - (value / niceMax) * chartHeight;
        return (
          <g key={i}>
            <line x1={paddingLeft} x2={width} y1={y} y2={y} className="trend-grid-line" />
            <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="trend-axis-label">
              {Math.round(value)}
            </text>
          </g>
        );
      })}

      <path d={areaPath} fill={color} opacity="0.1" stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#fff" stroke={color} strokeWidth="2" />
      ))}

      {points.map((p, i) => (
        <text key={i} x={p.x} y={height - 4} textAnchor="middle" className="trend-axis-label">
          {p.label}
        </text>
      ))}
    </svg>
  );
}

interface BarPoint {
  label: string;
  value: number;
  color?: string;
}

/** Graphique en barres pour une répartition (ex : par catégorie / par rôle). */
export function BarBreakdownChart({ data }: { data: BarPoint[] }) {
  const width = 480;
  const height = 200;
  const paddingLeft = 28;
  const paddingBottom = 32;
  const paddingTop = 12;

  const rawMax = Math.max(...data.map((d) => d.value), 1);
  const niceMax = Math.max(4, Math.ceil(rawMax / 2) * 2);
  const steps = 4;
  const stepValue = niceMax / steps;

  const chartWidth = width - paddingLeft;
  const chartHeight = height - paddingBottom - paddingTop;
  const slot = chartWidth / data.length;
  const barWidth = Math.min(36, slot * 0.5);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="trend-chart" role="img" aria-label="Graphique de répartition">
      {Array.from({ length: steps + 1 }).map((_, i) => {
        const value = stepValue * i;
        const y = paddingTop + chartHeight - (value / niceMax) * chartHeight;
        return (
          <g key={i}>
            <line x1={paddingLeft} x2={width} y1={y} y2={y} className="trend-grid-line" />
            <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="trend-axis-label">
              {Math.round(value)}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const barHeight = (d.value / niceMax) * chartHeight;
        const x = paddingLeft + i * slot + (slot - barWidth) / 2;
        const y = paddingTop + chartHeight - barHeight;
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(barHeight, 1)}
              rx="6"
              fill={d.color ?? 'var(--brand-accent)'}
            />
            <text x={x + barWidth / 2} y={height - 12} textAnchor="middle" className="trend-axis-label">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}