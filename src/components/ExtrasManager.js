import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

export default function ExtrasManager({ extras = [], onExtrasChange }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExtra, setEditingExtra] = useState(null);
  const [extraData, setExtraData] = useState({
    name: '',
    price: '',
    required: false,
  });

  const handleAddExtra = () => {
    setEditingExtra(null);
    setExtraData({ name: '', price: '', required: false });
    setModalVisible(true);
  };

  const handleEditExtra = (extra, index) => {
    setEditingExtra(index);
    setExtraData(extra);
    setModalVisible(true);
  };

  const handleSaveExtra = () => {
    if (!extraData.name.trim()) {
      Alert.alert('Error', 'El nombre del extra es obligatorio');
      return;
    }

    if (!extraData.price || parseFloat(extraData.price) < 0) {
      Alert.alert('Error', 'El precio debe ser mayor o igual a 0');
      return;
    }

    const newExtra = {
      id: editingExtra !== null ? extraData.id : `extra_${Date.now()}`,
      name: extraData.name.trim(),
      price: parseFloat(extraData.price),
      required: extraData.required,
    };

    let updatedExtras;
    if (editingExtra !== null) {
      // Editar
      updatedExtras = [...extras];
      updatedExtras[editingExtra] = newExtra;
    } else {
      // Agregar
      updatedExtras = [...extras, newExtra];
    }

    onExtrasChange(updatedExtras);
    setModalVisible(false);
  };

  const handleDeleteExtra = (index) => {
    Alert.alert(
      'Eliminar Extra',
      '¿Estás seguro de eliminar este extra?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const updatedExtras = extras.filter((_, i) => i !== index);
            onExtrasChange(updatedExtras);
          },
        },
      ]
    );
  };

  const renderExtra = ({ item, index }) => (
    <View style={styles.extraCard}>
      <View style={styles.extraInfo}>
        <View style={styles.extraHeader}>
          <Text style={styles.extraName}>{item.name}</Text>
          {item.required && (
            <View style={styles.requiredBadge}>
              <Text style={styles.requiredText}>Obligatorio</Text>
            </View>
          )}
        </View>
        <Text style={styles.extraPrice}>
          {item.price === 0 ? 'Gratis' : `+$${item.price.toFixed(2)}`}
        </Text>
      </View>
      <View style={styles.extraActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditExtra(item, index)}
        >
          <Ionicons name="pencil" size={18} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteExtra(index)}
        >
          <Ionicons name="trash" size={18} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Extras y Modificadores</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddExtra}>
          <Ionicons name="add-circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {extras.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay extras agregados. Los extras permiten a los clientes personalizar el producto.
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleAddExtra}>
            <Ionicons name="add" size={20} color={COLORS.white} />
            <Text style={styles.emptyButtonText}>Agregar Extra</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={extras}
          renderItem={renderExtra}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
        />
      )}

      {/* Modal para agregar/editar extra */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {editingExtra !== null ? 'Editar Extra' : 'Nuevo Extra'}
                </Text>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <Text style={styles.label}>Nombre del Extra *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: Queso extra, Bacon, Aguacate"
                    value={extraData.name}
                    onChangeText={(text) => setExtraData({ ...extraData, name: text })}
                    returnKeyType="next"
                  />

                  <Text style={styles.label}>Precio Adicional *</Text>
                  <View style={styles.priceInput}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      style={styles.priceValue}
                      placeholder="0.00"
                      value={extraData.price}
                      onChangeText={(text) => setExtraData({ ...extraData, price: text })}
                      keyboardType="decimal-pad"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </View>
                  <Text style={styles.hint}>Usa 0 si el extra es gratis</Text>

                  <TouchableOpacity
                    style={styles.requiredToggle}
                    onPress={() =>
                      setExtraData({ ...extraData, required: !extraData.required })
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.requiredInfo}>
                      <Text style={styles.requiredLabel}>Extra Obligatorio</Text>
                      <Text style={styles.requiredHint}>
                        El cliente debe seleccionar este extra
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.toggle,
                        extraData.required && styles.toggleActive,
                      ]}
                    >
                      <View
                        style={[
                          styles.toggleThumb,
                          extraData.required && styles.toggleThumbActive,
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                </ScrollView>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      Keyboard.dismiss();
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => {
                      Keyboard.dismiss();
                      handleSaveExtra();
                    }}
                  >
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  addButton: {
    padding: 4,
  },
  emptyContainer: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  extraCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  extraInfo: {
    flex: 1,
  },
  extraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  extraName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
  },
  requiredBadge: {
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  requiredText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.warning,
  },
  extraPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  extraActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 8,
  },
  priceValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    paddingVertical: 12,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  requiredToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  requiredInfo: {
    flex: 1,
    marginRight: 12,
  },
  requiredLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  requiredHint: {
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
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
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
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});
