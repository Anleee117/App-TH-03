import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import { ROUTES } from './routes';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function ScheduleStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen
        name={ROUTES.SCHEDULE}
        component={ScheduleScreen}
        options={{ title: 'Thời khóa biểu' }}
      />
      <Stack.Screen
        name={ROUTES.SESSION_DETAIL}
        component={SessionDetailScreen}
        options={{ title: 'Chi tiết buổi học' }}
      />
      <Stack.Screen
        name={ROUTES.COURSE_DETAIL}
        component={CourseDetailScreen}
        options={{ title: 'Chi tiết môn học' }}
      />
    </Stack.Navigator>
  );
}
