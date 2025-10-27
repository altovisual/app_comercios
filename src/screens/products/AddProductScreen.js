import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { addProduct, uploadProductImage } from '../../services/productService';

export default function AddProductScreen({ navigation }) {
  const { store } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
    image: null,
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permiso necesario',
        'Necesitamos acceso a tus fotos para agregar imágenes de productos'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permiso necesario',
        'Necesitamos acceso a tu cámara para tomar fotos de productos'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Agregar Imagen',
      'Selecciona una opción',
      [
        { text: 'Tomar Foto', onPress: takePhoto },
        { text: 'Elegir de Galería', onPress: pickImage },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre del producto es obligatorio');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert('Error', 'El precio debe ser mayor a 0');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;

      // Subir imagen si existe
      if (formData.image) {
        const uploadResult = await uploadProductImage(formData.image, store.id);
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
        }
      }

      // Crear producto
      const productData = {
        storeId: store.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim() || 'General',
        available: formData.available,
        image: imageUrl,
      };

      const result = await addProduct(productData);

      if (result.success) {
        Alert.alert(
          '¡Éxito!',
          'Producto agregado correctamente',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'No se pudo agregar el producto');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Ocurrió un error al agregar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Producto</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagen del producto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imagen del Producto</Text>
          <TouchableOpacity
            style={styles.imageUpload}
            onPress={showImageOptions}
            activeOpacity={0.7}
          >
            {formData.image ? (
              <Image
                source={{ uri: formData.image }}
                style={styles.uploadedImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={40} color={COLORS.textLight} />
                <Text style={styles.imagePlaceholderText}>
                  Toca para agregar foto
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Nombre */}
        <View style={styles.section}>
          <Text style={styles.label}>Nombre del Producto *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Hamburguesa Clásica"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe tu producto..."
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Precio */}
        <View style={styles.section}>
          <Text style={styles.label}>Precio *</Text>
          <View style={styles.priceInput}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.priceValue}
              placeholder="0.00"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Categoría */}
        <View style={styles.section}>
          <Text style={styles.label}>Categoría</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Hamburguesas, Bebidas, Postres"
            value={formData.category}
            onChangeText={(text) => setFormData({ ...formData, category: text })}
          />
        </View>

        {/* Disponibilidad */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.availabilityToggle}
            onPress={() => setFormData({ ...formData, available: !formData.available })}
            activeOpacity={0.7}
          >
            <View style={styles.availabilityInfo}>
              <Text style={styles.availabilityLabel}>Producto Disponible</Text>
              <Text style={styles.availabilityHint}>
                {formData.available
                  ? 'Los clientes pueden ordenar este producto'
                  : 'Este producto no estará visible para los clientes'}
              </Text>
            </View>
            <View style={[
              styles.toggle,
              formData.available && styles.toggleActive
            ]}>
              <View style={[
                styles.toggleThumb,
                formData.available && styles.toggleThumbActive
              ]} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer con botones */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
              <Text style={styles.saveButtonText}>Guardar Producto</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerRight: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  imageUpload: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    borderStyle: 'dashed',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textLight,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 8,
  },
  priceValue: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    paddingVertical: 12,
  },
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  availabilityInfo: {
    flex: 1,
    marginRight: 16,
  },
  availabilityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  availabilityHint: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.borderLight,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.success,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});
