# 🚀 Guía de Inicio Rápido - App de Comercios

## ✅ Checklist de Instalación

### 1. Requisitos Previos
- [ ] Node.js instalado (v16+)
- [ ] Expo CLI instalado globalmente: `npm install -g expo-cli`
- [ ] Expo Go app instalada en tu móvil
- [ ] Cuenta de Firebase creada

### 2. Instalación
```bash
# Ya ejecutado
npm install
```

### 3. Configuración de Firebase

#### Paso 1: Crear Proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa el existente `mototaxi-app`
3. Habilita Firestore Database
4. Habilita Authentication (Email/Password)

#### Paso 2: Obtener Credenciales
1. En Firebase Console → Project Settings → General
2. Copia las credenciales de configuración
3. Edita `src/config/firebase.js` y reemplaza:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

#### Paso 3: Crear Colecciones en Firestore

Crea estas colecciones manualmente o usa el script:

**Colección: `stores`**
```json
{
  "id": "store001",
  "name": "Burger House",
  "category": "restaurant",
  "email": "burger@example.com",
  "phone": "+584121234567",
  "image": "🍔",
  "isOpen": true,
  "rating": 4.5,
  "totalOrders": 0
}
```

**Colección: `products`**
```json
{
  "id": "prod001",
  "storeId": "store001",
  "name": "Hamburguesa Clásica",
  "description": "Carne, lechuga, tomate, queso",
  "price": 8.5,
  "category": "hamburguesas",
  "image": "🍔",
  "isAvailable": true,
  "preparationTime": 15
}
```

**Colección: `orders`**
```json
{
  "id": "order001",
  "type": "delivery",
  "status": "pending",
  "storeId": "store001",
  "userId": "user001",
  "items": [
    {
      "productId": "prod001",
      "name": "Hamburguesa Clásica",
      "quantity": 2,
      "price": 8.5,
      "subtotal": 17.0
    }
  ],
  "subtotal": 17.0,
  "deliveryFee": 2.0,
  "total": 19.0,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Iniciar la Aplicación

```bash
# Iniciar Expo
npm start

# O con túnel (para probar desde cualquier red)
npx expo start --tunnel
```

### 5. Abrir en tu Dispositivo

1. Abre **Expo Go** en tu móvil
2. Escanea el código QR que aparece en la terminal
3. Espera a que cargue la app

### 6. Probar la Aplicación

#### Login de Prueba
- **Email**: cualquier email (ej: `test@burger.com`)
- **Password**: cualquier contraseña (ej: `123456`)

La app usa datos mock por defecto, así que puedes iniciar sesión con cualquier credencial.

## 📱 Flujo de Prueba Completo

### 1. Iniciar Sesión
- Abre la app
- Ingresa email y contraseña
- Toca "Iniciar Sesión"

### 2. Explorar Dashboard
- Ve las estadísticas del día
- Revisa los pedidos activos
- Explora las acciones rápidas

### 3. Gestionar Pedidos
- Ve a la pestaña "Pedidos"
- Filtra por estado (Pendientes, Preparando, etc.)
- Acepta un pedido pendiente
- Marca como "En Preparación"
- Marca como "Listo"

### 4. Gestionar Menú
- Ve a la pestaña "Menú"
- Ve los productos existentes
- Activa/Desactiva disponibilidad con el switch
- (Próximamente: Agregar/Editar productos)

### 5. Ver Estadísticas
- Ve a la pestaña "Estadísticas"
- Revisa ventas del día/semana/mes
- Ve productos más vendidos

### 6. Configuración
- Ve a la pestaña "Ajustes"
- Cambia el estado del comercio (Abierto/Cerrado)
- Explora las opciones de configuración

## 🔧 Solución de Problemas

### Error: "Metro Bundler no inicia"
```bash
npx expo start --clear
```

### Error: "No se puede conectar"
```bash
# Asegúrate de estar en la misma red WiFi
# O usa modo túnel:
npx expo start --tunnel
```

### Error: "Firebase no conecta"
1. Verifica que las credenciales en `firebase.js` sean correctas
2. Asegúrate de que Firestore esté habilitado
3. Revisa las reglas de seguridad de Firestore

### Error: "Pantalla blanca"
1. Revisa la consola de Expo para errores
2. Verifica que todas las dependencias estén instaladas
3. Limpia cache: `npx expo start --clear`

## 🎨 Personalización

### Cambiar Colores
Edita `src/constants/colors.js`:

```javascript
export const COLORS = {
  primary: '#FF6B35',    // Tu color principal
  secondary: '#004E89',  // Tu color secundario
  // ...
};
```

### Cambiar Logo
Reemplaza los archivos en `assets/`:
- `icon.png` - Ícono de la app (1024x1024)
- `splash.png` - Pantalla de inicio
- `adaptive-icon.png` - Ícono adaptativo Android

### Cambiar Nombre
Edita `app.json`:

```json
{
  "expo": {
    "name": "Tu Nombre de App",
    "slug": "tu-slug"
  }
}
```

## 📊 Integración con Firebase Real

Para conectar con Firebase real en lugar de datos mock:

### 1. Servicios de Firebase

Crea `src/services/orderService.js`:

```javascript
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export const subscribeToOrders = (storeId, callback) => {
  const q = query(
    collection(db, 'orders'),
    where('storeId', '==', storeId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(orders);
  });
};
```

### 2. Actualizar Context

Modifica `src/context/OrderContext.js` para usar Firebase:

```javascript
useEffect(() => {
  if (store?.id) {
    const unsubscribe = subscribeToOrders(store.id, (newOrders) => {
      setOrders(newOrders);
    });
    
    return () => unsubscribe();
  }
}, [store]);
```

## 🚀 Próximos Pasos

1. [ ] Configurar Firebase con datos reales
2. [ ] Implementar notificaciones push
3. [ ] Agregar pantalla de detalle de pedido
4. [ ] Implementar agregar/editar productos
5. [ ] Agregar gráficos en estadísticas
6. [ ] Implementar chat con clientes
7. [ ] Agregar gestión de horarios
8. [ ] Implementar zona de entrega en mapa

## 📚 Recursos

- [Documentación de Expo](https://docs.expo.dev/)
- [Documentación de Firebase](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)

## 🆘 Soporte

Si tienes problemas:
1. Revisa esta guía
2. Consulta el README.md
3. Revisa los logs de Expo
4. Contacta al equipo de desarrollo

---

**¡Listo para empezar! 🎉**
