import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HospitalStackParamList } from '../types';
import { HospitalListScreen } from '../screens/HospitalListScreen';
import { HospitalDetailScreen } from '../screens/HospitalDetailScreen';
import { useTheme } from '../theme';

const Stack = createStackNavigator<HospitalStackParamList>();

export function HospitalNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="HospitalList" component={HospitalListScreen} />
      <Stack.Screen name="HospitalDetail" component={HospitalDetailScreen} />
    </Stack.Navigator>
  );
}
