import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnumOption {
  value: number;
  label: string;
}

interface EnumSelectProps {
  options: EnumOption[];
  value?: number;
  onValueChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function EnumSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  disabled = false,
}: EnumSelectProps) {
  return (
    <Select
      value={value?.toString()}
      onValueChange={(val) => onValueChange(Number(val))}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value.toString()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 