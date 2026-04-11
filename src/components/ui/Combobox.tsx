"use client";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Options = {
  value: string;
  label: string;
};

interface ComboboxProps {
  choices: Options[];
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

const Combobox = ({ choices, filter, setFilter }: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {filter
            ? choices.find((choice) => choice.value === filter)?.label
            : "Select choice..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      {/* Display options */}
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search option..." className="h-9" />
          <CommandList>
            <CommandEmpty>No option found</CommandEmpty>
            <CommandGroup>
              {choices.map((choice) => (
                <CommandItem
                  key={choice.value}
                  value={choice.value}
                  onSelect={(currentValue) => {
                    setFilter(currentValue === filter ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {choice.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      filter === choice.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
