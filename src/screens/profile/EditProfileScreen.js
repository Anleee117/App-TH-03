import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { validateEmail, validatePhone } from '../../utils/validators';
import spacing from '../../theme/spacing';

export default function EditProfileScreen({ navigation }) {
  const { student, updateStudent } = useAppData();

  const [name, setName] = useState(student?.fullName || '');
  const [email, setEmail] = useState(student?.email || '');
  const [phone, setPhone] = useState(student?.phone || '');

  const [nameErr, setNameErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    let hasErr = false;

    if (!name.trim()) {
      setNameErr('Họ và tên không được để trống');
      hasErr = true;
    } else {
      setNameErr('');
    }

    if (!validateEmail(email)) {
      setEmailErr('Email không hợp lệ');
      hasErr = true;
    } else {
      setEmailErr('');
    }

    if (!validatePhone(phone)) {
      setPhoneErr('Số điện thoại phải từ 9 đến 11 số');
      hasErr = true;
    } else {
      setPhoneErr('');
    }

    if (hasErr) {
      return;
    }

    setLoading(true);
    const ok = await updateStudent({
      fullName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    setLoading(false);

    if (ok) {
      Alert.alert('Thành công', 'Đã lưu thay đổi thông tin');
      navigation.goBack();
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.form}>
        <FormInput
          label="Họ và tên (*)"
          value={name}
          onChangeText={(val) => {
            setName(val);
            if (nameErr) {
              setNameErr('');
            }
          }}
          error={nameErr}
        />

        <FormInput
          label="Email (*)"
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            if (emailErr) {
              setEmailErr('');
            }
          }}
          keyboardType="email-address"
          error={emailErr}
        />

        <FormInput
          label="Số điện thoại (*)"
          value={phone}
          onChangeText={(val) => {
            setPhone(val);
            if (phoneErr) {
              setPhoneErr('');
            }
          }}
          keyboardType="phone-pad"
          error={phoneErr}
        />

        <View style={styles.btnWrap}>
          <AppButton
            title="Lưu thông tin"
            variant="primary"
            loading={loading}
            onPress={handleSave}
          />
          <View style={styles.spacer} />
          <AppButton
            title="Hủy"
            variant="outline"
            disabled={loading}
            onPress={() => navigation.goBack()}
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
  btnWrap: {
    marginTop: spacing.lg,
  },
  spacer: {
    height: spacing.sm,
  },
});
