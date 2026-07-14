import React, { useState } from 'react';
import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

// টাইপ ডেফিনিশন
interface HistoryItem {
  id: string;
  type: string;
  company: string;
  quantity: string;
  amount: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

interface HistorySection {
  date: string;
  data: HistoryItem[];
}

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // স্ক্রিনশট অনুযায়ী ডামি ডেটা স্ট্রাকচার
  const historyData: HistorySection[] = [
    {
      date: '10 Jul 2025',
      data: [
        { id: '1', type: 'মুরগির খাবার', company: 'Amin Feed Mills', quantity: '50 বস্তা', amount: '৳ ১,২৫,৫০০', icon: 'food-apple' }
      ]
    },
    {
      date: '09 Jul 2025',
      data: [
        { id: '2', type: 'হাঁসের খাবার', company: 'Khulna Feed', quantity: '20 বস্তা', amount: '৳ ৪০,০০০', icon: 'duck' },
        { id: '3', type: 'গরুর খাবার', company: 'Agro Feed', quantity: '15 বস্তা', amount: '৳ ২৯,৫০০', icon: 'cow' }
      ]
    },
    {
      date: '08 Jul 2025',
      data: [
        { id: '4', type: 'মুরগির খাবার', company: 'Amin Feed Mills', quantity: '40 বস্তা', amount: '৳ ৯৬,০০০', icon: 'food-apple' },
        { id: '5', type: 'অন্যান্য', company: 'Local Market', quantity: '10 বস্তা', amount: '৳ ২১,০০০', icon: 'dots-grid' }
      ]
    },
    {
      date: '07 Jul 2025',
      data: [
        { id: '6', type: 'হাঁসের খাবার', company: 'Khulna Feed', quantity: '25 বস্তা', amount: '৳ ৪৭,০০০', icon: 'duck' }
      ]
    }
  ];

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* ১. টপ সার্চ বার এবং ফিল্টার/ক্যালেন্ডার আইকন */}
      <View className="flex-row items-center mb-5 space-x-2">
        <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-full px-3 py-2">
          <Feather name="search" size={18} color="#9CA3AF" className="mr-2" />
          <TextInput
            placeholder="Search entries..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-base p-0 text-gray-800"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity className="bg-white border border-gray-200 p-2.5 rounded-xl shadow-sm">
          <MaterialCommunityIcons name="tune" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* ২. হিস্ট্রি লিস্ট এরিয়া */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {historyData.map((section, sectionIdx) => (
          <View key={section.date} className="mb-4">
            {/* তারিখ হেডার */}
            <Text className="text-gray-500 font-semibold text-sm mb-2 px-1">
              {section.date}
            </Text>

            {/* এই তারিখের ভেতরের সব আইটেম কার্ড */}
            <View className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 space-y-2">
              {section.data.map((item, itemIdx) => (
                <View key={item.id}>
                  <View className="flex-row items-center justify-between py-2 px-2">
                    
                    {/* বাম দিক: আইকন, নাম ও কোম্পানির নাম */}
                    <View className="flex-row items-center flex-1">
                      <View className="w-10 h-10 rounded-full bg-amber-50 justify-center items-center mr-3">
                        <MaterialCommunityIcons name={item.icon} size={24} color="#E68A00" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-gray-850">{item.type}</Text>
                        <Text className="text-xs text-gray-400 font-medium mt-0.5">{item.company}</Text>
                      </View>
                    </View>

                    {/* মাঝখান: পরিমাণ ও টাকার পরিমাণ */}
                    <View className="items-end mr-4">
                      <Text className="text-sm font-semibold text-gray-700">{item.quantity}</Text>
                      <Text className="text-sm font-bold text-gray-900 mt-0.5">{item.amount}</Text>
                    </View>

                    {/* ডান দিক: এডিট এবং ডিলিট বাটন */}
                    <View className="flex-row items-center space-x-3">
                      <TouchableOpacity className="p-1">
                        <Feather name="edit-2" size={16} color="#9CA3AF" />
                      </TouchableOpacity>
                      <TouchableOpacity className="p-1">
                        <MaterialCommunityIcons name="delete-outline" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>

                  </View>
                  
                  {/* একই ডেটের ভেতর একাধিক আইটেম থাকলে মাঝখানে বর্ডার */}
                  {itemIdx < section.data.length - 1 && (
                    <View className="h-[1px] bg-gray-150 mx-2" />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}