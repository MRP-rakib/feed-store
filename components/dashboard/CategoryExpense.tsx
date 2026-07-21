import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CategoryExpenseProps {
  data?: { categoryName: string; amount: number }[];
}

export default function CategoryExpense({ data = [] }: CategoryExpenseProps) {
  const safeData = Array.isArray(data) ? data : [];

  const getStyle = (name: string) => {
    const formattedName = name ? String(name).toLowerCase().trim() : '';
    
    switch (formattedName) {
      case 'boiler': 
        return { icon: 'bird', color: '#f59e0b' };
      case 'cattle': 
        return { icon: 'cow', color: '#8b5cf6' };
      case 'fish': 
        return { icon: 'fish', color: '#0ea5e9' };
      default: 
        return { icon: 'dots-horizontal', color: '#64748b' };
    }
  };

  return (
    <View className="px-4 py-3">
      <Text className="text-lg font-black text-slate-900 mb-3">Monthly Breakdown</Text>
      <View className="bg-white rounded-2xl border border-slate-100 p-4 gap-3">
        {safeData.length === 0 ? (
          <Text className="text-slate-400 font-semibold text-center py-2">No category data</Text>
        ) : (
          safeData.map((item, index) => {
            const categoryName = item?.categoryName ? String(item.categoryName).trim() : 'Other';
            const { icon, color } = getStyle(categoryName);
            
            const rawAmount = item?.amount;
            const amount = (rawAmount !== null && rawAmount !== undefined && !isNaN(Number(rawAmount))) 
              ? Number(rawAmount) 
              : 0;

            return (
              <View key={`${categoryName}-${index}`} className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 rounded-full justify-center items-center" style={{ backgroundColor: `${color}20` }}>
                    <MaterialCommunityIcons name={icon as any} size={16} color={color} />
                  </View>
                  <Text className="text-slate-700 font-bold text-base">{categoryName}</Text>
                </View>
                <Text className="text-slate-900 font-black text-base">
                  ৳ {amount.toLocaleString()}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}