import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BookOpen, CalendarDays, ClipboardList, LayoutDashboard, LucideIcon, User} from 'lucide-react-native';
import HomeScreen from '../screens/HomeScreen';
import CoursesScreen from '../screens/CoursesScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import AssignmentsScreen from '../screens/AssignmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import SessionDetailScreen from '../screens/SessionDetailScreen';
import AssignmentDetailScreen from '../screens/AssignmentDetailScreen';
import ResultDetailScreen from '../screens/ResultDetailScreen';
import {RootStackParamList, TabParamList} from './types';
import {colors} from '../theme';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const tabIcons: Record<keyof TabParamList, LucideIcon> = {
  Home: LayoutDashboard,
  Courses: BookOpen,
  Schedule: CalendarDays,
  Assignments: ClipboardList,
  Profile: User,
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subText,
        headerStyle: {backgroundColor: colors.primary},
        headerTintColor: '#FFFFFF',
        tabBarIcon: ({color, size}) => {
          const TabIcon = tabIcons[route.name];
          return <TabIcon size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{title: 'Tổng quan'}} />
      <Tab.Screen name="Courses" component={CoursesScreen} options={{title: 'Môn học'}} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} options={{title: 'Thời khóa biểu', tabBarLabel: 'TKB'}} />
      <Tab.Screen name="Assignments" component={AssignmentsScreen} options={{title: 'Bài tập'}} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{title: 'Cá nhân'}} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.primary},
        headerTintColor: '#FFFFFF',
      }}>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{headerShown: false}} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{title: 'Chi tiết môn học'}} />
      <Stack.Screen name="SessionDetail" component={SessionDetailScreen} options={{title: 'Chi tiết buổi học'}} />
      <Stack.Screen name="AssignmentDetail" component={AssignmentDetailScreen} options={{title: 'Chi tiết bài tập'}} />
      <Stack.Screen name="ResultDetail" component={ResultDetailScreen} options={{title: 'Chi tiết kết quả học tập'}} />
    </Stack.Navigator>
  );
}
