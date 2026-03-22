import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { t } from '../../i18n';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  onResend: () => void;
  resendCooldown?: number;
}

export function OTPInput({
  length = 6,
  onComplete,
  onResend,
  resendCooldown = 60,
}: OTPInputProps) {
  const theme = useTheme();
  const [code, setCode] = useState<string[]>(new Array(length).fill(''));
  const [countdown, setCountdown] = useState(resendCooldown);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      const fullCode = newCode.join('');
      if (fullCode.length === length) {
        onComplete(fullCode);
      }
    },
    [code, length, onComplete]
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === 'Backspace' && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
      }
    },
    [code]
  );

  const handleResend = () => {
    if (canResend) {
      onResend();
      setCountdown(resendCooldown);
      setCanResend(false);
      setCode(new Array(length).fill(''));
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text) => handleChange(text.slice(-1), index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="number-pad"
            maxLength={1}
            style={[
              styles.input,
              {
                color: theme.colors.text,
                backgroundColor: theme.colors.inputBackground,
                borderColor: digit
                  ? theme.colors.primary
                  : theme.colors.inputBorder,
              },
            ]}
            autoFocus={index === 0}
            selectTextOnFocus
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={handleResend}
        disabled={!canResend}
        style={styles.resendButton}
      >
        <Text
          style={[
            styles.resendText,
            {
              color: canResend ? theme.colors.primary : theme.colors.textTertiary,
            },
          ]}
        >
          {canResend
            ? t('auth.resendCode')
            : t('auth.resendIn', { seconds: countdown })}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  input: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  resendButton: {
    marginTop: 24,
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
