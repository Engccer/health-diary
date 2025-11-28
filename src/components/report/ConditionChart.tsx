import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import './ConditionChart.css';

interface ChartDataPoint {
  date: string;
  value: number | null;
  dayLabel: string;
}

interface ConditionChartProps {
  data: ChartDataPoint[];
}

export function ConditionChart({ data }: ConditionChartProps) {
  // 차트 데이터 변환 (null은 연결선 끊김 처리)
  const chartData = data.map(d => ({
    ...d,
    displayValue: d.value,
  }));

  // 접근성을 위한 텍스트 설명
  const ariaLabel = `7일간 컨디션 추이 차트. ${
    data.filter(d => d.value !== null).length
  }일 기록됨.`;

  const ariaDescription = data
    .map(d => `${d.dayLabel}요일: ${d.value !== null ? `${d.value}점` : '기록 없음'}`)
    .join(', ');

  return (
    <div className="condition-chart">
      <div
        className="condition-chart__container"
        role="img"
        aria-label={ariaLabel}
        aria-describedby="condition-chart-desc"
      >
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="dayLabel"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <ReferenceLine y={3} stroke="#e5e7eb" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="displayValue"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 스크린리더용 숨겨진 설명 */}
      <p id="condition-chart-desc" className="sr-only">
        {ariaDescription}
      </p>

      {/* 범례 */}
      <div className="condition-chart__legend">
        <span className="condition-chart__legend-item">
          <span className="condition-chart__dot condition-chart__dot--high" />
          좋음 (4-5)
        </span>
        <span className="condition-chart__legend-item">
          <span className="condition-chart__dot condition-chart__dot--mid" />
          보통 (3)
        </span>
        <span className="condition-chart__legend-item">
          <span className="condition-chart__dot condition-chart__dot--low" />
          낮음 (1-2)
        </span>
      </div>
    </div>
  );
}
