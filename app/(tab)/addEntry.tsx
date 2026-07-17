import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  RefreshControl
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../../lib/supabase';

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  price: string; 
  weight: string; 
}

interface SimpleSelectProps<T> {
  label: string;
  placeholder: string;
  value: T | null;
  options: T[];
  getLabel: (opt: T) => string;
  onSelect: (selectedOption: T) => void;
  disabled?: boolean;
}

function SimpleSelect<T>({ label, placeholder, value, options, getLabel, onSelect, disabled = false }: SimpleSelectProps<T>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <View className="mb-4">
      <Text className="text-slate-700 font-bold mb-1.5 text-[14px] uppercase tracking-wider">{label}</Text>
      <TouchableOpacity 
        onPress={() => {
          if (!disabled) setIsOpen(!isOpen);
        }} 
        disabled={disabled}
        className={`flex-row justify-between items-center bg-white border ${isOpen ? 'border-emerald-500' : 'border-slate-200'} rounded-xl p-3.5 ${disabled ? 'bg-slate-100 opacity-60' : ''}`}
        activeOpacity={0.7}
      >
        <Text className={`text-base font-medium ${value ? 'text-slate-900' : 'text-slate-400'}`}>
          {value ? getLabel(value) : placeholder}
        </Text>
        <Text className="text-emerald-600 font-bold text-xs">{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      
      {isOpen && options.length > 0 && (
        <View className="bg-white border border-emerald-100 rounded-xl mt-2.5 overflow-hidden shadow-lg shadow-emerald-100/50">
          <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }} keyboardShouldPersistTaps="handled">
            {options.map((opt: T, index: number) => {
              const isLast = index === options.length - 1;
              return (
                <TouchableOpacity 
                  key={index} 
                  className={`p-4 active:bg-emerald-50 ${isLast ? '' : 'border-b border-slate-50'}`}
                  onPress={() => {
                    onSelect(opt);
                    setIsOpen(false);
                  }}
                >
                  <Text className="text-slate-700 text-base font-medium">{getLabel(opt)}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export default function FeedEntryForm() {
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);

  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [totalBags, setTotalBags] = useState<string>(''); 
  const [transportCost, setTransportCost] = useState<string>(''); 
  const [note, setNote] = useState<string>('');

  const [calculatedKg, setCalculatedKg] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const bags = parseFloat(totalBags) || 0;
    const bagWeight = selectedSubCategory ? parseFloat(selectedSubCategory.weight) || 0 : 0;
    const bagPrice = selectedSubCategory ? parseFloat(selectedSubCategory.price) || 0 : 0;
    const transport = parseFloat(transportCost) || 0;

    const kg = bags * bagWeight;
    const price = bags * bagPrice;
    const grand = price + transport;

    setCalculatedKg(kg);
    setTotalPrice(price);
    setGrandTotal(grand);
  }, [totalBags, selectedSubCategory, transportCost]);

  const fetchInitialData = async (isRefreshing = false) => {
    try {
      if (isRefreshing) setRefreshing(true);
      else setLoading(true);
      
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('id, name');
      
      if (catError) throw catError;
      setCategories(catData || []);

      const { data: subData, error: subError } = await supabase
        .from('subcategories')
        .select('id, categoryId:category_id, name, price, weight');

      if (subError) throw subError;
      setSubCategories(subData || []);

    } catch (error: any) {
      Alert.alert('Database Fetch Error', error.message || 'Could not fetch records.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    const filtered = subCategories.filter(sub => sub.categoryId === category.id);
    setFilteredSubCategories(filtered);
  };

  const onDateValueChange = (event: any, selectedDate?: Date): void => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  };

  const handleSave = async (): Promise<void> => {
    if (!selectedCategory) {
      Alert.alert('Validation Error', 'Please select a main category.');
      return;
    }
    if (!selectedSubCategory) {
      Alert.alert('Validation Error', 'Please select a subcategory model.');
      return;
    }
    if (!totalBags.trim() || isNaN(Number(totalBags)) || Number(totalBags) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid bag count.');
      return;
    }

    const bagWeight = parseFloat(selectedSubCategory.weight);
    const bagPrice = parseFloat(selectedSubCategory.price);
    const transport = parseFloat(transportCost) || 0;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const parseId = (id: string) => {
      const parsed = parseInt(id, 10);
      return isNaN(parsed) ? id : parsed;
    };

    try {
      setSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('entries')
        .insert([
          {
            user_id: user?.id,
            entry_date: formattedDate,
            category_id: parseId(selectedCategory.id),
            subcategory_id: parseId(selectedSubCategory.id),
            total_bag: parseInt(totalBags, 10),
            bag_weight: bagWeight,
            bag_price: bagPrice,
            total_kg: calculatedKg,
            total_price: totalPrice,
            transport_cost: transport,
            grand_total: grandTotal,
            note: note.trim() || null
          }
        ]);

      if (error) throw error;

      Alert.alert('Success', 'Entry saved successfully!');
      
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setTotalBags('');
      setTransportCost('');
      setNote('');
      setDate(new Date());

    } catch (error: any) {
      Alert.alert('Database Connection Error', error.message || 'Failed to save entries data.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
          <ActivityIndicator size="large" color="#059669" />
          <Text className="text-emerald-700 mt-4 font-semibold text-base">Loading configuration...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-slate-50">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
            className="px-5 py-6"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={() => fetchInitialData(true)} 
                tintColor="#059669"
                colors={['#059669']}
              />
            }
          >
            <View className="mb-6 px-1">
              <Text className="text-2xl font-black text-slate-900 tracking-tight">New Feed Entry</Text>
              <Text className="text-sm text-slate-500 mt-1 font-medium">
                Record daily livestock feed usage logs and expense summaries.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-slate-700 font-bold mb-1.5 text-[14px] uppercase tracking-wider">Date</Text>
              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                className="flex-row justify-between items-center bg-white border border-slate-200 rounded-xl p-3.5"
                activeOpacity={0.7}
              >
                <Text className="text-slate-800 text-base font-semibold">
                  {date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
                <Text className="text-emerald-600 text-base">📅</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  maximumDate={new Date()} 
                  onChange={onDateValueChange}      
                />
              )}
            </View>

            <SimpleSelect 
              label="Main Category" 
              placeholder="Choose dynamic category"
              value={selectedCategory}
              options={categories}
              getLabel={(c) => c.name}
              onSelect={handleCategorySelect}
            />

            <SimpleSelect 
              label="Subcategory (Feed Name)" 
              placeholder={selectedCategory ? "Choose feed model" : "Select main category first"}
              value={selectedSubCategory}
              options={filteredSubCategories}
              getLabel={(sc) => `${sc.name} (${sc.weight} kg)`}
              onSelect={(val) => setSelectedSubCategory(val)}
              disabled={!selectedCategory}
            />

            {selectedSubCategory && (
              <View className="mb-4 p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl flex-row justify-between">
                <View>
                  <Text className="text-slate-400 text-xs font-bold uppercase">Model Weight</Text>
                  <Text className="text-slate-950 text-base font-extrabold mt-1">{selectedSubCategory.weight} Kg</Text>
                </View>
                <View className="h-full w-[1px] bg-emerald-100" />
                <View>
                  <Text className="text-slate-400 text-xs font-bold uppercase">Bag Price</Text>
                  <Text className="text-emerald-700 text-base font-extrabold mt-1">৳ {selectedSubCategory.price}</Text>
                </View>
              </View>
            )}

            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-slate-700 font-bold mb-1.5 text-[14px] uppercase tracking-wider">Total Bags</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  value={totalBags}
                  onChangeText={setTotalBags}
                  className="bg-white border border-slate-200 focus:border-emerald-500 rounded-xl p-3.5 text-slate-800 text-base font-semibold"
                />
              </View>
              <View className="flex-1">
                <Text className="text-slate-700 font-bold mb-1.5 text-[14px] uppercase tracking-wider">Transport (৳)</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="#94a3b8"
                  value={transportCost}
                  onChangeText={setTransportCost}
                  className="bg-white border border-slate-200 focus:border-emerald-500 rounded-xl p-3.5 text-slate-800 text-base font-semibold"
                />
              </View>
            </View>

            <View className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 mb-5 gap-3">
              <View className="flex-row justify-between items-center pb-2 border-b border-emerald-100/50">
                <Text className="text-slate-500 font-bold text-xs uppercase">Calculated Weight (Total KG)</Text>
                <Text className="text-emerald-950 font-black text-lg">{formatNumber(calculatedKg)} kg</Text>
              </View>
              <View className="flex-row justify-between items-center pb-2 border-b border-emerald-100/50">
                <Text className="text-slate-500 font-bold text-xs uppercase">Feed Sub-Total</Text>
                <Text className="text-slate-900 font-bold text-lg">৳ {formatNumber(totalPrice)}</Text>
              </View>
              <View className="flex-row justify-between items-center pt-1">
                <Text className="text-emerald-800 font-bold text-sm uppercase">Grand Total Cost</Text>
                <Text className="text-emerald-950 font-black text-2xl">৳ {formatNumber(grandTotal)}</Text>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-slate-700 font-bold mb-1.5 text-[14px] uppercase tracking-wider">Notes (Optional)</Text>
              <TextInput
                multiline
                numberOfLines={3}
                placeholder="Write extra details or logs here..."
                placeholderTextColor="#94a3b8"
                value={note}
                onChangeText={setNote}
                className="bg-white border border-slate-200 focus:border-emerald-500 rounded-xl p-4 text-slate-800 text-base min-h-[90px]"
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity 
              onPress={handleSave}
              disabled={submitting}
              className="bg-emerald-600 h-12 rounded-xl items-center justify-center shadow-lg shadow-emerald-200 active:bg-emerald-700"
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white font-black text-base tracking-wide uppercase">Save Entry</Text>
              )}
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}