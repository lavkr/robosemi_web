// components/ui/date-picker.tsx
'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';

interface DatePickerWithRangeProps {
  date: { from: Date; to: Date };
  onDateChange: (date: { from: Date; to: Date }) => void;
}

export function DatePickerWithRange({ date, onDateChange }: DatePickerWithRangeProps) {
  const [selectedRange, setSelectedRange] = React.useState<DateRange | undefined>({
    from: date.from,
    to: date.to,
  });

  const handleSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    if (range?.from && range?.to) {
      onDateChange({ from: range.from, to: range.to });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date.from && date.to ? (
            <>
              {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
            </>
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
          initialFocus
          className="bg-white rounded-md shadow-soft p-4"
        />
      </PopoverContent>
    </Popover>
  );
}