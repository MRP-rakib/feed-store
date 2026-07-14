import React from 'react';
import { View, Text } from 'react-native';

export default function Header() {
  const date = new Date(Date.now()).toDateString()

  return (
    <View className="mb-5 px-4 pt-6">
      <Text className="text-gray-500 text-sm font-medium">Assalamu Alaikum,</Text>
      <Text className="text-2xl font-bold text-gray-800 mt-0.5">Kasir Feed Store</Text>
      <Text className="text-gray-400 text-xs mt-1">{date}</Text>
    </View>
  );
}