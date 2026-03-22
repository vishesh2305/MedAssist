import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme';
import { useSettingsStore } from '../../store/settingsStore';
import { t } from '../../i18n';

interface ChatInputProps {
  onSend: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, onTyping, disabled = false }: ChatInputProps) {
  const theme = useTheme();
  const hapticEnabled = useSettingsStore((s) => s.hapticEnabled);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      if (hapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onSend(message.trim());
      setMessage('');
      onTyping?.(false);
    }
  };

  const handleChangeText = (text: string) => {
    setMessage(text);
    onTyping?.(text.length > 0);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: theme.colors.inputBorder,
          },
        ]}
      >
        <TextInput
          value={message}
          onChangeText={handleChangeText}
          placeholder={t('chat.typeMessage')}
          placeholderTextColor={theme.colors.inputPlaceholder}
          style={[styles.input, { color: theme.colors.text }]}
          multiline
          maxLength={1000}
          editable={!disabled}
        />
      </View>
      <TouchableOpacity
        onPress={handleSend}
        disabled={!message.trim() || disabled}
        style={[
          styles.sendButton,
          {
            backgroundColor: message.trim()
              ? theme.colors.primary
              : theme.colors.backgroundTertiary,
          },
        ]}
      >
        <Ionicons
          name="send"
          size={18}
          color={message.trim() ? '#FFFFFF' : theme.colors.textTertiary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    maxHeight: 100,
  },
  input: {
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
