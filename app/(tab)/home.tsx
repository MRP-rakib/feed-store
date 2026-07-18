import React, { useState, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator, RefreshControl, Alert, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

import StatCard from '../../components/dashboard/StatCard';
import CategoryExpense from '../../components/dashboard/CategoryExpense';
import RecentEntries from '../../components/dashboard/RecentEntries';

interface DashboardStats {
  todayExpense: number;
  todayBags: number;
  monthExpense: number;
  yearExpense: number;
}

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [stats, setStats] = useState<DashboardStats>({
    todayExpense: 0,
    todayBags: 0,
    monthExpense: 0,
    yearExpense: 0,
  });

  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [recentData, setRecentData] = useState<any[]>([]);

  const fetchDashboardMetrics = async () => {
    try {
      if (!refreshing) setLoading(true);

      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const firstDayOfMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const firstDayOfYearStr = `${now.getFullYear()}-01-01`;

      const { data: todayData } = await supabase.from('entries').select('grand_total, total_bag').eq('entry_date', todayStr);
      const { data: monthData } = await supabase.from('entries').select('grand_total').gte('entry_date', firstDayOfMonthStr).lte('entry_date', todayStr);
      const { data: yearData } = await supabase.from('entries').select('grand_total').gte('entry_date', firstDayOfYearStr).lte('entry_date', todayStr);
      const { data: catData } = await supabase.from('entries').select('grand_total, categories ( name )').gte('entry_date', firstDayOfMonthStr).lte('entry_date', todayStr);

      const todayExpenseSum = (todayData || []).reduce((sum, curr) => sum + (Number(curr.grand_total) || 0), 0);
      const todayBagsSum = (todayData || []).reduce((sum, curr) => sum + (Number(curr.total_bag) || 0), 0);
      const monthExpenseSum = (monthData || []).reduce((sum, curr) => sum + (Number(curr.grand_total) || 0), 0);
      const yearExpenseSum = (yearData || []).reduce((sum, curr) => sum + (Number(curr.grand_total) || 0), 0);

      const categoriesList = ['Boiler', 'Cattle', 'Fish', 'Other'];

      const grouped = (catData || []).reduce((acc: any, curr: any) => {
        const categoryName = curr.categories?.name || 'Other';

        acc[categoryName] = (acc[categoryName] || 0) + (Number(curr.grand_total) || 0);

        return acc;
      }, {});

      const formattedCategories = categoriesList.map(cat => ({
        categoryName: cat,
        amount: grouped[cat] || 0
      }));

      const { data: recent } = await supabase.from('entries').select('id, entry_date, grand_total, total_bag, categories ( name ), subcategories ( name )').order('entry_date', { ascending: false }).limit(10);

      setStats({ todayExpense: todayExpenseSum, todayBags: todayBagsSum, monthExpense: monthExpenseSum, yearExpense: yearExpenseSum });
      setCategoryBreakdown(formattedCategories);
      setRecentData(recent || []);
    } catch (error) {
      Alert.alert('Dashboard Error', 'Failed to fetch data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDashboardMetrics(); }, []);

  if (loading && !refreshing) return <SafeAreaView className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#059669" /></SafeAreaView>;

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchDashboardMetrics} />}>
          <View className="flex-row flex-wrap justify-between py-4 px-4 gap-y-3">
            <StatCard title="Today's Expense" value={`৳ ${stats.todayExpense.toLocaleString()}`} icon="cash" iconBg="bg-green-600" borderColor="border-green-200" textColor="text-green-700" />
            <StatCard title="Total Feed Bags" value={`${stats.todayBags} Bags`} icon="album" iconBg="bg-blue-500" borderColor="border-blue-200" textColor="text-blue-600" />
            <StatCard title="This Month's Expense" value={`৳ ${stats.monthExpense.toLocaleString()}`} icon="calendar" iconBg="bg-purple-500" borderColor="border-purple-200" textColor="text-purple-700" />
            <StatCard title="This Year's Expense" value={`৳ ${stats.yearExpense.toLocaleString()}`} icon="trending-up" iconBg="bg-amber-500" borderColor="border-amber-200" textColor="text-amber-600" />
          </View>
          <CategoryExpense data={categoryBreakdown} />
          <RecentEntries entries={recentData} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}