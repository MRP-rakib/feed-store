import React, { useState, useEffect } from 'react';
import { 
  Text, View, SectionList, TextInput, TouchableOpacity, 
  Alert, RefreshControl, Modal, TouchableWithoutFeedback 
} from 'react-native';
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

interface HistoryEntry {
  id: string;
  category_name: string;
  subcategory_name: string;
  total_bag: number;
  bag_weight: number;
  bag_price: number;
  total_kg: number;
  total_price: number;
  transport_cost: number;
  grand_total: number;
  note: string | null;
  entry_date: string;
}

export default function HistoryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historyList, setHistoryList] = useState<HistoryEntry[]>([]);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      if (!refreshing) setLoading(true);
      const { data, error } = await supabase
        .from('entries')
        .select(`*, categories(name), subcategories(name)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistoryList(data.map((item: any) => ({
        ...item,
        category_name: item.categories?.name || 'Unknown',
        subcategory_name: item.subcategories?.name || 'Unknown'
      })));
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  const formatWeight = (kg: number) => {
    return kg >= 1000 ? `${(kg / 1000).toFixed(2)} Ton` : `${kg} kg`;
  };

  const handleDelete = (id: string) => {
    setMenuVisible(null);
    Alert.alert('Delete Record', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await supabase.from('entries').delete().eq('id', id);
        setHistoryList(prev => prev.filter(i => i.id !== id));
      }}
    ]);
  };

  const filteredHistory = historyList.filter(item => 
    item.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.note?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <View className="flex-row items-center mb-5 bg-white border border-slate-200 rounded-full px-4 h-12 shadow-sm">
        <Feather name="search" size={18} color="#94A3B8" />
        <TextInput placeholder="Search..." value={searchQuery} onChangeText={setSearchQuery} className="flex-1 ml-3 text-base" />
      </View>

      <SectionList
        sections={[{ title: 'Records', data: filteredHistory }]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
            <Modal transparent visible={menuVisible === item.id} animationType="fade">
              <TouchableWithoutFeedback onPress={() => setMenuVisible(null)}>
                <View className="flex-1 bg-black/20 justify-center items-center">
                  <View className="bg-white rounded-xl w-40 overflow-hidden shadow-lg">
                    <TouchableOpacity className="p-4 border-b border-slate-100" onPress={() => {
                      setMenuVisible(null);
                      router.push({ pathname: "/history/EditEntryScreen", params: { entry: JSON.stringify(item) }});
                    }}>
                      <Text className="font-semibold text-slate-700">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="p-4" onPress={() => handleDelete(item.id)}>
                      <Text className="font-semibold text-red-500">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <View className="flex-row justify-between items-center mb-3">
              <View>
                <Text className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                  {new Date(item.entry_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
                <Text className="text-sm font-black text-slate-800 uppercase">{item.category_name}</Text>
                <Text className="text-xs text-slate-400 font-semibold">{item.subcategory_name}</Text>
              </View>
              <TouchableOpacity onPress={() => setMenuVisible(item.id)}>
                <SimpleLineIcons name="options-vertical" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-xs text-slate-500">Bags / Weight:</Text>
                <Text className="text-xs font-bold text-slate-800">
                  {item.total_bag} × {item.bag_weight}kg ({formatWeight(item.total_kg)})
                </Text>
              </View>
              <View className="flex-row justify-between"><Text className="text-xs text-slate-500">Price per Bag:</Text><Text className="text-xs font-bold text-slate-800">৳ {item.bag_price.toLocaleString()}</Text></View>
              <View className="flex-row justify-between"><Text className="text-xs text-slate-500">Total Feed Cost:</Text><Text className="text-xs font-bold text-slate-800">৳ {item.total_price.toLocaleString()}</Text></View>
              <View className="flex-row justify-between"><Text className="text-xs text-slate-500">Transport:</Text><Text className="text-xs font-bold text-emerald-700">৳ {item.transport_cost.toLocaleString()}</Text></View>
            </View>

            {item.note ? (
              <View className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-100">
                <Text className="text-[10px] font-bold text-amber-600 uppercase mb-0.5">Note:</Text>
                <Text className="text-xs text-amber-900 italic">{item.note}</Text>
              </View>
            ) : null}

            <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-slate-100">
              <Text className="text-xs font-black uppercase text-slate-400">Grand Total</Text>
              <Text className="text-base font-black text-slate-900">৳ {item.grand_total.toLocaleString()}</Text>
            </View>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchHistory} />}
      />
    </View>
  );
}