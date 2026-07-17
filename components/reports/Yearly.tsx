import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

export default function YearlyReportScreen() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const report = useMemo(() => {
    const stats = {
      totalBags: 0, 
      totalTransport: 0, 
      totalCost: 0,
      breakdown: { Chicken: 0, Cow: 0, Fish: 0, Other: 0 }
    };

    entries.forEach(item => {
      const entryDate = new Date(item.entry_date);
      if (entryDate.getFullYear() === selectedYear) {
        stats.totalBags += Number(item.total_bag) || 0;
        stats.totalTransport += Number(item.transport_cost) || 0;
        stats.totalCost += Number(item.grand_total) || 0;

        const cat = (item.categories?.name || 'Other').toLowerCase();
        const cost = Number(item.grand_total) || 0;

        if (cat.includes('chicken') || cat.includes('poultry')) stats.breakdown.Chicken += cost;
        else if (cat.includes('cow') || cat.includes('cattle')) stats.breakdown.Cow += cost;
        else if (cat.includes('fish')) stats.breakdown.Fish += cost;
        else stats.breakdown.Other += cost;
      }
    });
    return stats;
  }, [entries, selectedYear]);

  if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#059669" /></View>;

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="flex-row items-center justify-between mb-6 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
        <TouchableOpacity onPress={() => setSelectedYear(selectedYear - 1)} className="p-2">
          <MaterialCommunityIcons name="chevron-left" size={24} color="#334155" />
        </TouchableOpacity>
        
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text className="font-black text-slate-800 text-lg" numberOfLines={1} adjustsFontSizeToFit>
            Year: {selectedYear}
          </Text>
        </View>
        
        <TouchableOpacity onPress={() => setSelectedYear(selectedYear + 1)} className="p-2">
          <MaterialCommunityIcons name="chevron-right" size={24} color="#334155" />
        </TouchableOpacity>
      </View>

      <View className="bg-emerald-600 rounded-2xl p-6 mb-8 shadow-lg">
        <Text className="text-emerald-100 text-xs uppercase font-bold tracking-widest">Total Expenditure ({selectedYear})</Text>
        <Text className="text-white text-4xl font-black mt-1">৳ {report.totalCost.toLocaleString()}</Text>
      </View>

      <View className="flex-row justify-between mb-8">
        <View className="bg-white p-4 rounded-2xl w-[48%] border border-emerald-100 shadow-sm">
          <Text className="text-slate-400 text-xs font-bold uppercase">Total Bags</Text>
          <Text className="text-emerald-600 text-2xl font-black">{report.totalBags}</Text>
        </View>
        <View className="bg-white p-4 rounded-2xl w-[48%] border border-emerald-100 shadow-sm">
          <Text className="text-slate-400 text-xs font-bold uppercase">Transport</Text>
          <Text className="text-rose-600 text-2xl font-black">৳ {report.totalTransport.toLocaleString()}</Text>
        </View>
      </View>

      <Text className="text-slate-800 font-bold text-lg mb-4">Category Breakdown</Text>
      <View className="space-y-3">
        {[
          { label: 'Chicken', val: report.breakdown.Chicken, icon: 'bird', color: '#f59e0b' },
          { label: 'Cow', val: report.breakdown.Cow, icon: 'cow', color: '#8b5cf6' },
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