import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssignmentListScreen from '../screens/assignments/AssignmentListScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import AssignmentFormScreen from '../screens/assignments/AssignmentFormScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import { ROUTES } from './routes';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function AssignmentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen
        name={ROUTES.ASSIGNMENT_LIST}
        component={AssignmentListScreen}
        options={{ title: 'Bài tập' }}
      />
      <Stack.Screen
        name={ROUTES.ASSIGNMENT_DETAIL}
        component={AssignmentDetailScreen}
        options={{ title: 'Chi tiết bài tập' }}
      />
      <Stack.Screen
        name={ROUTES.ASSIGNMENT_FORM}
        component={AssignmentFormScreen}
        options={{ title: 'Thêm bài tập mới' }}
      />
      <Stack.Screen
        name={ROUTES.COURSE_DETAIL}
        component={CourseDetailScreen}
        options={{ title: 'Chi tiết môn học' }}
      />
    </Stack.Navigator>
  );
}
