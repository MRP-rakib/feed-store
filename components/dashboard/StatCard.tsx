import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconBg: string;
  borderColor: string;
  textColor: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  iconBg, 
  borderColor, 
  textColor 
}: StatCardProps) {
  return (
    <View className={`w-[48%] p-3 mb-3 border rounded-xl bg-white ${borderColor}`}>
      <View className={`w-8 h-8 rounded-lg items-center justify-center ${iconBg}`}>
        <MaterialCommunityIcons name={icon} size={18} color="#fff" />
      </View>
      <Text className="text-gray-600 text-xs font-semibold mt-2" numberOfLines={1}>
        {title}
      </Text>
      <Text className={`text-base font-bold mt-1 ${textColor}`}>
        {value}
      </Text>
    </View>
  );
}