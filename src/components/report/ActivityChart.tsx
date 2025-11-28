import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import './ActivityChart.css';

interface ChartDataPoint {
  date: string;
  value: number;
  dayLabel: string;
}

interface ActivityChartProps {
  data: ChartDataPoint[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  // 최대값 계산 (최소 30분 보장)
  const maxValue = Math.max(30, ...data.map(d => d.value));

  // 접근성을 위한 텍스트 설명
  const totalMinutes = data.reduce((sum, d) => sum + d.value, 0);
  const ariaLabel = `7일간 활동량 차트. 총 ${totalMinutes}분 활동.`;

  const ariaDescription = data
    .map(d => `${d.dayLabel}요일: ${d.value > 0 ? `${d.value}분` : '기록 없음'}`)
    .join(', ');

  return (
    <div className="activity-chart">
      <div
        className="activity-chart__container"
        role="img"
        aria-label={ariaLabel}
        aria-describedby="activity-chart-desc"
      >
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="dayLabel"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, maxValue]}
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}분`}
            />
            <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" label={{ value: '권장', position: 'right', fontSize: 10 }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value >= 30 ? '#22c55e' : entry.value > 0 ? '#2563eb' : '#e5e7eb'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 스크린리더용 숨겨진 설명 */}
      <p id="activity-chart-desc" className="sr-only">
        {ariaDescription}
      </p>

      {/* 범례 */}
      <div className="activity-chart__legend">
        <span className="activity-chart__legend-item">
          <span className="activity-chart__bar activity-chart__bar--goal" />
          30분 이상
        </span>
        <span className="activity-chart__legend-item">
          <span className="activity-chart__bar activity-chart__bar--active" />
          30분 미만
        </span>
      </div>
    </div>
  );
}
