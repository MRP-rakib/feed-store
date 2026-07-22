import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    const { count, error: countError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (count && count > 0) {
      Toast.show({
        type: "error",
        text1: "Access Denied",
        text2: "Registration is restricted to only one user.",
      });
      return;
    }
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "All fields are required.",
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Weak Password",
        text2: "Password must be at least 6 characters.",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: error.message,
        });
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              user_id: data.user.id,
              full_name: "",
              farm_name: "",
              avatar: null,
            },
          ]);

        if (profileError) {
          Toast.show({
            type: "error",
            text1: "Profile Error",
            text2: profileError.message,
          });
          return;
        }
      }

      await AsyncStorage.setItem("isRegistered", "true");

      Toast.show({
        type: "success",
        text1: "Registration Successful 🎉",
        text2: "Your account has been created.",
      });

      setTimeout(() => {
        router.replace("/login");
      }, 1000);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Unexpected Error",
        text2: err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
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
            <View className="items-center mb-6">
              <View className="border-4 border-green-700 rounded-2xl p-4 mb-3">
                <Ionicons
                  name="leaf"
                  size={40}
                  color="#15803d"
                />
              </View>
              <Text className="text-2xl font-bold text-green-700">
                Create Account
              </Text>
            </View>

            <View>
              <Text className="text-gray-600 font-medium mb-2">
                Email
              </Text>
              <TextInput
                className="w-full border text-black border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 mb-4"
                placeholder="Enter email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text className="text-gray-600 font-medium mb-2">
                Password
              </Text>
              <TextInput
                className="w-full border text-black border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 mb-4"
                placeholder="Create password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={secureText}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />

              <Text className="text-gray-600 font-medium mb-2">
                Confirm Password
              </Text>
              <TextInput
                className="w-full border text-black border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50"
                placeholder="Confirm password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={secureText}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />

              <TouchableOpacity
                onPress={() => setSecureText(!secureText)}
                className="mt-3 self-start"
              >
                <Text className="text-green-700 font-medium">
                  {secureText ? 'Show Password' : 'Hide Password'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="w-full bg-green-600 py-4 rounded-xl items-center mt-8"
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white font-bold text-lg">
                {loading ? 'Loading...' : 'Register'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-500">
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/login')}
              >
                <Text className="text-green-700 font-semibold ml-1">
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}