
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Header from '../components/Header';
import MonthFilter from '../components/MonthFilter';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Supplier, Garment } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AdminSoldGarments: React.FC = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [soldGarments, setSoldGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Cargar datos
  const loadData = async () => {
    setLoading(true);
    
    // Cargar suppliers
    const { data: suppliersData, error: suppliersError } = await supabase
      .from('suppliers')
      .select('*');

    if (suppliersError) {
      console.error('Error loading suppliers:', suppliersError);
      toast({
        title: "Error",
        description: "No se pudieron cargar los proveedores",
        variant: "destructive",
      });
    } else {
      setSuppliers(suppliersData || []);
    }

    // Cargar prendas vendidas
    const { data: garmentsData, error: garmentsError } = await supabase
      .from('garments')
      .select('*')
      .eq('is_sold', true)
      .order('sold_at', { ascending: false });

    if (garmentsError) {
      console.error('Error loading sold garments:', garmentsError);
      toast({
        title: "Error",
        description: "No se pudieron cargar las prendas vendidas",
        variant: "destructive",
      });
    } else {
      setSoldGarments(garmentsData || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtrar prendas vendidas por mes
  const filteredGarments = useMemo(() => {
    return soldGarments.filter(garment => {
      // Filtro por mes
      const matchesMonth = selectedMonth === 'all' || 
        (garment.sold_at && format(new Date(garment.sold_at), 'yyyy-MM') === selectedMonth);
      
      return matchesMonth;
    });
  }, [soldGarments, selectedMonth]);

  const totalRevenue = filteredGarments.reduce((acc, garment) => acc + garment.sale_price, 0);
  const totalProfit = filteredGarments.reduce((acc, garment) => acc + (garment.sale_price - garment.purchase_price), 0);
  const pendingPayments = filteredGarments.filter(g => g.payment_status === 'pending').length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Administración - Prendas Vendidas</h2>
          <p className="text-gray-600">Vista completa de todas las prendas vendidas y sus pagos</p>
        </div>

        <div className="mb-6">
          <MonthFilter
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Vendidas
                {selectedMonth !== 'all' && <span className="block text-xs text-gray-400">({selectedMonth})</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredGarments.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ingresos Totales
                {selectedMonth !== 'all' && <span className="block text-xs text-gray-400">({selectedMonth})</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ganancia Total
                {selectedMonth !== 'all' && <span className="block text-xs text-gray-400">({selectedMonth})</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatPrice(totalProfit)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pagos Pendientes
                {selectedMonth !== 'all' && <span className="block text-xs text-gray-400">({selectedMonth})</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingPayments}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Prendas Vendidas
              {filteredGarments.length !== soldGarments.length && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredGarments.length} de {soldGarments.length})
                </span>
              )}
              {selectedMonth !== 'all' && (
                <span className="text-sm font-normal text-blue-600 ml-2">
                  - {selectedMonth}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Prenda</TableHead>
                    <TableHead className="hidden lg:table-cell">Proveedor</TableHead>
                    <TableHead>Talla</TableHead>
                    <TableHead className="hidden sm:table-cell">Precio Compra</TableHead>
                    <TableHead>Precio Venta</TableHead>
                    <TableHead className="hidden md:table-cell">Ganancia</TableHead>
                    <TableHead className="hidden lg:table-cell">Fecha Venta</TableHead>
                    <TableHead className="text-center">Estado Pago</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGarments.map((garment) => {
                    const supplier = suppliers.find(s => s.id === garment.supplier_id);
                    const profit = garment.sale_price - garment.purchase_price;
                    
                    return (
                      <TableRow 
                        key={garment.id} 
                        className={`hover:bg-gray-50 ${garment.payment_status === 'paid' ? 'opacity-60' : ''}`}
                      >
                        <TableCell className="font-medium">{garment.code}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{garment.name}</div>
                            <div className="lg:hidden text-xs text-gray-500">
                              {supplier?.name} {supplier?.surname}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {supplier?.name} {supplier?.surname}
                        </TableCell>
                        <TableCell>{garment.size}</TableCell>
                        <TableCell className="hidden sm:table-cell">{formatPrice(garment.purchase_price)}</TableCell>
                        <TableCell className="font-medium">{formatPrice(garment.sale_price)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className={profit > 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatPrice(profit)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {garment.sold_at && format(new Date(garment.sold_at), 'dd/MM/yyyy', { locale: es })}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant={garment.payment_status === 'paid' ? 'default' : 'secondary'}
                            className={
                              garment.payment_status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {garment.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                          </Badge>
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

export default AdminSoldGarments;
