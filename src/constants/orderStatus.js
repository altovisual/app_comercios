export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PREPARING: 'preparing',
  READY: 'ready',
  IN_DELIVERY: 'in_delivery',
  PICKED_UP: 'picked_up',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pendiente',
  [ORDER_STATUS.ACCEPTED]: 'Aceptado',
  [ORDER_STATUS.PREPARING]: 'En Preparación',
  [ORDER_STATUS.READY]: 'Listo',
  [ORDER_STATUS.IN_DELIVERY]: 'En Camino',
  [ORDER_STATUS.PICKED_UP]: 'Recogido',
  [ORDER_STATUS.DELIVERED]: 'Entregado',
  [ORDER_STATUS.CANCELLED]: 'Cancelado',
};

export const ORDER_STATUS_ICONS = {
  [ORDER_STATUS.PENDING]: 'time-outline',
  [ORDER_STATUS.ACCEPTED]: 'checkmark-circle-outline',
  [ORDER_STATUS.PREPARING]: 'restaurant-outline',
  [ORDER_STATUS.READY]: 'checkmark-done-outline',
  [ORDER_STATUS.IN_DELIVERY]: 'bicycle-outline',
  [ORDER_STATUS.PICKED_UP]: 'bicycle-outline',
  [ORDER_STATUS.DELIVERED]: 'checkmark-done-circle',
  [ORDER_STATUS.CANCELLED]: 'close-circle-outline',
};
