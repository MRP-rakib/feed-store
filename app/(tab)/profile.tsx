import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  RefreshControl
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { router, Href } from 'expo-router';
import { supabase } from '../../lib/supabase';


interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  isLogout?: boolean;
  path?: Href;
}


export default function ProfileScreen() {

  const [fullName, setFullName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);



  const menuItems: MenuItem[] = [

    {
      id: '1',
      title: 'Edit Profile',
      icon: 'account-outline',
      path: '/profile/edit-profile',
    },

    {
      id: '2',
      title: 'Change Password',
      icon: 'lock-outline',
      path: '/profile/change-password',
    },

    {
      id: '3',
      title: 'Category Management',
      icon: 'clipboard-text-outline',
      path: '/profile/category',
    },

    {
      id: '4',
      title: 'Logout',
      icon: 'logout',
      isLogout: true,
    },

  ];




  const loadProfile = async () => {

    try {

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {

        router.replace('/login');
        return;

      }
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, farm_name, avatar')
        .eq('user_id', user.id)
        .single();
      if (error) {

        console.log(error.message);
        return;

      }
      setFullName(
        data.full_name || 'User'
      );


      setFarmName(
        data.farm_name || ''
      );
      setAvatar(
        data.avatar || null
      );

    } catch (error) {
    console.log(error);

    } finally {
      setLoading(false);
    }

  };
  useEffect(() => {

   loadProfile();

  }, []);
  const onRefresh = async () => {

  setRefreshing(true);

    await loadProfile();

    setRefreshing(false);

  };

  const handleLogout = () => {

    Alert.alert(

      'Logout',

      'Are you sure you want to logout?',

      [

        {
          text: 'Cancel',
          style: 'cancel',
        },


        {
          text: 'Logout',

          onPress: async () => {
            const { error } =
              await supabase.auth.signOut({
                scope: 'local',
              });

            if (error) {
              Alert.alert(
                'Error',
                error.message
              );

              return;

            }
            router.replace('/login');
          },
        },
      ]
    );

  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator
          size="large"
          color="#16a34a"
        />
      </View>

    );

  }
  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[
            '#16a34a'
          ]}
        />
      }
    >
      <View className="flex-row items-center px-6 py-8 border-b border-gray-100">
       <View className="w-16 h-16 rounded-full bg-gray-100 justify-center items-center mr-4 overflow-hidden">
          {
            avatar ? (
              <Image
                source={{
                  uri: avatar
                }}

                className="w-full h-full"
              />

            ) : (
              <Text className="text-2xl font-bold text-gray-500">
                {
                  fullName
                    ? fullName
                      .charAt(0)
                      .toUpperCase()
                    : 'U'
                }
              </Text>
            )
          }
        </View>
       <View>
          <Text className="text-xl font-bold text-gray-900 capitalize w-full">
           {fullName}
          </Text>
          <Text className="text-sm text-gray-400 font-medium mt-0.5">
            Owner
          </Text>
          <Text className="text-sm text-gray-400 font-medium capitalize">
            {farmName}
          </Text>
        </View>

      </View>
      <View className="px-4 py-4">

        {
          menuItems.map((item) => (

         <TouchableOpacity
              key={item.id}
              className="flex-row items-center justify-between py-4 px-2 mb-1 rounded-xl"
              onPress={() => {
                if (item.isLogout) {
                  handleLogout();
                } else if (item.path) {
                  router.push(item.path);
                }
              }}
            >
              <View className="flex-row items-center">
                <View className="w-6 items-center mr-4">
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={22}
                    color={
                      item.isLogout
                        ? '#EF4444'
                        : '#4B5563'
                    }
                  />
                </View>
                <Text

                  className={`text-base font-medium ${item.isLogout
                      ? 'text-red-500 font-semibold'
                      : 'text-gray-800'
                    }`}

                >

                  {item.title}

                </Text>
              </View>
              {
                !item.isLogout && (
                  <Feather

                    name="chevron-right"

                    size={18}

                    color="#9CA3AF"

                  />
                )
              }

            </TouchableOpacity>
          ))
        }
      </View>
    </ScrollView>

  );

}