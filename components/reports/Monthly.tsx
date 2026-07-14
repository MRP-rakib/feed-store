import React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ExpenseItem {
  id: number;
  name: string;
  amount: string;
  percentage: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export default function MonthlyReport() {
  const expenseCategories: ExpenseItem[] = [
    { id: 1, name: 'মুরগির খাবার', amount: '৳ ২,৮০,০০০', percentage: '৫৯.৭৪%', icon: 'food-apple' },
    { id: 2, name: 'হাঁসের খাবার', amount: '৳ ৯৫,০০০', percentage: '২০.২৪%', icon: 'duck' },
    { id: 3, name: 'গরুর খাবার', amount: '৳ ৭৭,০০০', percentage: '১৬.৪০%', icon: 'cow' },
    { id: 4, name: 'অন্যান্য', amount: '৳ ০', percentage: '০.০০%', icon: 'dots-grid' },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
      {/* মাস/তারিখ নির্বাচন */}
      <Text className="text-sm font-bold text-gray-800 mb-2">মাস নির্বাচন করুন</Text>
      <TouchableOpacity className="flex-row justify-between items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5 mb-5">
        <Text className="text-base text-gray-800">July 2026</Text>
        <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#666" />
      </TouchableOpacity>

      {/* প্রধান তথ্য কার্ডসমূহ */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center bg-[#43A047] px-4 py-5 rounded-xl mb-3">
          <Text className="text-white text-base font-semibold">মোট বাচ্চা</Text>
          <Text className="text-white text-xl font-bold">1,850</Text>
        </View>

        <View className="flex-row justify-between items-center bg-[#1E88E5] px-4 py-5 rounded-xl mb-3">
          <Text className="text-white text-base font-semibold">মোট খাবারের খরচ</Text>
          <Text className="text-white text-xl font-bold">৳ ৪,০৫,০০০</Text>
        </View>

        <View className="flex-row justify-between items-center bg-[#E68A00] px-4 py-5 rounded-xl mb-3">
          <Text className="text-white text-base font-semibold">মোট পাতি হাঁস</Text>
          <Text className="text-white text-xl font-bold">৳ ৪২,০০০</Text>
        </View>

        <View className="flex-row justify-between items-center bg-[#673AB7] px-4 py-5 rounded-xl">
          <Text className="text-white text-base font-semibold">সর্বমোট খরচ</Text>
          <Text className="text-white text-xl font-bold">৳ ৪,৪৭,০০০</Text>
        </View>
      </View>

      {/* ক্যাটেগরি অনুযায়ী খরচ */}
      <Text className="text-base font-bold text-black mb-3">ক্যাটেগরি অনুযায়ী খরচ</Text>
      
      <View className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
        {expenseCategories.map((item, index) => (
          <View key={item.id}>
            <View className="flex-row justify-between items-center py-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-amber-50 justify-center items-center mr-3">
                  <MaterialCommunityIcons name={item.icon} size={24} color="#E68A00" />
                </View>
                <Text className="text-base font-medium text-gray-800">{item.name}</Text>
              </View>
              
              <View className="items-end">
                <Text className="text-base font-bold text-black">{item.amount}</Text>
                <Text className="text-xs text-gray-500 mt-0.5">({item.percentage})</Text>
              </View>
            </View>
            {index < expenseCategories.length - 1 && <View className="h-[1px] bg-gray-100" />}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}