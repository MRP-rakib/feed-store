import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  SectionList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  RefreshControl
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

// TypeScript Interfaces
interface HistoryEntry {
  id: string;
  entry_date: string;
  created_at: string;
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
}

interface GroupedSection {
  title: string; 
  data: HistoryEntry[];
}

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      if (!refreshing) setLoading(true);
      
      const { data, error } = await supabase
        .from('entries') 
        .select(`
          id,
          entry_date,
          created_at,
          total_bag,
          bag_weight,
          bag_price,
          total_kg,
          total_price,
          transport_cost,
          grand_total,
          note,
          categories(name),
          subcategories(name)
        `)
        .order('entry_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedData: HistoryEntry[] = (data as any[]).map((item) => {
          const categoryName = Array.isArray(item.categories)
            ? item.categories[0]?.name
            : item.categories?.name;

          const subcategoryName = Array.isArray(item.subcategories)
            ? item.subcategories[0]?.name
            : item.subcategories?.name;

          return {
            id: item.id.toString(),
            entry_date: item.entry_date,
            created_at: item.created_at,
            category_name: categoryName || 'Unknown Category',
            subcategory_name: subcategoryName || 'Unknown Subcategory',
            total_bag: Number(item.total_bag) || 0,
            bag_weight: Number(item.bag_weight) || 0,
            bag_price: Number(item.bag_price) || 0,
            total_kg: Number(item.total_kg) || 0,
            total_price: Number(item.total_price) || 0,
            transport_cost: Number(item.transport_cost) || 0,
            grand_total: Number(item.grand_total) || 0,
            note: item.note || null,
          };
        });
        setHistoryList(formattedData);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load entries history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const handleDeleteEntry = async (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this entry record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('entries')
                .delete()
                .eq('id', id);

              if (error) throw error;

              setHistoryList(prev => prev.filter(item => item.id !== id));
              Alert.alert('Success', 'Record deleted successfully.');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Could not delete record.');
            }
          }
        }
      ]
    );
  };

  const formatDateHeader = (dateString: string): string => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Fixed Icon Type Error
  const getCategoryIcon = (category: string): React.ComponentProps<typeof MaterialCommunityIcons>['name'] => {
    const cat = category.toLowerCase();
    
    if (cat.includes('chicken') || cat.includes('poultry') || cat.includes('মুরগি')) {
      return 'bird'; // 'bird' is a valid icon name
    }
    if (cat.includes('duck') || cat.includes('হাস')) {
      return 'duck';
    }
    if (cat.includes('cow') || cat.includes('cattle') || cat.includes('গরু')) {
      return 'cow';
    }
    if (cat.includes('fish') || cat.includes('মাছ')) {
      return 'fish';
    }
    return 'corn'; 
  };

  const filteredHistory = historyList.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.category_name.toLowerCase().includes(query) ||
      item.subcategory_name.toLowerCase().includes(query) ||
      (item.note && item.note.toLowerCase().includes(query))
    );
  });

  const groupedSections: GroupedSection[] = [];
  filteredHistory.forEach(item => {
    const dateStr = formatDateHeader(item.entry_date);
    const existingSection = groupedSections.find(sec => sec.title === dateStr);
    
    if (existingSection) {
      existingSection.data.push(item);
    } else {
      groupedSections.push({ title: dateStr, data: [item] });
    }
  });

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="text-emerald-700 mt-4 font-semibold text-base">Fetching History...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <View className="flex-row items-center mb-5 space-x-2">
        <View className="flex-1 flex-row items-center bg-white border border-slate-200 rounded-full px-4 py-2.5 shadow-sm">
          <Feather name="search" size={18} color="#94A3B8" className="mr-2" />
          <TextInput
            placeholder="Search by category, model or note..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-base p-0 text-slate-800"
            placeholderTextColor="#94A3B8"
          />
        </View>
        <TouchableOpacity 
          onPress={handleRefresh}
          className="bg-white border border-slate-200 p-2.5 rounded-full shadow-sm active:bg-slate-100"
        >
          <Feather name="refresh-cw" size={18} color="#475569" />
        </TouchableOpacity>
      </View>

      <SectionList
        sections={groupedSections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#059669"]} />
        }
        renderSectionHeader={({ section: { title } }) => (
          <View className="flex-row items-center my-3 px-1 bg-slate-50 py-1">
            <View className="h-[1px] flex-1 bg-slate-200" />
            <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mx-3">
              {title}
            </Text>
            <View className="h-[1px] flex-1 bg-slate-200" />
          </View>
        )}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden mb-4">
            <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />
            <View className="flex-row items-center justify-between mb-3 pl-1.5">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-emerald-50 justify-center items-center mr-3">
                  <MaterialCommunityIcons 
                    name={getCategoryIcon(item.category_name)} 
                    size={22} 
                    color="#059669" 
                  />
                </View>
                <View>
                  <Text className="text-sm font-black text-slate-800 uppercase tracking-wide">
                    {item.category_name}
                  </Text>
                  <Text className="text-xs text-slate-400 font-semibold mt-0.5">
                    Model: {item.subcategory_name}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => handleDeleteEntry(item.id)}
                className="p-1.5 bg-rose-50 rounded-lg active:bg-rose-100"
              >
                <MaterialCommunityIcons name="delete-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
            <View className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 space-y-2 mb-2 ml-1.5">
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-slate-500 font-semibold">Bags / Weight:</Text>
                <Text className="text-xs text-slate-800 font-bold">
                  {item.total_bag} Bags × {item.bag_weight} kg ({item.total_kg} kg)
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-slate-500 font-semibold">Price per Bag:</Text>
                <Text className="text-xs text-slate-800 font-bold">৳ {item.bag_price.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-slate-500 font-semibold">Total Feed Cost:</Text>
                <Text className="text-xs text-slate-800 font-bold">৳ {item.total_price.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-slate-500 font-semibold">Transport Cost:</Text>
                <Text className="text-xs text-emerald-700 font-bold">৳ {item.transport_cost.toLocaleString()}</Text>
              </View>
              {item.note ? (
                <View className="pt-2 border-t border-slate-100/60 mt-1">
                  <Text className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Note</Text>
                  <Text className="text-xs text-slate-600 italic">"{item.note}"</Text>
                </View>
              ) : null}
            </View>
            <View className="flex-row justify-between items-center pt-2.5 border-t border-slate-100 ml-1.5">
              <Text className="text-xs font-black uppercase text-slate-400 tracking-wider">Grand Total</Text>
              <Text className="text-base font-black text-slate-900">
                ৳ {item.grand_total.toLocaleString()}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="py-16 items-center justify-center">
            <MaterialCommunityIcons name="clipboard-text-search-outline" size={48} color="#94A3B8" />
            <Text className="text-slate-500 font-semibold text-lg mt-4">No entries found</Text>
            <Text className="text-slate-400 text-sm mt-1 text-center px-6">
              Try searching for another feed type or complete a new purchase entry.
            </Text>
          </View>
        }
      />
    </View>
  );
}