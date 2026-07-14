import React from 'react';
import { View, Text } from 'react-native';

export default function CategoryExpense() {
  const categories = [
    { id: '1', emoji: '🐔', name: 'মুরগির খাবার', amount: '৳ 2,80,000' },
    { id: '2', emoji: '🦆', name: 'হাঁসের খাবার', amount: '৳ 95,000' },
    { id: '3', emoji: '🐄', name: 'গরুর খাবার', amount: '৳ 77,000' },
    { id: '4', emoji: '⚙️', name: 'অন্যান্য', amount: '৳ 0' },
  ];

  return (
    <View className="px-4 mt-4">
      <Text className="text-base font-bold text-gray-800 mb-3">ক্যাটাগরি অনুযায়ী খরচ (এই মাস)</Text>
      
      <View className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
        {categories.map((item, index) => (
          <View 
            key={item.id} 
            className={`flex-row justify-between items-center py-2.5 ${
              index !== categories.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <View className="flex-row items-center space-x-3">
              <Text className="text-xl mr-2">{item.emoji}</Text>
              <Text className="text-sm font-medium text-gray-700">{item.name}</Text>
            </View>
            <Text className="text-sm font-bold text-gray-800">{item.amount}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}