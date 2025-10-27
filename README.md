# 🏪 MotoTaxi - App de Comercios

Aplicación móvil para que restaurantes, farmacias y supermercados gestionen sus pedidos de delivery en tiempo real.

## 🎯 Características

- 📦 **Gestión de Pedidos**: Recibe y gestiona pedidos en tiempo real
- 🍔 **Administración de Menú**: Agrega, edita y controla disponibilidad de productos
- 📊 **Estadísticas**: Dashboard con métricas de ventas y rendimiento
- 🔔 **Notificaciones**: Alertas instantáneas de nuevos pedidos
- ⚙️ **Configuración**: Horarios, zonas de entrega y ajustes del comercio
- 🔐 **Autenticación**: Login seguro para comercios

## 📱 Pantallas Principales

### Autenticación
- Login
- Registro de comercio

### Dashboard
- Vista general de pedidos activos
- Estadísticas del día
- Acciones rápidas

### Gestión de Pedidos
- Lista de pedidos (filtros por estado)
- Detalle de pedido
- Acciones: Aceptar, Preparar, Marcar listo

### Menú
- Lista de productos
- Agregar/Editar productos
- Control de disponibilidad

### Estadísticas
- Ventas por período
- Productos más vendidos
- Gráficos y métricas

### Configuración
- Perfil del comercio
- Horarios de operación
- Métodos de pago
- Notificaciones

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar la aplicación
npm start

# Para Android
npm run android

# Para iOS
npm run ios
```

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- Expo CLI
- Expo Go app en tu dispositivo móvil
- Cuenta de Firebase

## ⚙️ Configuración

### 1. Firebase

Edita `src/config/firebase.js` con tus credenciales de Firebase:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 2. Estructura de Firebase

Crea las siguientes colecciones en Firestore:

- `stores` - Información de comercios
- `products` - Productos del menú
- `orders` - Pedidos de clientes

## 🏗️ Estructura del Proyecto

```
merchant-app/
├── src/
│   ├── screens/          # Pantallas de la aplicación
│   │   ├── auth/         # Login, Register
│   │   ├── home/         # Dashboard principal
│   │   ├── orders/       # Gestión de pedidos
│   │   ├── menu/         # Gestión de menú
│   │   ├── stats/        # Estadísticas
│   │   └── settings/     # Configuración
│   ├── components/       # Componentes reutilizables
│   ├── navigation/       # Configuración de navegación
│   ├── context/          # Context API (Auth, Orders, Store)
│   ├── config/           # Configuración de Firebase
│   ├── constants/        # Constantes (colores, estados)
│   └── utils/            # Utilidades
├── assets/               # Imágenes y recursos
├── App.js               # Punto de entrada
└── package.json         # Dependencias
```

## 🎨 Tecnologías

- **React Native** con Expo
- **React Navigation** (Stack + Bottom Tabs)
- **Firebase** (Firestore, Auth, Storage)
- **Context API** para estado global
- **AsyncStorage** para persistencia local
- **Expo Notifications** para notificaciones push

## 📊 Estados de Pedidos

- 🟡 **Pending** - Nuevo pedido
- 🔵 **Accepted** - Aceptado por el comercio
- 🟠 **Preparing** - En preparación
- 🟢 **Ready** - Listo para recoger
- 🟣 **Picked Up** - Repartidor lo recogió
- ✅ **Delivered** - Entregado
- ❌ **Cancelled** - Cancelado

## 🔄 Flujo de Trabajo

1. **Cliente hace pedido** → Notificación al comercio
2. **Comercio acepta** → Busca repartidor
3. **Comercio prepara** → Cliente ve progreso
4. **Comercio marca listo** → Repartidor recoge
5. **Repartidor entrega** → Pedido completado

## 🧪 Modo de Prueba

La app incluye datos de prueba (mock data) para desarrollo:

- Usuario de prueba: cualquier email
- Pedidos de ejemplo precargados
- Productos de ejemplo en el menú

## 📱 Integración con Otras Apps

Esta app se integra con:
- **App Cliente** (Transport-Delivery) - Recibe pedidos
- **App Conductor** (Driver) - Coordina entregas
- **Firebase** - Base de datos compartida

## 🔐 Seguridad

- Autenticación con Firebase Auth
- Reglas de seguridad en Firestore
- Validación de datos en cliente y servidor

## 📝 Próximas Mejoras

- [ ] Notificaciones push reales
- [ ] Integración con API de pagos
- [ ] Reportes avanzados con gráficos
- [ ] Chat con clientes y repartidores
- [ ] Gestión de inventario
- [ ] Múltiples sucursales
- [ ] Cupones y promociones

## 🆘 Soporte

Para problemas o preguntas:
- GitHub Issues
- Email: soporte@mototaxi.com

## 📄 Licencia

Propietario - Todos los derechos reservados

---

**Desarrollado como parte del ecosistema MotoTaxi** 🚀
