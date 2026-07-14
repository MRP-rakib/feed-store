import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-6 justify-center py-10">
            <View className="items-center mb-8">
              <View className="border-4 border-green-700 rounded-2xl p-4 mb-3 items-center justify-center">
                <Ionicons name="leaf" size={50} color="#15803d" />
              </View>
              <Text className="text-2xl font-bold text-green-700">Feed Store</Text>
              <Text className="text-gray-500 text-sm text-center w-full mt-1">হিসাব রাখুন সহজে</Text>
            </View>

            {/* Title */}
            <View className="mb-6">
              <Text className="text-xl font-bold text-gray-800">Login to your account</Text>
            </View>

            {/* Input Fields */}
            <View className="space-y-4">
              
              {/* Mobile / Email Input */}
              <View>
                <Text className="text-gray-600 font-medium mb-2">Mobile / Email</Text>
                <TextInput
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800 bg-gray-50/50"
                  placeholder="Enter mobile or email"
                  placeholderTextColor="#9ca3af"
                  value={emailOrMobile}
                  onChangeText={setEmailOrMobile}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View className="mt-4">
                <Text className="text-gray-600 font-medium mb-2">Password</Text>
                <View className="w-full border border-gray-200 rounded-xl px-4 py-1.5 flex-row items-center justify-between text-base bg-gray-50/50">
                  <TextInput
                    className="flex-1 text-base text-gray-800"
                    placeholder="Enter password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={secureText}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                    <Ionicons 
                      name={secureText ? "eye-off-outline" : "eye-outline"} 
                      size={18} 
                      color="#6b7280" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

            </View>

            {/* Remember Me & Forgot Password */}
            <View className="flex-row justify-between items-center mt-4 mb-8">
              <TouchableOpacity 
                className="flex-row items-center" 
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View className={`w-5 h-5 border rounded flex items-center justify-center mr-2 ${rememberMe ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                  {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                <Text className="text-gray-600 text-sm">Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text className="text-green-700 font-semibold text-sm">Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity className="w-full bg-green-600 py-4 rounded-xl items-center shadow-sm active:bg-green-700">
              <Text className="text-white font-bold text-lg">Login</Text>
            </TouchableOpacity>

            {/* Footer Text */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-500">Don't have an account? </Text>
              <TouchableOpacity>
                <Text className="text-green-700 font-semibold">Contact Admin</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}