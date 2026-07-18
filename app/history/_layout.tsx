import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#15803d" },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="EditEntryScreen" 
        options={{ 
          title: "Edit Entires"
        }} 
      />
    </Stack>
  );
}