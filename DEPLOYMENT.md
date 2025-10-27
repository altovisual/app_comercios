# 📦 Despliegue y Configuración

## ✅ Estado Actual

La aplicación está completamente configurada y lista para usar:

- ✅ Estructura de proyecto creada
- ✅ Dependencias instaladas (931 paquetes)
- ✅ Navegación implementada (Stack + Tabs)
- ✅ Autenticación configurada
- ✅ 5 pantallas principales creadas
- ✅ Context API implementado
- ✅ Git inicializado
- ✅ Commit inicial realizado

## 🚀 Crear Repositorio en GitHub

### Opción 1: Desde GitHub Web

1. Ve a https://github.com/altovisual
2. Click en "New repository"
3. Nombre: `merchant-app`
4. Descripción: "App de Comercios - MotoTaxi Ecosystem"
5. Público o Privado (tu elección)
6. **NO** marques "Initialize with README"
7. Click "Create repository"

Luego ejecuta:
```bash
cd c:\Users\altov\Downloads\merchant-app
git push -u origin main
```

### Opción 2: Desde GitHub CLI

```bash
gh repo create altovisual/merchant-app --public --source=. --remote=origin --push
```

## 📱 Iniciar la Aplicación

Una vez creado el repositorio, puedes iniciar la app:

```bash
cd c:\Users\altov\Downloads\merchant-app
npm start
```

O con túnel:
```bash
npx expo start --tunnel
```

## 🔧 Configuración Necesaria

### 1. Firebase (IMPORTANTE)

Antes de usar la app en producción, configura Firebase:

1. Edita `src/config/firebase.js`
2. Reemplaza las credenciales con las de tu proyecto
3. Crea las colecciones en Firestore:
   - `stores`
   - `products`
   - `orders`

### 2. Notificaciones Push

Para habilitar notificaciones:

```bash
npx expo install expo-notifications
```

Luego configura en `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#FF6B35"
        }
      ]
    ]
  }
}
```

### 3. Assets (Imágenes)

Agrega estas imágenes en la carpeta `assets/`:
- `icon.png` (1024x1024)
- `splash.png` (1242x2436)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)

## 🧪 Testing

### Modo Desarrollo
```bash
npm start
```

### Con Datos Mock
La app incluye datos de prueba por defecto:
- Login: cualquier email/password
- Pedidos de ejemplo precargados
- Productos de ejemplo

### Con Firebase Real
1. Configura Firebase (ver arriba)
2. Descomenta el código de integración en los Context
3. Reinicia la app

## 📊 Estructura de Archivos

```
merchant-app/
├── src/
│   ├── screens/          # 7 pantallas
│   │   ├── auth/         # Login, Register
│   │   ├── home/         # Dashboard
│   │   ├── orders/       # Gestión pedidos
│   │   ├── menu/         # Gestión menú
│   │   ├── stats/        # Estadísticas
│   │   └── settings/     # Configuración
│   ├── navigation/       # 3 navegadores
│   ├── context/          # 3 contexts
│   ├── config/           # Firebase
│   └── constants/        # Colores, estados
├── assets/               # Imágenes
├── App.js               # Entry point
├── package.json         # 931 dependencias
├── README.md            # Documentación
├── GETTING_STARTED.md   # Guía de inicio
└── DEPLOYMENT.md        # Este archivo
```

## 🌐 Publicación

### Build para Android
```bash
eas build --platform android
```

### Build para iOS
```bash
eas build --platform ios
```

### Publicar en Expo
```bash
expo publish
```

## 🔗 Enlaces Útiles

- Repositorio Cliente: https://github.com/altovisual/Transport-Delivery
- Repositorio Conductor: https://github.com/altovisual/Driver
- Repositorio Comercios: https://github.com/altovisual/app_comercios

## 📝 Próximos Pasos

1. [x] Crear repositorio en GitHub
2. [x] Push del código
3. [ ] Configurar Firebase
4. [ ] Agregar assets (imágenes)
5. [ ] Probar en dispositivo real
6. [ ] Implementar notificaciones
7. [ ] Conectar con Firebase real
8. [ ] Testing completo
9. [ ] Build para producción

## 🆘 Soporte

Si tienes problemas:
1. Revisa GETTING_STARTED.md
2. Revisa README.md
3. Consulta los logs de Expo
4. Verifica la configuración de Firebase

---

**Estado**: ✅ Código subido a GitHub - Listo para iniciar y probar
**Repositorio**: https://github.com/altovisual/app_comercios
**Última actualización**: 2025-10-27
