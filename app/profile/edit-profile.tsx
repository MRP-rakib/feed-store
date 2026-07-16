import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfile() {
  const [username, setUsername] = useState('rifat_farms');
  const [fullName, setFullName] = useState('Rifat Hossain');
  const [email, setEmail] = useState('rifat.farm@gmail.com');
  const [farmName, setFarmName] = useState('Green Agro & Dairy');

  const handleSaveProfile = () => {
    if (!username.trim() || !fullName.trim() || !email.trim() || !farmName.trim()) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    Alert.alert('Success', 'Profile updated successfully!');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-slate-50">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            className="p-6"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            <View className="mb-6 mt-2">
              <Text className="text-2xl font-bold text-slate-900">Edit Profile</Text>
              <Text className="text-sm text-slate-500 mt-1">
                Update your personal details and farm identity settings.
              </Text>
            </View>

            <View className="items-center my-6">
              <View className="w-24 h-24 bg-green-600 rounded-full justify-center items-center shadow-md shadow-emerald-100">
                <Text className="text-3xl font-bold text-white">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
              <TouchableOpacity activeOpacity={0.7} className="mt-3">
                <Text className="text-sm font-semibold text-emerald-600">Change Avatar</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100 mb-6" style={{ gap: 16 }}>
              <View>
                <Text className="text-xs font-semibold text-slate-600 mb-1.5">Username</Text>
                <TextInput
                  placeholder="Enter username"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                  value={username}
                  onChangeText={(text) => setUsername(text)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900"
                />
              </View>

              <View>
                <Text className="text-xs font-semibold text-slate-600 mb-1.5">Full Name</Text>
                <TextInput
                  placeholder="Enter full name"
                  placeholderTextColor="#94a3b8"
                  value={fullName}
                  onChangeText={(text) => setFullName(text)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900"
                />
              </View>

              <View>
                <Text className="text-xs font-semibold text-slate-600 mb-1.5">Email Address</Text>
                <TextInput
                  placeholder="Enter email address"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900"
                />
              </View>

              <View>
                <Text className="text-xs font-semibold text-slate-600 mb-1.5">Farm Name</Text>
                <TextInput
                  placeholder="Enter farm name"
                  placeholderTextColor="#94a3b8"
                  value={farmName}
                  onChangeText={(text) => setFarmName(text)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900"
                />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSaveProfile}
              className="w-full h-12 bg-green-600 rounded-xl justify-center items-center shadow-sm active:bg-emerald-700"
            >
              <Text className="text-base font-bold text-white">Save Changes</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}