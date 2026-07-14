import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
// react-native এর বদলে এখান থেকে ইম্পোর্ট করুন 👇
import { SafeAreaView } from 'react-native-safe-area-context'; 
import DailyReport from '../../components/reports/Daily';
import MonthlyReport from '../../components/reports/Monthly'
import YearlyReport from '../../components/reports/Yearly';


type TabType = 'Daily' | 'Monthly' | 'Yearly';

export default function ReportScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>('Monthly');

  return (
    // edges={['top']} দিলে শুধু উপরের নচ এরিয়া সেফ থাকবে, নিচে কোনো ফালতু স্পেস নিবে না
    <View className="flex-1 bg-gray-50">
      {/* টপ ট্যাব বার */}
      <View className="flex-row bg-white border-b border-gray-200">
        {(['Daily', 'Monthly', 'Yearly'] as TabType[]).map((tab) => {
          const isActive = selectedTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              className={`flex-1 py-4 items-center ${isActive ? 'border-b-4 border-green-700' : ''}`}
              onPress={() => setSelectedTab(tab)}
            >
              <Text className={`text-base ${isActive ? 'text-black font-bold' : 'text-gray-400 font-medium'}`}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* কন্ডিশন অনুযায়ী আলাদা কম্পোনেন্ট লোড হবে */}
      <View className="flex-1">
        {selectedTab === 'Daily' && < DailyReport/>}
        {selectedTab === 'Monthly' && <MonthlyReport/>}
        {selectedTab === 'Yearly' && <YearlyReport />}
      </View>
    </View>
  );
}