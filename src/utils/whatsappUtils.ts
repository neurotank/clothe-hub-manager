
import { Supplier, Garment } from '../types';

export const sendWhatsAppMessage = (supplier: Supplier, garment: Garment) => {
  const message = `¡Hola ${supplier.name}! 🎉

Te informamos que tu prenda se ha vendido:

📦 Producto: ${garment.name}
🔢 Código: ${garment.code}
👕 Talle: ${garment.size}
💰 Precio de venta: $${garment.salePrice.toLocaleString('es-AR')}

¡Felicitaciones por la venta! 

Saludos,
Equipo de Ventas`;

  // Limpiar el número de teléfono para WhatsApp (remover espacios, guiones, etc.)
  const cleanPhone = supplier.phone.replace(/[^0-9]/g, '');
  
  // Crear la URL de WhatsApp
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  
  console.log('Sending WhatsApp message to:', supplier.phone);
  console.log('Message:', message);
  
  // Abrir WhatsApp en una nueva ventana
  window.open(whatsappUrl, '_blank');
};
