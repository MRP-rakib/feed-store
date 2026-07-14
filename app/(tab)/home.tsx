import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import StatCard from '../../components/StatCard';
import Header from '../../components/Header';
import CategoryExpense from '../../components/CategoryExpense';
import RecentEntries from '../../components/RecentEntries';


export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <Header />

          {/* Stats Grid Section */}
          <View className="flex-row flex-wrap justify-between px-4">
            <StatCard 
              title="আজকের মোট খরচ" 
              value="৳ 18,500" 
              icon="wallet-outline" 
              iconBg="bg-green-600" 
              borderColor="border-green-200" 
              textColor="text-green-700" 
            />
            <StatCard 
              title="আজকের মোট বিক্রি" 
              value="85" 
              icon="cart-outline" 
              iconBg="bg-blue-500" 
              borderColor="border-blue-200" 
              textColor="text-blue-600" 
            />
            <StatCard 
              title="এই মাসের মোট খরচ" 
              value="৳ 4,52,000" 
              icon="calendar-month-outline" 
              iconBg="bg-purple-500" 
              borderColor="border-purple-200" 
              textColor="text-purple-700" 
            />
            <StatCard 
              title="এই বছরের মোট খরচ" 
              value="৳ 51,20,000" 
              icon="chart-timeline-variant" 
              iconBg="bg-amber-500" 
              borderColor="border-amber-200" 
              textColor="text-amber-600" 
            />
          </View>

          {/* Category Expenses Section */}
          <CategoryExpense />

          {/* Recent Entries Section */}
          <RecentEntries />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}