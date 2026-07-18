import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import Toast from 'react-native-toast-message';

export default function MonthlyReportScreen() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('entries')
        .select('*, categories(name)');
      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      Toast.show({
        type:'error',
        text1:'Error',
        text2:error.message
      })
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedDate(newDate);
  };

  const report = useMemo(() => {
    const targetMonth = selectedDate.getMonth();
    const targetYear = selectedDate.getFullYear();

    const stats = {
      totalBags: 0, 
      totalWeight: 0,
      totalCost: 0,
      breakdown: { Chicken: 0, Cow: 0, Fish: 0, Other: 0 }
    };

    entries.forEach(item => {
      const entryDate = new Date(item.entry_date);
      if (entryDate.getMonth() === targetMonth && entryDate.getFullYear() === targetYear) {
        stats.totalBags += Number(item.total_bag) || 0;
        stats.totalWeight += Number(item.total_kg) || 0;
        stats.totalCost += Number(item.grand_total) || 0;

        const cat = (item.categories?.name || 'Other').toLowerCase();
        const cost = Number(item.grand_total) || 0;

        if (cat.includes('boiler') || cat.includes('poultry')) stats.breakdown.Chicken += cost;
        else if (cat.includes('cattle') || cat.includes('cattle')) stats.breakdown.Cow += cost;
        else if (cat.includes('fish')) stats.breakdown.Fish += cost;
        else stats.breakdown.Other += cost;
      }
    });
    return stats;
  }, [entries, selectedDate]);

  if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#059669" /></View>;

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      {/* Date Navigation */}
      <View className="flex-row items-center justify-between mb-6 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
        <TouchableOpacity onPress={() => changeMonth(-1)} className="p-2">
          <MaterialCommunityIcons name="chevron-left" size={24} color="#334155" />
        </TouchableOpacity>
        
        <View className="flex-1 items-center px-2">
          <Text className="font-black text-slate-800 text-lg" style={{ flexShrink: 0 }} numberOfLines={1} adjustsFontSizeToFit>
            {selectedDate.toLocaleString('default', { month: 'short' })} '{selectedDate.getFullYear().toString().slice(-2)}
          </Text>
        </View>
        
        <TouchableOpacity onPress={() => changeMonth(1)} className="p-2">
          <MaterialCommunityIcons name="chevron-right" size={24} color="#334155" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View className="flex-row justify-between mb-4">
        <View className="bg-white p-4 rounded-2xl w-[48%] border border-emerald-100 shadow-sm">
          <Text className="text-slate-400 text-xs font-bold uppercase">Total Bags</Text>
          <Text className="text-emerald-600 text-2xl font-black">{report.totalBags}</Text>
        </View>
        <View className="bg-white p-4 rounded-2xl w-[48%] border border-emerald-100 shadow-sm">
          <Text className="text-slate-400 text-xs font-bold uppercase">Total Weight</Text>
          <Text className="text-emerald-600 text-2xl font-black"> {report.totalWeight >= 1000 
    ? `${(report.totalWeight / 1000).toFixed(2)} Ton` 
    : `${report.totalWeight.toFixed(2)} kg`}</Text>
        </View>
      </View>

      {/* Grand Total */}
      <View className="bg-emerald-600 rounded-2xl p-6 mb-8 shadow-lg">
        <Text className="text-emerald-100 text-xs uppercase font-bold tracking-widest">Monthly Expenditure</Text>
        <Text className="text-white text-4xl font-black mt-1">৳ {report.totalCost.toLocaleString()}</Text>
      </View>

      {/* Breakdown */}
      <Text className="text-slate-800 font-bold text-lg mb-4">Category Breakdown</Text>
      <View className="space-y-3">
        {[
          { label: 'Boiler', val: report.breakdown.Chicken, icon: 'bird', color: '#f59e0b' },
          { label: 'Cattle', val: report.breakdown.Cow, icon: 'cow', color: '#8b5cf6' },
          { label: 'Fish', val: report.breakdown.Fish, icon: 'fish', color: '#0ea5e9' },
          { label: 'Other', val: report.breakdown.Other, icon: 'dots-horizontal', color: '#64748b' },
        ].map((item, i) => (
          <View key={i} className="bg-white p-4 rounded-xl flex-row items-center justify-between border border-slate-100 shadow-sm">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full justify-center items-center" style={{ backgroundColor: `${item.color}20` }}>
                <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text className="font-bold text-slate-700 ml-3">{item.label}</Text>
            </View>
            <Text className="font-black text-slate-900">৳ {item.val.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}