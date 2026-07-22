import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please enter your email and password.",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Welcome 👋",
      text2: "Login successful",
    });

    setTimeout(() => {
      router.replace("/(tab)/home");
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 20 }} 
          showsVerticalScrollIndicator={false} 
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View className="px-6 py-10">
            <View className="items-center mb-8">
              <View className="border-4 border-green-700 rounded-2xl p-4 mb-3">
                <Ionicons name="leaf" size={50} color="#15803d" />
              </View>
              <Text className="text-2xl font-bold text-green-700">Feed Store</Text>
            </View>

            <View className="space-y-4">
              <Text className="text-gray-600 font-medium">Email</Text>
              <TextInput 
                className="w-full border text-black border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 mb-3" 
                placeholder="Enter email" 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none" 
              />
              
              <Text className="text-gray-600 font-medium">Password</Text>
              <TextInput 
                className="w-full border text-black border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50" 
                placeholder="Enter password" 
                secureTextEntry 
                value={password} 
                onChangeText={setPassword} 
                autoCapitalize="none" 
              />
            </View>

            <TouchableOpacity 
              className="w-full bg-green-600 py-4 rounded-xl items-center mt-8" 
              onPress={handleLogin} 
              disabled={loading}
            >
              <Text className="text-white font-bold text-lg">{loading ? "Logging in..." : "Login"}</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-500">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text className="text-green-700 font-semibold">Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}