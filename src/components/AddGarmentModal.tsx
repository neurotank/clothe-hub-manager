import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useSupabaseData } from '../hooks/useSupabaseData';

interface AddGarmentModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  supplierId: string;
  onAddGarment?: (supplierId: string, garmentData: any) => Promise<void>;
}

const AddGarmentModal: React.FC<AddGarmentModalProps> = ({ 
  isOpen, 
  onClose, 
  supplierId, 
  onAddGarment 
}) => {
  const { addGarment } = useSupabaseData();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    size: '',
    purchase_price: '',
    sale_price: '',
  });
  const [loading, setLoading] = useState(false);

  const isControlled = isOpen !== undefined && onClose !== undefined;
  const modalOpen = isControlled ? isOpen : open;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.code.trim() || !formData.size.trim() ||
        !formData.purchase_price || !formData.sale_price) {
      return;
    }

    setLoading(true);
    
    const garmentData = {
      ...formData,
      purchase_price: parseFloat(formData.purchase_price),
      sale_price: parseFloat(formData.sale_price),
    };

    console.log('AddGarmentModal: Submitting garment data:', garmentData);

    // Use the passed onAddGarment prop if available, otherwise use the hook function
    if (onAddGarment) {
      console.log('AddGarmentModal: Using custom onAddGarment function');
      await onAddGarment(supplierId, garmentData);
    } else {
      console.log('AddGarmentModal: Using default addGarment function');
      await addGarment(supplierId, garmentData);
    }
    
    // Reset form
    setFormData({
      name: '',
      code: '',
      size: '',
      purchase_price: '',
      sale_price: '',
    });
    
    // Close modal
    if (isControlled && onClose) {
      onClose();
    } else {
      setOpen(false);
    }
    setLoading(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      name: '',
      code: '',
      size: '',
      purchase_price: '',
      sale_price: '',
    });
    if (isControlled && onClose) {
      onClose();
    } else {
      setOpen(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      if (!newOpen && onClose) {
        onClose();
      }
    } else {
      setOpen(newOpen);
    }
  };

  const ModalContent = (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Agregar Nueva Prenda</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Nombre de la prenda"
            required
          />
        </div>

        <div>
          <Label htmlFor="code">Código *</Label>
          <Input
            id="code"
            type="text"
            value={formData.code}
            onChange={(e) => handleInputChange('code', e.target.value)}
            placeholder="Código de la prenda"
            required
          />
        </div>

        <div>
          <Label htmlFor="size">Talla *</Label>
          <Input
            id="size"
            type="text"
            value={formData.size}
            onChange={(e) => handleInputChange('size', e.target.value)}
            placeholder="Talla"
            required
          />
        </div>

        <div>
          <Label htmlFor="purchase_price">Precio de Compra *</Label>
          <Input
            id="purchase_price"
            type="number"
            step="0.01"
            value={formData.purchase_price}
            onChange={(e) => handleInputChange('purchase_price', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <Label htmlFor="sale_price">Precio de Venta *</Label>
          <Input
            id="sale_price"
            type="number"
            step="0.01"
            value={formData.sale_price}
            onChange={(e) => handleInputChange('sale_price', e.target.value)}
            placeholder="0.00"
            required
          />
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
            {loading ? 'Agregando...' : 'Agregar Prenda'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );

  if (isControlled) {
    return (
      <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
        {ModalContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Prenda
        </Button>
      </DialogTrigger>
      {ModalContent}
    </Dialog>
  );
};

export default AddGarmentModal;
