
import React from 'react';
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

interface SellConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName: string;
}

const SellConfirmDialog: React.FC<SellConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  itemName
}) => {
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
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700"
          >
            Sí, marcar como vendida
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SellConfirmDialog;
