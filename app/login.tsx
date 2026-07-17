import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      router.replace('/(tab)/home');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-6 justify-center py-10">
            <View className="items-center mb-8">
              <View className="border-4 border-green-700 rounded-2xl p-4 mb-3"><Ionicons name="leaf" size={50} color="#15803d" /></View>
              <Text className="text-2xl font-bold text-green-700">Feed Store</Text>
            </View>

            <View className="space-y-4">
              <Text className="text-gray-600 font-medium">Email</Text>
              <TextInput className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50" placeholder="Enter email" value={email} onChangeText={setEmail} autoCapitalize="none" />
              
              <Text className="text-gray-600 font-medium">Password</Text>
              <TextInput className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50" placeholder="Enter password" secureTextEntry value={password} onChangeText={setPassword} autoCapitalize="none" />
            </View>

            <TouchableOpacity className="w-full bg-green-600 py-4 rounded-xl items-center mt-8" onPress={handleLogin} disabled={loading}>
              <Text className="text-white font-bold text-lg">{loading ? "Logging in..." : "Login"}</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-500">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}><Text className="text-green-700 font-semibold">Register</Text></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}