import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ClipboardList,
  User,
} from 'lucide-react-native';
import HomeStack from './HomeStack';
import CourseStack from './CourseStack';
import ScheduleStack from './ScheduleStack';
import AssignmentStack from './AssignmentStack';
import ProfileStack from './ProfileStack';
import { ROUTES } from './routes';
import { useAppData } from '../context/AppDataContext';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { todoCount } = useAppData();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME_TAB}
        component={HomeStack}
        options={{
          tabBarLabel: 'Tổng quan',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.COURSES_TAB}
        component={CourseStack}
        options={{
          tabBarLabel: 'Môn học',
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.SCHEDULE_TAB}
        component={ScheduleStack}
        options={{
          tabBarLabel: 'TKB',
          tabBarIcon: ({ color, size }) => (
            <CalendarDays color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.ASSIGNMENTS_TAB}
        component={AssignmentStack}
        options={{
          tabBarLabel: 'Bài tập',
          tabBarBadge: todoCount > 0 ? todoCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <ClipboardList color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE_TAB}
        component={ProfileStack}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
