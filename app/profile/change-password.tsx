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

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }

    Alert.alert('Success', 'Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
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
              <Text className="text-2xl font-bold text-slate-900">Change Password</Text>
              <Text className="text-sm text-slate-500 mt-1">
                Choose a strong and secure password to protect your account.
              </Text>
            </View>

            <View className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100 mb-6" style={{ gap: 16 }}>
              <View>
                <Text className="text-xs font-semibold text-slate-600 mb-1.5">Current Password</Text>
                <TextInput
                  placeholder="Enter current password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  value={currentPassword}
                  onChangeText={(text) => setCurrentPassword(text)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900"
                />
              </View>

              <View>
                <Text className="text-xs font-semibold text-slate-600 mb-1.5">New Password</Text>
                <TextInput
                  placeholder="Enter new password (min. 6 characters)"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  value={newPassword}
                  onChangeText={(text) => setNewPassword(text)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900"
                />
              </View>

              <View>
                <Text className="text-xs font-semibold text-slate-600 mb-1.5">Confirm New Password</Text>
                <TextInput
                  placeholder="Re-type new password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900"
                />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleChangePassword}
              className="w-full h-12 bg-green-600 rounded-xl justify-center items-center shadow-sm active:bg-emerald-700"
            >
              <Text className="text-base font-bold text-white">Update Password</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}