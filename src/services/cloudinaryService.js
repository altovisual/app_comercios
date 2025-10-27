// Servicio para subir imágenes a Cloudinary
const CLOUDINARY_CLOUD_NAME = 'dzja7qui'; // Tu Cloud Name
const CLOUDINARY_UPLOAD_PRESET = 'delivery'; // Preset creado en Cloudinary

export const uploadImageToCloudinary = async (imageUri) => {
  try {
    // Crear FormData
    const formData = new FormData();
    
    // Obtener el nombre del archivo y tipo
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // Agregar imagen al FormData
    formData.append('file', {
      uri: imageUri,
      type: type,
      name: filename,
    });
    
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    // Subir a Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const data = await response.json();

    if (data.secure_url) {
      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
      };
    } else {
      throw new Error('No se recibió URL de la imagen');
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
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
