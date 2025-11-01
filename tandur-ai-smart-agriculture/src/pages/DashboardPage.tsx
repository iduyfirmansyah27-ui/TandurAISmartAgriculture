import React from 'react';
import { FaTemperatureHigh, FaTint, FaSun, FaLeaf } from 'react-icons/fa';
import { WiHumidity } from 'react-icons/wi';
import { BsSpeedometer2 } from 'react-icons/bs';

type TrendType = 'up' | 'down' | 'stable';

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  trend?: TrendType;
  trendValue?: string;
}

const SensorCard: React.FC<SensorCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-red-500';
      case 'down':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return (
      <span className={`ml-2 ${getTrendColor()}`}>
        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
        {trendValue && ` ${trendValue}${unit}`}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      <div className="text-3xl text-green-600 mb-2">{icon}</div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-gray-800">
          {value}
          <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
        </span>
        {getTrendIcon()}
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  // Data sensor dummy (nanti bisa diganti dengan data dari API)
  const sensorData = {
    temperature: { value: 28.5, trend: 'up' as const, trendValue: '0.5' },
    humidity: { value: 65, trend: 'down' as const, trendValue: '2' },
    soilMoisture: { value: 42, trend: 'stable' as const },
    lightIntensity: { value: 1250, trend: 'up' as const, trendValue: '150' },
    co2: { value: 420, trend: 'down' as const, trendValue: '10' },
    ph: { value: 6.5, trend: 'stable' as const },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Monitoring</h1>
      
      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SensorCard
          title="Suhu Udara"
          value={sensorData.temperature.value}
          unit="°C"
          icon={<FaTemperatureHigh />}
          trend={sensorData.temperature.trend}
          trendValue={sensorData.temperature.trendValue}
        />
        
        <SensorCard
          title="Kelembaban Udara"
          value={sensorData.humidity.value}
          unit="%"
          icon={<WiHumidity className="text-4xl -mt-1" />}
          trend={sensorData.humidity.trend}
          trendValue={sensorData.humidity.trendValue}
        />
        
        <SensorCard
          title="Kelembaban Tanah"
          value={sensorData.soilMoisture.value}
          unit="%"
          icon={<FaTint />}
          trend={sensorData.soilMoisture.trend}
        />
        
        <SensorCard
          title="Intensitas Cahaya"
          value={sensorData.lightIntensity.value}
          unit="lux"
          icon={<FaSun />}
          trend={sensorData.lightIntensity.trend}
          trendValue={sensorData.lightIntensity.trendValue}
        />
        
        <SensorCard
          title="Kadar CO₂"
          value={sensorData.co2.value}
          unit="ppm"
          icon={<FaLeaf />}
          trend={sensorData.co2.trend}
          trendValue={sensorData.co2.trendValue}
        />
        
        <SensorCard
          title="pH Tanah"
          value={sensorData.ph.value}
          unit="pH"
          icon={<BsSpeedometer2 />}
          trend={sensorData.ph.trend}
        />
      </div>
      
      {/* Grafik dan Tabel Data */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Riwayat Data Sensor</h2>
        <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
          <p>Grafik dan tabel data akan ditampilkan di sini</p>
          <p className="text-sm mt-2">(Integrasi dengan library grafik seperti Chart.js atau Recharts)</p>
        </div>
      </div>
      
      {/* Rekomendasi */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Rekomendasi</h2>
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-blue-50 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-full mr-4">
              <FaTint className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Penyiraman</h3>
              <p className="text-sm text-gray-600">Kelembaban tanah mencapai 42%. Disarankan untuk menyiram tanaman dalam 2 jam mendatang.</p>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-yellow-50 rounded-lg">
            <div className="bg-yellow-100 p-2 rounded-full mr-4">
              <FaSun className="text-yellow-600" />
            </div>
            <div>
              <h3 className="font-medium text-yellow-800">Pencahayaan</h3>
              <p className="text-sm text-gray-600">Intensitas cahaya cukup baik untuk pertumbuhan tanaman.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
