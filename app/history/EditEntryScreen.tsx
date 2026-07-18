import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  Platform, Alert, ActivityIndicator, KeyboardAvoidingView
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import Toast from 'react-native-toast-message';

export default function EditEntryScreen() {
  const router = useRouter();
  const { entry: entryParam } = useLocalSearchParams();
  const entry = entryParam ? JSON.parse(entryParam as string) : null;

  const [loading, setLoading] = useState(false);
  const [totalBags, setTotalBags] = useState(entry ? entry.total_bag.toString() : '');
  const [transportCost, setTransportCost] = useState(entry ? entry.transport_cost.toString() : '');
  const [note, setNote] = useState(entry ? entry.note || '' : '');

  const [calculatedKg, setCalculatedKg] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  useEffect(() => {
    if (!entry) return;
    const bags = parseFloat(totalBags) || 0;
    const weight = parseFloat(entry.bag_weight) || 0;
    const price = parseFloat(entry.bag_price) || 0;
    const transport = parseFloat(transportCost) || 0;

    setCalculatedKg(bags * weight);
    setGrandTotal((bags * price) + transport);
  }, [totalBags, transportCost, entry]);

  const handleUpdate = async () => {
    if (!totalBags.trim() || isNaN(Number(totalBags))) {
      Alert.alert('Error', 'Please enter a valid bag count.');
      return;
    }

    setLoading(true);
    const bags = parseInt(totalBags, 10);
    const transport = parseFloat(transportCost) || 0;

    const { error } = await supabase
      .from('entries')
      .update({
        total_bag: bags,
        total_kg: bags * entry.bag_weight,
        total_price: bags * entry.bag_price,
        transport_cost: transport,
        grand_total: (bags * entry.bag_price) + transport,
        note: note.trim() || null
      })
      .eq('id', entry.id);

    if (error) {
       Toast.show({
              type:'error',
              text1:'Error',
              text2:error.message
            })
    } else {
       Toast.show({
              type:'success',
              text1:'Success',
              text2:'Entry updated successfully!'
            })
      router.back();
    }
    setLoading(false);
  };

  if (!entry) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-slate-50">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
            <View className="mb-6">
              <Text className="text-2xl font-black text-slate-900">Edit Entry</Text>
              <Text className="text-sm text-slate-500 mt-1">Updating: {entry.category_name} ({entry.subcategory_name})</Text>
            </View>
            <View className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex-row justify-between">
              <View>
                <Text className="text-slate-400 text-[10px] font-bold uppercase">Weight/Bag</Text>
                <Text className="text-slate-800 font-bold mt-1">{entry.bag_weight} kg</Text>
              </View>
              <View>
                <Text className="text-slate-400 text-[10px] font-bold uppercase">Price/Bag</Text>
                <Text className="text-emerald-700 font-bold mt-1">৳ {entry.bag_price}</Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-slate-700 font-bold mb-1.5 text-xs uppercase">Total Bags</Text>
              <TextInput
                className="bg-white border border-slate-200 rounded-xl p-4 text-base font-semibold"
                keyboardType="numeric"
                value={totalBags}
                onChangeText={setTotalBags}
              />
            </View>

            <View className="mb-4">
              <Text className="text-slate-700 font-bold mb-1.5 text-xs uppercase">Transport Cost (৳)</Text>
              <TextInput
                className="bg-white border border-slate-200 rounded-xl p-4 text-base font-semibold"
                keyboardType="numeric"
                value={transportCost}
                onChangeText={setTransportCost}
              />
            </View>

            <View className="mb-6">
              <Text className="text-slate-700 font-bold mb-1.5 text-xs uppercase">Notes</Text>
              <TextInput
                className="bg-white border border-slate-200 rounded-xl p-4 text-base min-h-[90px]"
                value={note}
                onChangeText={setNote}
                multiline
                textAlignVertical="top"
              />
            </View>
            <View className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-6">
              <View className="flex-row justify-between mb-2">
                <Text className="text-slate-500 font-bold text-xs uppercase">Total Weight</Text>
                <Text className="text-emerald-950 font-bold">{calculatedKg >= 1000
                  ? `${(calculatedKg / 1000).toFixed(2)} ton`
                  : `${calculatedKg.toFixed(2)} kg`}</Text>
              </View>
              <View className="flex-row justify-between pt-2 border-t border-emerald-100">
                <Text className="text-emerald-800 font-bold text-sm uppercase">Transport</Text>
                <Text className="text-emerald-950 font-black text-xl">৳ {transportCost.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between pt-2 border-t border-emerald-100">
                <Text className="text-emerald-800 font-bold text-sm uppercase">Grand Total</Text>
                <Text className="text-emerald-950 font-black text-xl">৳ {grandTotal.toLocaleString()}</Text>
              </View>
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => router.back()} className="flex-1 bg-slate-200 h-12 rounded-xl items-center justify-center">
                <Text className="text-slate-700 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdate} disabled={loading} className="flex-1 bg-emerald-600 h-12 rounded-xl items-center justify-center">
                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold uppercase">Update Entry</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>

  );
}