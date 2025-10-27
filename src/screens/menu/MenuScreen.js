import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { useStore } from '../../context/StoreContext';
import { getDeviceType } from '../../utils/responsive';
import { Card, Button, EmptyState, ProductModal } from '../../components';

export default function MenuScreen() {
  const { products, loadMockProducts, toggleProductAvailability, addProduct, updateProduct, deleteProduct } = useStore();
  const [deviceType, setDeviceType] = useState(getDeviceType());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (products.length === 0) {
      loadMockProducts();
    }
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDeviceType(getDeviceType());
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = deviceType === 'desktop';
  const numColumns = isDesktop ? 2 : 1;

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalVisible(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleSaveProduct = (productData) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, productData);
    } else {
      addProduct(productData);
    }
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro que deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => deleteProduct(productId)
        },
      ]
    );
  };

  const renderProduct = ({ item }) => (
    <Card style={[styles.productCard, numColumns > 1 && styles.productCardGrid]} noPadding>
      {/* Product Image/Emoji Header */}
      <View style={[styles.productImageHeader, !item.isAvailable && styles.productImageHeaderDisabled]}>
        <Text style={styles.productEmoji}>{item.image}</Text>
        {!item.isAvailable && (
          <View style={styles.unavailableBadge}>
            <Ionicons name="close-circle" size={16} color={COLORS.white} />
            <Text style={styles.unavailableText}>No disponible</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <View style={styles.productMainInfo}>
          <View style={styles.productTitleSection}>
            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.productDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            {item.preparationTime && (
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={12} color={COLORS.textLight} />
                <Text style={styles.timeText}>{item.preparationTime} min</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Product Footer */}
        <View style={styles.productFooter}>
          <View style={styles.availabilitySection}>
            <Switch
              value={item.isAvailable}
              onValueChange={() => toggleProductAvailability(item.id)}
              trackColor={{ false: COLORS.border, true: COLORS.success }}
              thumbColor={COLORS.white}
              ios_backgroundColor={COLORS.border}
            />
            <Text style={styles.availabilityLabel}>
              {item.isAvailable ? 'Disponible' : 'No disponible'}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => handleEditProduct(item)}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteProduct(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.contentWrapper, isDesktop && styles.contentWrapperDesktop]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Menú</Text>
            <Text style={styles.subtitle}>{products.length} producto{products.length !== 1 ? 's' : ''}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddProduct}
          >
            <Ionicons name="add" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Products List */}
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          key={numColumns}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
          ListEmptyComponent={
            <EmptyState
              icon="restaurant-outline"
              title="No hay productos"
              description="Agrega productos a tu menú para que los clientes puedan hacer pedidos"
              actionLabel="Agregar Producto"
              onAction={handleAddProduct}
            />
          }
        />
      </View>

      <ProductModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentWrapper: {
    flex: 1,
  },
  contentWrapperDesktop: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  list: {
    padding: 20,
    paddingTop: 0,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16,
  },
  productCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  productCardGrid: {
    flex: 1,
  },
  productImageHeader: {
    height: 120,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productImageHeaderDisabled: {
    backgroundColor: COLORS.border + '40',
  },
  productEmoji: {
    fontSize: 56,
  },
  unavailableBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  unavailableText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
  },
  productInfo: {
    padding: 16,
  },
  productMainInfo: {
    marginBottom: 16,
  },
  productTitleSection: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  availabilitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  availabilityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.danger + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
