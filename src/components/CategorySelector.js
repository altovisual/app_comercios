import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { subscribeToStoreCategories } from '../services/categoryService';

export default function CategorySelector({ selectedCategory, onCategoryChange }) {
  const { store } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!store?.id) return;

    const unsubscribe = subscribeToStoreCategories(store.id, (categoriesData) => {
      setCategories(categoriesData);
    });

    return () => unsubscribe();
  }, [store?.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categoría</Text>
      {categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay categorías. Crea una desde el botón de categorías.
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.chip,
                selectedCategory === category.name && styles.chipSelected,
              ]}
              onPress={() => onCategoryChange(category.name)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="pricetag"
                size={16}
                color={
                  selectedCategory === category.name
                    ? COLORS.white
                    : COLORS.primary
                }
              />
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === category.name && styles.chipTextSelected,
                ]}
              >
                {category.name}
              </Text>
              {selectedCategory === category.name && (
                <Ionicons name="checkmark-circle" size={16} color={COLORS.white} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  emptyContainer: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  scrollContent: {
    paddingRight: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  chipTextSelected: {
    color: COLORS.white,
  },
});
