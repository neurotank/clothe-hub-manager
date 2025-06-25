
export const sendWhatsAppMessage = (supplier: any, garment: any) => {
  // Limpiar el número de teléfono, eliminando espacios y agregando el código de país
  const cleanPhone = supplier.phone.replace(/\s/g, '');
  const fullPhone = `54${cleanPhone}`;
  
  const supplierName = `${supplier.name} ${supplier.surname}`;
  
  const message = `¡Hola ${supplierName}! 👋

Tu prenda "${garment.name}" se ha vendido exitosamente. 

💰 Podés pasar a retirar tu pago los días miércoles y jueves de 15 a 21hs, sin excepción.

¡Gracias por confiar en nosotros!`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};
