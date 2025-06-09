import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { RootTabParamList } from './types';

import HomeScreen from '../screens/HomeScreen';
import ZonesScreen from '../screens/ZonesScreen';
import RelatesScreen from '../screens/RelatesScreen'; 
import MonitoringScreen from '../screens/MonitoringScreen'; 
import AlertsScreen from '../screens/AlertsScreen';

import { colors } from '../styles/colors';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = 'dashboard';
              break;
            case 'Zonas':
              iconName = 'location-on';
              break;
            case 'Relatos':
              iconName = 'report';
              break;
            case 'Monitoramento':
              iconName = 'sensors';
              break;
            case 'Alertas':
              iconName = 'warning';
              break;
            default:
              iconName = 'help';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: colors.primary,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'IdeaTec' }}
      />
      <Tab.Screen 
        name="Zonas" 
        component={ZonesScreen}
        options={{ title: 'Zonas de Risco' }}
      />
      <Tab.Screen 
        name="Relatos" 
        component={RelatesScreen}
        options={{ title: 'Relatos' }}
      />
      <Tab.Screen 
        name="Monitoramento" 
        component={MonitoringScreen}
        options={{ title: 'Monitoramento' }}
      />
      <Tab.Screen 
        name="Alertas" 
        component={AlertsScreen}
        options={{ title: 'Alertas' }}
      />
    </Tab.Navigator>
  );
}
