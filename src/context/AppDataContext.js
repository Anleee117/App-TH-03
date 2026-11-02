import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { studentService } from '../api/studentService';
import { courseService } from '../api/courseService';
import { sessionService } from '../api/sessionService';
import { assignmentService } from '../api/assignmentService';
import { gradeService } from '../api/gradeService';
import { getCache, setCache } from '../storage/cache';
import { enqueue, getAll as getOutboxAll } from '../storage/outbox';
import {
  CACHE_STUDENT,
  CACHE_COURSES,
  CACHE_SESSIONS,
  CACHE_ASSIGNMENTS,
  CACHE_GRADES,
} from '../storage/keys';
import useNetworkStatus from '../hooks/useNetworkStatus';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { isOnline } = useNetworkStatus();

  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [pendingIds, setPendingIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const refreshPendingIds = useCallback(async () => {
    const list = await getOutboxAll();
    const ids = [];
    list.forEach(item => {
      if (item.url && item.url.includes('/assignments/')) {
        const parts = item.url.split('/');
        const id = parts[parts.length - 1];
        if (id) {
          ids.push(id.toString());
        }
      }
      if (item.method === 'POST' && item.body && item.body.id) {
        ids.push(item.body.id.toString());
      }
    });
    setPendingIds(ids);
  }, []);

  const loadFromCache = useCallback(async () => {
    const [cStudent, cCourses, cSessions, cAssignments, cGrades] = await Promise.all([
      getCache(CACHE_STUDENT),
      getCache(CACHE_COURSES),
      getCache(CACHE_SESSIONS),
      getCache(CACHE_ASSIGNMENTS),
      getCache(CACHE_GRADES),
    ]);

    if (cStudent && cStudent.data) {
      setStudent(cStudent.data);
      setLastUpdated(cStudent.savedAt);
    }
    if (cCourses && cCourses.data) {
      setCourses(cCourses.data);
    }
    if (cSessions && cSessions.data) {
      setSessions(cSessions.data);
    }
    if (cAssignments && cAssignments.data) {
      setAssignments(cAssignments.data);
    }
    if (cGrades && cGrades.data) {
      setGrades(cGrades.data);
    }
    await refreshPendingIds();
  }, [refreshPendingIds]);

  const loadFromApi = useCallback(async () => {
    try {
      const [resStudent, resCourses, resSessions, resAssignments, resGrades] = await Promise.all([
        studentService.getById(1),
        courseService.getAll(),
        sessionService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll(),
      ]);

      setStudent(resStudent);
      setCourses(resCourses);
      setSessions(resSessions);
      setAssignments(resAssignments);
      setGrades(resGrades);

      await Promise.all([
        setCache(CACHE_STUDENT, resStudent),
        setCache(CACHE_COURSES, resCourses),
        setCache(CACHE_SESSIONS, resSessions),
        setCache(CACHE_ASSIGNMENTS, resAssignments),
        setCache(CACHE_GRADES, resGrades),
      ]);

      const now = new Date().toISOString();
      setLastUpdated(now);
      await refreshPendingIds();
    } catch (err) {
      console.log(err);
    }
  }, [refreshPendingIds]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await loadFromCache();
    await loadFromApi();
    setLoading(false);
  }, [loadFromCache, loadFromApi]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const toggleAssignmentStatus = async (id) => {
    const current = assignments.find(item => item.id.toString() === id.toString());
    if (!current) {
      return;
    }
    const nextStatus = current.status === 'done' ? 'todo' : 'done';
    const nowIso = new Date().toISOString();

    setAssignments(prev =>
      prev.map(item =>
        item.id.toString() === id.toString()
          ? { ...item, status: nextStatus, updatedAt: nowIso }
          : item
      )
    );

    if (!isOnline) {
      await enqueue({
        id: Date.now().toString(),
        method: 'PATCH',
        url: `/assignments/${id}`,
        body: { status: nextStatus, updatedAt: nowIso },
        createdAt: nowIso,
      });
      await refreshPendingIds();
      return;
    }

    try {
      await assignmentService.update(id, {
        status: nextStatus,
        updatedAt: nowIso,
      });
      const updatedList = assignments.map(item =>
        item.id.toString() === id.toString()
          ? { ...item, status: nextStatus, updatedAt: nowIso }
          : item
      );
      await setCache(CACHE_ASSIGNMENTS, updatedList);
    } catch (err) {
      setAssignments(prev =>
        prev.map(item =>
          item.id.toString() === id.toString()
            ? { ...item, status: current.status, updatedAt: current.updatedAt }
            : item
        )
      );
      Alert.alert('Lỗi cập nhật', 'Không thể đổi trạng thái bài tập trên máy chủ');
    }
  };

  const addAssignment = async (newObj) => {
    const nowIso = new Date().toISOString();
    const tempId = Date.now();
    const courseObj = courses.find(c => c.id.toString() === (newObj.courseId || '').toString());

    const itemToSave = {
      ...newObj,
      id: tempId,
      status: 'todo',
      updatedAt: nowIso,
      course: courseObj || null,
    };

    if (!isOnline) {
      setAssignments(prev => [itemToSave, ...prev]);
      await enqueue({
        id: tempId.toString(),
        method: 'POST',
        url: '/assignments',
        body: {
          id: tempId,
          courseId: Number(newObj.courseId),
          title: newObj.title,
          description: newObj.description || '',
          dueDate: newObj.dueDate,
          status: 'todo',
          updatedAt: nowIso,
        },
        createdAt: nowIso,
      });
      await refreshPendingIds();
      return true;
    }

    try {
      const res = await assignmentService.create({
        courseId: Number(newObj.courseId),
        title: newObj.title,
        description: newObj.description || '',
        dueDate: newObj.dueDate,
        status: 'todo',
        updatedAt: nowIso,
      });
      const fullItem = {
        ...res,
        course: courseObj || null,
      };
      setAssignments(prev => [fullItem, ...prev]);
      const nextList = [fullItem, ...assignments];
      await setCache(CACHE_ASSIGNMENTS, nextList);
      return true;
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tạo bài tập mới');
      return false;
    }
  };

  const updateStudent = async (patchData) => {
    const nowIso = new Date().toISOString();
    const updated = {
      ...student,
      ...patchData,
      updatedAt: nowIso,
    };
    setStudent(updated);

    if (!isOnline) {
      await enqueue({
        id: Date.now().toString(),
        method: 'PATCH',
        url: '/students/1',
        body: {
          ...patchData,
          updatedAt: nowIso,
        },
        createdAt: nowIso,
      });
      return true;
    }

    try {
      const res = await studentService.update(1, {
        ...patchData,
        updatedAt: nowIso,
      });
      setStudent(res);
      await setCache(CACHE_STUDENT, res);
      return true;
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin sinh viên');
      return false;
    }
  };

  const todoCount = assignments.filter(item => item.status !== 'done').length;

  return (
    <AppDataContext.Provider
      value={{
        student,
        courses,
        sessions,
        assignments,
        grades,
        pendingIds,
        loading,
        lastUpdated,
        todoCount,
        loadAll,
        toggleAssignmentStatus,
        addAssignment,
        updateStudent,
        refreshPendingIds,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be inside AppDataProvider');
  }
  return context;
}
