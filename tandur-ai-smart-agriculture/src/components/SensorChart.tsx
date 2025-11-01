import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useHistoricalData } from '../hooks/useSensors';
import { format, subDays } from 'date-fns';

interface SensorChartProps {
  sensorType: string;
  color?: string;
  unit?: string;
  height?: number;
}

const SensorChart: React.FC<SensorChartProps> = ({
  sensorType,
  color = '#2e7d32',
  unit = '',
  height = 300,
}) => {
  const endDate = new Date();
  const startDate = subDays(endDate, 1); // Data 24 jam terakhir

  const { data: historicalData, isLoading, error } = useHistoricalData(
    sensorType,
    startDate.toISOString(),
    endDate.toISOString()
  );

  // Format data untuk chart
  const chartData = useMemo(() => {
    if (!historicalData) return [];
    
    return historicalData.map((item) => ({
      timestamp: format(new Date(item.timestamp), 'HH:mm'),
      value: item.value,
    }));
  }, [historicalData]);

  if (isLoading) {
    return <div className="text-center py-4">Memuat data...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Gagal memuat data: {error.message}
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return <div className="text-center py-4">Tidak ada data tersedia</div>;
  }

  const getSensorLabel = () => {
    const labels: Record<string, string> = {
      temperature: 'Suhu',
      humidity: 'Kelembaban Udara',
      soil_moisture: 'Kelembaban Tanah',
      light: 'Intensitas Cahaya',
      co2: 'Kadar CO₂',
      ph: 'pH Tanah',
    };
    return labels[sensorType] || sensorType;
  };

  return (
    <div className="w-full" style={{ height }}>
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        {getSensorLabel()} (24 jam terakhir)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value, index) => (index % 3 === 0 ? value : '')}
          />
          <YAxis 
            tickFormatter={(value) => `${value}${unit}`}
            tick={{ fontSize: 12 }}
            width={40}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}${unit}`, getSensorLabel()]}
            labelFormatter={(label) => `Waktu: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name={getSensorLabel()}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorChart;
