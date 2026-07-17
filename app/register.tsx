import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) {
        Alert.alert('Registration Error', error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: data.user.id,
              full_name: '',
              farm_name: '',
              avatar: null,
            },
          ]);

        if (profileError) {
          Alert.alert('Profile Error', profileError.message);
          setLoading(false);
          return;
        }
      }

      await AsyncStorage.setItem('isRegistered', 'true');

      Alert.alert(
        'Success',
        'Account created successfully'
      );

      router.replace('/login');

    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-white">

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >

          <View className="flex-1 px-6 justify-center py-10">

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
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 mb-4"
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
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 mb-4"
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
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50"
                placeholder="Confirm password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={secureText}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />


              <TouchableOpacity
                onPress={() => setSecureText(!secureText)}
                className="mt-3"
              >
                <Text className="text-green-700">
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