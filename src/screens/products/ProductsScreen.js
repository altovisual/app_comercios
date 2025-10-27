import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components';
import { 
  subscribeToStoreProducts, 
  deleteProduct 
} from '../../services/productService';

export default function ProductsScreen({ navigation }) {
  const { store } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!store?.id) return;

    const unsubscribe = subscribeToStoreProducts(store.id, (productsData) => {
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [store?.id]);

  const handleDeleteProduct = (productId, productName) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de eliminar "${productName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteProduct(productId);
            if (result.success) {
              Alert.alert('Éxito', 'Producto eliminado correctamente');
            } else {
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          },
        },
      ]
    );
  };

  const renderProduct = ({ item }) => (
    <Card style={styles.productCard}>
      <TouchableOpacity
        style={styles.productContent}
        onPress={() => navigation.navigate('EditProduct', { productId: item.id })}
        activeOpacity={0.7}
      >
        {/* Imagen del producto */}
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={40} color={COLORS.textLight} />
            </View>
          )}
        </View>

        {/* Información del producto */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          {item.description && (
            <Text style={styles.productDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.productMeta}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: item.available ? COLORS.success + '20' : COLORS.danger + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: item.available ? COLORS.success : COLORS.danger }
                ]}>
                  {item.available ? 'Disponible' : 'No disponible'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditProduct', { productId: item.id })}
          >
            <Ionicons name="pencil" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteProduct(item.id, item.name)}
          >
            <Ionicons name="trash" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Productos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Lista de productos */}
      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="basket-outline" size={80} color={COLORS.textLight} />
          <Text style={styles.emptyTitle}>No hay productos</Text>
          <Text style={styles.emptyText}>
            Agrega tu primer producto para empezar a vender
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('AddProduct')}
          >
            <Ionicons name="add-circle" size={20} color={COLORS.white} />
            <Text style={styles.emptyButtonText}>Agregar Producto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  listContent: {
    padding: 16,
  },
  productCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  productContent: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    justifyContent: 'space-around',
    marginLeft: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});
