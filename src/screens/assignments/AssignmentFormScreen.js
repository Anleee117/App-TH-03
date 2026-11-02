import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { validateTitle, validateDueDate } from '../../utils/validators';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AssignmentFormScreen({ navigation }) {
  const { courses, addAssignment } = useAppData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState(
    courses.length > 0 ? courses[0].id.toString() : '1'
  );
  const [dueDate, setDueDate] = useState('2026-11-20');
  const [titleErr, setTitleErr] = useState('');
  const [dateErr, setDateErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    let hasErr = false;
    if (!validateTitle(title)) {
      setTitleErr('Tiêu đề không được để trống');
      hasErr = true;
    } else {
      setTitleErr('');
    }

    if (!validateDueDate(dueDate)) {
      setDateErr('Hạn nộp không được ở quá khứ (định dạng YYYY-MM-DD)');
      hasErr = true;
    } else {
      setDateErr('');
    }

    if (hasErr) {
      return;
    }

    setLoading(true);
    const ok = await addAssignment({
      title: title.trim(),
      description: description.trim(),
      courseId,
      dueDate: new Date(dueDate).toISOString(),
    });
    setLoading(false);

    if (ok) {
      Alert.alert('Thành công', 'Đã thêm bài tập mới');
      navigation.goBack();
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Chọn môn học:</Text>
        <View style={styles.courseSelect}>
          {courses.map((c) => {
            const isSelected = courseId.toString() === c.id.toString();
            return (
              <TouchableOpacity
                key={c.id.toString()}
                style={[styles.courseChip, isSelected && styles.courseChipSelected]}
                onPress={() => setCourseId(c.id.toString())}
                accessibilityLabel={`Chọn môn ${c.name}`}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.courseChipText,
                    isSelected && styles.courseChipTextSelected,
                  ]}
                >
                  {c.code}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FormInput
          label="Tiêu đề bài tập (*)"
          value={title}
          onChangeText={(val) => {
            setTitle(val);
            if (titleErr) {
              setTitleErr('');
            }
          }}
          error={titleErr}
        />

        <FormInput
          label="Mô tả chi tiết"
          value={description}
          onChangeText={setDescription}
        />

        <FormInput
          label="Hạn nộp (* YYYY-MM-DD)"
          value={dueDate}
          onChangeText={(val) => {
            setDueDate(val);
            if (dateErr) {
              setDateErr('');
            }
          }}
          error={dateErr}
        />

        <View style={styles.btnWrap}>
          <AppButton
            title="Lưu bài tập"
            variant="primary"
            loading={loading}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  courseSelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  courseChip: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  courseChipText: {
    ...typography.captionBold,
    color: colors.text,
  },
  courseChipTextSelected: {
    color: colors.white,
  },
  btnWrap: {
    marginTop: spacing.lg,
  },
});
