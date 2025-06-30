
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateRangeFilterProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onClearFilters: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  selectedMonth,
  onMonthChange,
  selectedDate,
  onDateChange,
  onClearFilters
}) => {
  const months = [
    { value: '', label: 'Todos los meses' },
    { value: '2025-01', label: 'Enero 2025' },
    { value: '2025-02', label: 'Febrero 2025' },
    { value: '2025-03', label: 'Marzo 2025' },
    { value: '2025-04', label: 'Abril 2025' },
    { value: '2025-05', label: 'Mayo 2025' },
    { value: '2025-06', label: 'Junio 2025' },
    { value: '2025-07', label: 'Julio 2025' },
    { value: '2025-08', label: 'Agosto 2025' },
    { value: '2025-09', label: 'Septiembre 2025' },
    { value: '2025-10', label: 'Octubre 2025' },
    { value: '2025-11', label: 'Noviembre 2025' },
    { value: '2025-12', label: 'Diciembre 2025' },
    { value: '2026-01', label: 'Enero 2026' },
    { value: '2026-02', label: 'Febrero 2026' },
    { value: '2026-03', label: 'Marzo 2026' },
    { value: '2026-04', label: 'Abril 2026' },
    { value: '2026-05', label: 'Mayo 2026' },
    { value: '2026-06', label: 'Junio 2026' },
  ];

  const hasFilters = selectedMonth || selectedDate;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="w-4 h-4 text-gray-500" />
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Seleccionar mes" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-48 justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Seleccionar día"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {hasFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="text-gray-600"
        >
          <X className="w-4 h-4 mr-2" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
};

export default DateRangeFilter;
