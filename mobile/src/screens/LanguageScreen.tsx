import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { Language } from '../types';
import { useSettingsStore } from '../store/settingsStore';
import { setLocale, t } from '../i18n';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Espa\u00f1ol' },
  { code: 'hi', name: 'Hindi', nativeName: '\u0939\u093f\u0928\u094d\u0926\u0940' },
];

export function LanguageScreen() {
  const theme = useTheme();
  const currentLanguage = useSettingsStore((s) => s.language);
  const setLanguageSetting = useSettingsStore((s) => s.setLanguage);

  const handleSelect = async (lang: Language) => {
    await setLanguageSetting(lang);
    setLocale(lang);
  };

  const renderItem = ({ item }: { item: LanguageOption }) => {
    const isSelected = currentLanguage === item.code;

    return (
      <TouchableOpacity
        onPress={() => handleSelect(item.code)}
        style={[
          styles.item,
          {
            backgroundColor: isSelected
              ? theme.colors.primaryFaded
              : 'transparent',
            borderBottomColor: theme.colors.borderLight,
          },
        ]}
        activeOpacity={0.6}
      >
        <View style={styles.itemContent}>
          <Text
            style={[
              styles.name,
              {
                color: isSelected ? theme.colors.primary : theme.colors.text,
                fontWeight: isSelected ? '600' : '400',
              },
            ]}
          >
            {item.name}
          </Text>
          <Text style={[styles.nativeName, { color: theme.colors.textSecondary }]}>
            {item.nativeName}
          </Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={LANGUAGES}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingTop: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
  },
  itemContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
  },
  nativeName: {
    fontSize: 13,
    marginTop: 2,
  },
});
