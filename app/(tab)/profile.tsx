import React from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

// মেনু আইটেমের ইন্টারফেস
interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  isLogout?: boolean;
}

export default function ProfileScreen() {
  
  // স্ক্রিনশট অনুযায়ী মেনু লিস্ট ডেটা
  const menuItems: MenuItem[] = [
    { id: '1', title: 'Edit Profile', icon: 'account-outline' },
    { id: '2', title: 'Change Password', icon: 'lock-outline' },
    { id: '3', title: 'Manager Management', icon: 'account-group-outline' },
    { id: '4', title: 'Category Management', icon: 'clipboard-text-outline' },
    { id: '5', title: 'Settings', icon: 'cog-outline' },
    { id: '6', title: 'Logout', icon: 'logout', isLogout: true },
  ];

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      
      {/* ১. প্রোফাইল হেডার সেকশন */}
      <View className="flex-row items-center px-6 py-8 border-b border-gray-100">
        {/* প্রোফাইল ইমেজ (ইমেজ না থাকলে ডিফল্ট প্লেসহোল্ডার আইকন) */}
        <View className="w-16 h-16 rounded-full bg-gray-100 justify-center items-center mr-4">
          <MaterialCommunityIcons name="account" size={45} color="#9CA3AF" />
        </View>
        
        {/* নাম ও ডেজিগনেশন */}
        <View>
          <Text className="text-xl font-bold text-gray-900">Rahim Uddin</Text>
          <Text className="text-sm text-gray-400 font-medium mt-0.5">Owner</Text>
          <Text className="text-sm text-gray-400 font-medium">Rahim Feed Store</Text>
        </View>
      </View>

      {/* ২. মেনু লিস্ট সেকশন */}
      <View className="px-4 py-4">
        {menuItems.map((item) => {
          return (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center justify-between py-4 px-2 mb-1 active:bg-gray-50 rounded-xl"
              onPress={() => {
                if (item.isLogout) {
                  // লগআউট লজিক এখানে লিখবেন
                  console.log('Logging out...');
                } else {
                  console.log(`Navigating to ${item.title}`);
                }
              }}
            >
              {/* বাম দিক: আইকন এবং লেখার টেক্সট */}
              <View className="flex-row items-center">
                <View className="w-6 items-center mr-4">
                  <MaterialCommunityIcons 
                    name={item.icon} 
                    size={22} 
                    color={item.isLogout ? '#EF4444' : '#4B5563'} 
                  />
                </View>
                <Text 
                  className={`text-base font-medium ${
                    item.isLogout ? 'text-red-500 font-semibold' : 'text-gray-800'
                  }`}
                >
                  {item.title}
                </Text>
              </View>

              {/* ডান দিক: শুধুমাত্র লগআউট বাদে বাকিগুলোর জন্য Chevron Arrow */}
              {!item.isLogout && (
                <Feather name="chevron-right" size={18} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

    </ScrollView>
  );
}