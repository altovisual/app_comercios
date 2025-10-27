// Servicio para subir imágenes a Cloudinary
const CLOUDINARY_CLOUD_NAME = 'dzja7qui'; // Tu Cloud Name
const CLOUDINARY_UPLOAD_PRESET = 'unsigned_preset'; // Preset Unsigned en Cloudinary

export const uploadImageToCloudinary = async (imageUri) => {
  try {
    console.log('📤 Subiendo imagen a Cloudinary...');
    console.log('URI:', imageUri);
    console.log('Cloud Name:', CLOUDINARY_CLOUD_NAME);
    console.log('Preset:', CLOUDINARY_UPLOAD_PRESET);

    // Crear FormData
    const formData = new FormData();
    
    // Obtener el nombre del archivo y tipo
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    console.log('Filename:', filename);
    console.log('Type:', type);

    // Agregar imagen al FormData
    formData.append('file', {
      uri: imageUri,
      type: type,
      name: filename,
    });
    
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Subir a Cloudinary
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    console.log('Upload URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (data.error) {
      console.error('❌ Cloudinary error:', data.error);
      throw new Error(data.error.message || 'Error de Cloudinary');
    }

    if (data.secure_url) {
      console.log('✅ Imagen subida exitosamente:', data.secure_url);
      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
      };
    } else {
      console.error('❌ No se recibió URL');
      throw new Error('No se recibió URL de la imagen. Verifica el preset en Cloudinary.');
    }
  } catch (error) {
    console.error('❌ Error uploading to Cloudinary:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Eliminar imagen de Cloudinary (opcional)
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    // Nota: Para eliminar imágenes necesitas el API Secret
    // Por seguridad, esto debería hacerse desde el backend
    console.log('Delete image:', publicId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return { success: false, error: error.message };
  }
};
