import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function RecentEntries() {
  const entries = [
    { id: '1', date: '10', month: 'Jul', type: 'মুরগি', qty: '50 বস্তা', amount: '৳ 1,25,000' },
    { id: '2', date: '09', month: 'Jul', type: 'হাঁস', qty: '20 বস্তা', amount: '৳ 48,000' },
    { id: '3', date: '09', month: 'Jul', type: 'গরু', qty: '15 বস্তা', amount: '৳ 32,000' },
    { id: '4', date: '08', month: 'Jul', type: 'মুরগি', qty: '40 বস্তা', amount: '৳ 98,000' },
    { id: '5', date: '08', month: 'Jul', type: 'অন্যান্য', qty: '10 বস্তা', amount: '৳ 21,000' },
  ];

  return (
    <View className="px-4 mt-6 mb-8">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-base font-bold text-gray-800">সাম্প্রতিক এন্ট্রি</Text>
        <TouchableOpacity>
          <Text className="text-sm font-semibold text-green-600">View All</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm">
        {entries.map((item, index) => (
          <View 
            key={item.id} 
            className={`flex-row items-center justify-between py-3 px-1 ${
              index !== entries.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            {/* Date Block */}
            <View className="items-center w-10">
              <Text className="text-sm font-bold text-gray-800">{item.date}</Text>
              <Text className="text-[10px] text-gray-400 uppercase">{item.month}</Text>
            </View>

            {/* Type/Name */}
            <Text className="text-sm font-medium text-gray-700 flex-1 ml-4">{item.type}</Text>

            {/* Quantity */}
            <Text className="text-xs text-gray-500 w-16 text-center">{item.qty}</Text>

            {/* Amount */}
            <Text className="text-sm font-bold text-gray-800 text-right w-24">{item.amount}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}