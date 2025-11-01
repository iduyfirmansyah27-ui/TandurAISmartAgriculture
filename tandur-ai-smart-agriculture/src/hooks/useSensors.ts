import { useQuery, useQueryClient } from '@tanstack/react-query';
import { sensorApi } from '../services/api';
import type { SensorData } from '../services/api';
import { useEffect } from 'react';

export const useSensorData = () => {
  const queryClient = useQueryClient();

  // Query untuk mendapatkan data sensor terbaru
  const {
    data: sensorData,
    isLoading,
    error,
  } = useQuery<Record<string, SensorData>>({
    queryKey: ['sensorData'],
    queryFn: sensorApi.getLatestReadings,
    refetchInterval: 10000, // Refresh setiap 10 detik
  });

  // Prefetch data historis untuk grafik
  const prefetchHistoricalData = async (sensorType: string) => {
    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 24 jam terakhir
    
    await queryClient.prefetchQuery({
      queryKey: ['historicalData', sensorType, startDate, endDate],
      queryFn: () => 
        sensorApi.getHistoricalData({
          sensorType,
          startDate,
          endDate,
          interval: '1h',
        }),
    });
  };

  // Prefetch data untuk grafik saat komponen mount
  useEffect(() => {
    const sensorTypes = ['temperature', 'humidity', 'soil_moisture', 'light', 'co2', 'ph'];
    sensorTypes.forEach(type => prefetchHistoricalData(type));
  }, []);

  // Analisis kondisi sensor untuk menghasilkan rekomendasi
  const getRecommendations = () => {
    if (!sensorData) return [];
    
    const recommendations = [];
    
    // Contoh logika rekomendasi
    const temp = sensorData['temperature']?.value;
    if (temp > 30) {
      recommendations.push({
        id: 'high-temp',
        title: 'Suhu Tinggi',
        message: 'Suhu melebihi 30°C. Pertimbangkan untuk menaungi tanaman atau meningkatkan ventilasi.',
        type: 'warning' as const,
      });
    } else if (temp < 20) {
      recommendations.push({
        id: 'low-temp',
        title: 'Suhu Rendah',
        message: 'Suhu di bawah 20°C. Pertimbangkan untuk menutup ventilasi atau menggunakan pemanas.',
        type: 'info' as const,
      });
    }

    const soilMoisture = sensorData['soil_moisture']?.value;
    if (soilMoisture < 30) {
      recommendations.push({
        id: 'low-moisture',
        title: 'Kelembaban Tanah Rendah',
        message: 'Kelembaban tanah di bawah 30%. Pertimbangkan untuk menyiram tanaman.',
        type: 'warning' as const,
      });
    }

    return recommendations;
  };

  return {
    sensorData,
    isLoading,
    error,
    recommendations: getRecommendations(),
    prefetchHistoricalData,
  };
};

export const useHistoricalData = (sensorType: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['historicalData', sensorType, startDate, endDate],
    queryFn: () =>
      sensorApi.getHistoricalData({
        sensorType,
        startDate,
        endDate,
        interval: '1h',
      }),
    enabled: !!sensorType && !!startDate && !!endDate,
  });
};
