
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GarmentFormData } from '../types';

interface AddGarmentModalProps {
  supplierId: number;
  onAddGarment: (supplierId: number, garmentData: GarmentFormData) => void;
}

const AddGarmentModal: React.FC<AddGarmentModalProps> = ({ supplierId, onAddGarment }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<GarmentFormData>({
    code: '',
    name: '',
    size: '',
    purchasePrice: 0,
    salePrice: 0,
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.size || formData.purchasePrice <= 0 || formData.salePrice <= 0) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos correctamente",
        variant: "destructive",
      });
      return;
    }

    if (formData.salePrice <= formData.purchasePrice) {
      toast({
        title: "Error",
        description: "El precio de venta debe ser mayor al precio de compra",
        variant: "destructive",
      });
      return;
    }

    onAddGarment(supplierId, formData);
    
    toast({
      title: "Prenda agregada",
      description: "La prenda se agregó correctamente al inventario",
    });

    // Resetear formulario y cerrar modal
    setFormData({
      code: '',
      name: '',
      size: '',
      purchasePrice: 0,
      salePrice: 0,
    });
    setOpen(false);
  };

  const handleInputChange = (field: keyof GarmentFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Prenda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Prenda</DialogTitle>
          <DialogDescription>
            Complete los datos de la nueva prenda en consignación
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Ej: REM001"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="size">Talle</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                placeholder="Ej: M, L, 32"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la prenda</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ej: Remera básica blanca"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Precio de Compra ($)</Label>
              <Input
                id="purchasePrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.purchasePrice || ''}
                onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salePrice">Precio de Venta ($)</Label>
              <Input
                id="salePrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.salePrice || ''}
                onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Agregar Prenda
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGarmentModal;
