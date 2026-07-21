import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

interface RecentEntry {
  id: string;
  entry_date: string;
  grand_total: number;
  total_bag: number;
  categories: { name: string } | { name: string }[] | null;
  subcategories: { name: string } | { name: string }[] | null;
}

interface RecentEntriesProps {
  entries: RecentEntry[];
}

export default function RecentEntries({ entries = [] }: RecentEntriesProps) {
  const safeEntries = Array.isArray(entries) ? entries : [];
  const displayedEntries = safeEntries.slice(0, 5);

  const handleSeeAll = () => {
    router.push('/(tab)/history'); 
  };

  return (
    <View className="px-4 py-3">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-black text-slate-900">Recent Expenses</Text>
        
        <TouchableOpacity onPress={handleSeeAll} activeOpacity={0.7}>
          <Text className="text-sm font-bold text-emerald-600">See All →</Text>
        </TouchableOpacity>
      </View>
      
      {safeEntries.length === 0 ? (
        <View className="bg-white rounded-2xl p-6 border border-slate-100 items-center">
          <Text className="text-slate-400 font-semibold">No data found</Text>
        </View>
      ) : (
        <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          {displayedEntries.map((item, index) => {
            const categoryObj = item?.categories;
            const subCategoryObj = item?.subcategories;

            const categoryName = Array.isArray(categoryObj) 
              ? categoryObj[0]?.name 
              : categoryObj?.name;

            const subCategoryName = Array.isArray(subCategoryObj) 
              ? subCategoryObj[0]?.name 
              : subCategoryObj?.name;

            const rawTotal = item?.grand_total;
            const grandTotal = (rawTotal !== null && rawTotal !== undefined && !isNaN(Number(rawTotal)))
              ? Number(rawTotal)
              : 0;

            const totalBag = item?.total_bag !== null && item?.total_bag !== undefined && !isNaN(Number(item.total_bag))
              ? Number(item.total_bag)
              : 0;

            const formattedDate = item?.entry_date ? new Date(item.entry_date).toLocaleDateString('en-US') : '';

            return (
              <View 
                key={item?.id || index} 
                className={`p-4 flex-row justify-between items-center ${
                  index !== displayedEntries.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <View className="flex-1 pr-3">
                  <Text className="text-slate-900 font-bold text-base" numberOfLines={1}>
                    {subCategoryName || 'Unknown Feed'}
                  </Text>
                  <Text className="text-slate-400 text-xs mt-0.5">
                    {categoryName || 'Category'} • {totalBag} Bags
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-emerald-600 font-black text-base">
                    ৳ {grandTotal.toLocaleString()}
                  </Text>
                  <Text className="text-slate-400 text-[10px] mt-0.5">
                    {formattedDate}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}