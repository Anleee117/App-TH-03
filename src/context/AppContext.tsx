import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Assignment, Student} from '../data/types';
import {initialAssignments, initialStudent} from '../data/mockData';
import {colors} from '../theme';

const STUDENT_KEY = 'study_student';
const ASSIGNMENT_KEY = 'study_assignments';

type EditableStudent = Pick<Student, 'fullName' | 'email' | 'phone'>;

type AppContextValue = {
  student: Student;
  assignments: Assignment[];
  updateStudent: (data: EditableStudent) => void;
  toggleAssignment: (id: string) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({children}: {children: ReactNode}) {
  const [student, setStudent] = useState<Student>(initialStudent);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [savedStudent, savedAssignments] = await Promise.all([
          AsyncStorage.getItem(STUDENT_KEY),
          AsyncStorage.getItem(ASSIGNMENT_KEY),
        ]);
        if (savedStudent) {
          setStudent(JSON.parse(savedStudent));
        }
        if (savedAssignments) {
          setAssignments(JSON.parse(savedAssignments));
        }
      } catch (error) {
        setStudent(initialStudent);
        setAssignments(initialAssignments);
      }
      setLoaded(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STUDENT_KEY, JSON.stringify(student));
    }
  }, [student, loaded]);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(ASSIGNMENT_KEY, JSON.stringify(assignments));
    }
  }, [assignments, loaded]);

  const updateStudent = (data: EditableStudent) => {
    setStudent(prev => ({...prev, ...data}));
  };

  const toggleAssignment = (id: string) => {
    setAssignments(prev =>
      prev.map(item => (item.id === id ? {...item, completed: !item.completed} : item)),
    );
  };

  if (!loaded) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background}}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <AppContext.Provider value={{student, assignments, updateStudent, toggleAssignment}}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
