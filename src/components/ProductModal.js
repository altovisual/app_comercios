import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import { Input, Button } from './';

const EMOJI_OPTIONS = ['🍔', '🍕', '🌮', '🍱', '🥗', '🍟', '🥤', '🍰', '🍜', '🥙', '🌭', '🍗'];

export default function ProductModal({ visible, onClose, onSave, product }) {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '🍔',
    preparationTime: '',
    category: '',
    isAvailable: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        preparationTime: product.preparationTime.toString(),
        category: product.category || '',
        isAvailable: product.isAvailable,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '🍔',
        preparationTime: '',
        category: '',
        isAvailable: true,
      });
    }
  }, [product, visible]);

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      Alert.alert('Error', 'Por favor completa los campos requeridos');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      preparationTime: parseInt(formData.preparationTime) || 15,
    };

    onSave(productData);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />
          
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {product ? 'Editar Producto' : 'Nuevo Producto'}
              </Text>
              <Text style={styles.subtitle}>
                {product ? 'Actualiza la información del producto' : 'Completa los datos del nuevo producto'}
              </Text>
            </View>
          </View>

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Emoji Selector */}
            <Text style={styles.label}>Icono</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.emojiScroll}
            >
              {EMOJI_OPTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiButton,
                    formData.image === emoji && styles.emojiButtonSelected
                  ]}
                  onPress={() => setFormData({ ...formData, image: emoji })}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Input
              label="Nombre *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Ej: Hamburguesa Clásica"
              icon="restaurant-outline"
            />

            <Input
              label="Descripción"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Descripción del producto"
              icon="document-text-outline"
              multiline
              numberOfLines={3}
            />

            <Input
              label="Precio *"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder="0.00"
              icon="cash-outline"
              keyboardType="decimal-pad"
            />

            <Input
              label="Tiempo de preparación (minutos)"
              value={formData.preparationTime}
              onChangeText={(text) => setFormData({ ...formData, preparationTime: text })}
              placeholder="15"
              icon="time-outline"
              keyboardType="number-pad"
            />

            <Input
              label="Categoría"
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
              placeholder="Ej: hamburguesas"
              icon="pricetag-outline"
            />
          </ScrollView>

          {/* Footer */}
          <View style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 20) }
          ]}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Text style={styles.saveButtonText}>
                {product ? 'Actualizar' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  emojiScroll: {
    marginBottom: 20,
  },
  emojiButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  emoji: {
    fontSize: 32,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.background,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
