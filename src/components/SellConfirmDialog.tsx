
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PaymentType } from '../types';

interface SellConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (paymentType: PaymentType) => void;
  itemName: string;
}

const SellConfirmDialog: React.FC<SellConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  itemName
}) => {
  const [paymentType, setPaymentType] = useState<PaymentType | ''>('');

  const handleConfirm = () => {
    if (paymentType) {
      onConfirm(paymentType as PaymentType);
      setPaymentType(''); // Reset after confirm
    }
  };

  const handleCancel = () => {
    setPaymentType(''); // Reset on cancel
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Confirmar venta?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea marcar como vendida la prenda "{itemName}"?
            Se enviará un mensaje de WhatsApp a la propietaria informando sobre la venta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4">
          <Label htmlFor="payment-type" className="text-sm font-medium">
            Tipo de pago
          </Label>
          <Select value={paymentType} onValueChange={(value) => setPaymentType(value as PaymentType)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Seleccionar tipo de pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="efectivo">Efectivo</SelectItem>
              <SelectItem value="qr">QR</SelectItem>
              <SelectItem value="debito">Débito</SelectItem>
              <SelectItem value="credito">Crédito</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={!paymentType}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
          >
            Sí, marcar como vendida
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SellConfirmDialog;
