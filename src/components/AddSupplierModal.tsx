
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabaseData } from '../hooks/useSupabaseData';

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({ isOpen, onClose }) => {
  const { addSupplier } = useSupabaseData();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (phone: string) => {
    // Solo números, sin espacios ni caracteres especiales
    const phoneRegex = /^\d{10,11}$/;
    
    if (!phone) {
      return 'El teléfono es requerido';
    }
    
    if (!phoneRegex.test(phone)) {
      return 'El teléfono debe tener 10 u 11 dígitos numéricos';
    }
    
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    const phoneValidationError = validatePhone(formData.phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    setLoading(true);
    const result = await addSupplier(formData);
    
    if (result) {
      setFormData({ name: '', surname: '', phone: '' });
      setPhoneError('');
      onClose();
    }
    setLoading(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error de teléfono cuando el usuario empiece a escribir
    if (field === 'phone' && phoneError) {
      setPhoneError('');
    }
  };

  const handlePhoneChange = (value: string) => {
    // Solo permitir números
    const numericValue = value.replace(/\D/g, '');
    handleInputChange('phone', numericValue);
  };

  const handleClose = () => {
    setFormData({ name: '', surname: '', phone: '' });
    setPhoneError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ingresa el nombre"
              required
            />
          </div>

          <div>
            <Label htmlFor="surname">Apellido</Label>
            <Input
              id="surname"
              type="text"
              value={formData.surname}
              onChange={(e) => handleInputChange('surname', e.target.value)}
              placeholder="Ingresa el apellido"
            />
          </div>

          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="Ej: 3816345678 o 38384743147"
              required
              maxLength={11}
            />
            {phoneError && (
              <p className="text-sm text-red-600 mt-1">{phoneError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Solo números, 10 u 11 dígitos
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Agregando...' : 'Agregar Proveedor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSupplierModal;
