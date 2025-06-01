import { useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "./ui/calendar";

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  okText?: string;
}

export default function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
  okText = "OK",
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(value ? new Date(value) : null);
  const [tempTime, setTempTime] = useState<string>(
    value ? format(new Date(value), "HH:mm") : ""
  );
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => {
    if (tempDate && tempTime) {
      const [hours, minutes] = tempTime.split(":");
      tempDate.setHours(parseInt(hours, 10));
      tempDate.setMinutes(parseInt(minutes, 10));
      onChange(tempDate.toISOString());
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "dd.MM.yyyy HH:mm") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-4 space-y-4 w-[280px] max-w-[90vw]"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <Calendar
          mode="single"
          selected={tempDate ?? undefined}
          onSelect={(date) => setTempDate(date ?? null)}
          initialFocus
        />
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" /> Time
          </label>
          <input
            type="time"
            value={tempTime}
            onChange={(e) => setTempTime(e.target.value)}
            className="w-full mt-1 p-2 border rounded bg-background text-foreground"
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button size="sm" onClick={handleConfirm} disabled={!tempDate || !tempTime}>
            {okText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
