// Servicio para subir imágenes a ImgBB (alternativa gratuita a Cloudinary)
// API Key gratuita - 5000 uploads/mes
const IMGBB_API_KEY = '788df0dc34dad366aaca13ed0a107a9f'; // Tu API Key de ImgBB

export const uploadImageToImgBB = async (imageUri) => {
  try {
    console.log('📤 Subiendo imagen a ImgBB...');
    console.log('URI:', imageUri);

    // Leer la imagen como base64
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Convertir a base64
    const reader = new FileReader();
    const base64Promise = new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64data = reader.result.split(',')[1];
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const base64Image = await base64Promise;

    // Crear FormData
    const formData = new FormData();
    formData.append('image', base64Image);
    formData.append('key', IMGBB_API_KEY);

    // Subir a ImgBB
    const uploadResponse = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await uploadResponse.json();
    console.log('Response:', data);

    if (data.success && data.data.url) {
      console.log('✅ Imagen subida exitosamente:', data.data.url);
      return {
        success: true,
        url: data.data.url,
        deleteUrl: data.data.delete_url,
      };
    } else {
      throw new Error(data.error?.message || 'Error al subir imagen');
    }
  } catch (error) {
    console.error('❌ Error uploading to ImgBB:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
