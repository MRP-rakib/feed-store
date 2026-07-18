import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CategoryExpenseProps {
  data: { categoryName: string; amount: number }[];
}

export default function CategoryExpense({ data }: CategoryExpenseProps) {
  const getStyle = (name: string) => {
    switch (name) {
      case 'Boiler': return { icon: 'bird', color: '#f59e0b' };
      case 'Cattle': return { icon: 'cow', color: '#8b5cf6' };
      case 'Fish': return { icon: 'fish', color: '#0ea5e9' };
      default: return { icon: 'dots-horizontal', color: '#64748b' };
    }
  };

  return (
    <View className="px-4 py-3">
      <Text className="text-lg font-black text-slate-900 mb-3">Monthly Breakdown</Text>
      <View className="bg-white rounded-2xl border border-slate-100 p-4 gap-3">
        {data.map((item) => {
          const { icon, color } = getStyle(item.categoryName);
          return (
            <View key={item.categoryName} className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full justify-center items-center" style={{ backgroundColor: `${color}20` }}>
                  <MaterialCommunityIcons name={icon as any} size={16} color={color} />
                </View>
                <Text className="text-slate-700 font-bold text-base">{item.categoryName}</Text>
              </View>
              <Text className="text-slate-900 font-black text-base">৳ {item.amount.toLocaleString()}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}