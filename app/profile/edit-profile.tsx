import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Image, SafeAreaView
} from 'react-native';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EditProfile() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [farmName, setFarmName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email || '');

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, farm_name, avatar')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setFullName(data.full_name || '');
        setFarmName(data.farm_name || '');
        setAvatarUrl(data.avatar);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as any,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = `${Date.now()}.jpg`;
      
      try {
        setLoading(true);
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, decode(base64), { contentType: 'image/jpeg' });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        setAvatarUrl(data.publicUrl);
        Alert.alert('Success', 'Avatar updated!');
      } catch (err: any) {
        Alert.alert('Upload Error', err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, farm_name: farmName, avatar: avatarUrl })
        .eq('user_id', user.id);

      if (error) throw error;
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "Permanent delete?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          try {
            await (supabase.rpc as any)('delete_user', {}, { schema: 'public' });
            await supabase.auth.signOut();
          } catch (err) {
            Alert.alert("Error", "Check Database Cascade.");
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        
        <View className="items-center mt-4 mb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</Text>
          <TouchableOpacity onPress={pickImage} className="relative">
            <View className="w-32 h-32 rounded-full bg-white border-[3px] border-green-500 justify-center items-center overflow-hidden shadow-md">
              {avatarUrl ? 
                <Image source={{ uri: avatarUrl }} className="w-full h-full" /> : 
                <Ionicons name="person" size={50} color="#cbd5e1" />
              }
            </View>
            <View className="absolute bottom-1 right-1 bg-green-600 p-2.5 rounded-full border-4 border-gray-50">
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Account Information</Text>
          
          <View className="space-y-5">
            <View>
              <Text className="text-gray-500 text-sm mb-1.5 ml-1">Full Name</Text>
              <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100">
                <Ionicons name="person-outline" size={20} color="#94a3b8" />
                <TextInput value={fullName} onChangeText={setFullName} className="flex-1 ml-3 text-gray-800 font-medium" />
              </View>
            </View>

            <View>
              <Text className="text-gray-500 text-sm mb-1.5 ml-1">Email</Text>
              <View className="flex-row items-center bg-gray-100 px-4 py-3.5 rounded-xl border border-gray-100">
                <Ionicons name="mail-outline" size={20} color="#94a3b8" />
                <TextInput value={email} editable={false} className="flex-1 ml-3 text-gray-400 font-medium" />
              </View>
            </View>

            <View>
              <Text className="text-gray-500 text-sm mb-1.5 ml-1">Farm Name</Text>
              <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100">
                <Ionicons name="leaf-outline" size={20} color="#94a3b8" />
                <TextInput value={farmName} onChangeText={setFarmName} className="flex-1 ml-3 text-gray-800 font-medium" />
              </View>
            </View>
          </View>
        </View>

        <View className="mt-8 space-y-4">
          <TouchableOpacity onPress={handleSaveProfile} disabled={saving} className="bg-green-600 py-4 rounded-2xl items-center shadow-lg shadow-green-200">
            <Text className="text-white font-bold text-lg">{saving ? 'Saving...' : 'Update Profile'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDeleteAccount} className="py-4 rounded-2xl items-center border border-red-200 bg-red-50/50">
            <Text className="text-red-500 font-bold">Delete My Account</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}