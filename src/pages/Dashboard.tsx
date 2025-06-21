
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Header from '../components/Header';
import { useDataStore } from '../hooks/useDataStore';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { suppliers, getGarmentsBySupplier } = useDataStore();

  const handleViewDetail = (supplierId: number) => {
    navigate(`/supplier/${supplierId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proveedores</h2>
          <p className="text-gray-600">Gestiona tus proveedores y sus prendas en consignación</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Proveedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden sm:table-cell">Teléfono</TableHead>
                    <TableHead className="hidden md:table-cell">Dirección</TableHead>
                    <TableHead className="hidden lg:table-cell">Email</TableHead>
                    <TableHead className="text-center">Prendas</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => {
                    const garments = getGarmentsBySupplier(supplier.id);
                    const availableGarments = garments.filter(g => !g.isSold).length;
                    const soldGarments = garments.filter(g => g.isSold).length;
                    
                    return (
                      <TableRow key={supplier.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell className="hidden sm:table-cell text-gray-600">
                          {supplier.phone}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-gray-600">
                          {supplier.address}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-gray-600">
                          {supplier.email}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <span className="text-sm font-medium text-green-600">
                              {availableGarments} disponibles
                            </span>
                            <span className="text-xs text-gray-500">
                              {soldGarments} vendidas
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            onClick={() => handleViewDetail(supplier.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Ver detalle
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
