"use client";

import * as React from "react";

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
import { X } from "lucide-react";

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  {
    value: "backlog",
    label: "Backlog",
  },
  {
    value: "todo",
    label: "Todo",
  },
  {
    value: "in progress",
    label: "In Progress",
  },
  {
    value: "done",
    label: "Done",
  },
  {
    value: "canceled",
    label: "Canceled",
  },
];

type LocationInputProps = {
  onStatusChange: (status: Status | null) => void;
  placeholder: string;
  icon: React.ReactNode;
};

export default function LocationInput({
  onStatusChange,
  placeholder,
  icon
}: LocationInputProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null
  );

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onStatusChange(null);
    setSelectedStatus(null);
  };

  const handleStatusSelect = (status: Status | null) => {
    setSelectedStatus(status);
    onStatusChange(status);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button
            variant="outline"
            className="w-full justify-start"
            type="button">
            {selectedStatus ? (
              <p className="opacity-60 flex gap-x-2 items-center">
                {icon}
                {selectedStatus.label}
              </p>
            ) : (
              <p className="opacity-60 flex gap-x-2 items-center">
                {icon}
                {placeholder}
              </p>
            )}
          </Button>
          {selectedStatus && (
            <span
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700">
              <X size={20} />
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <StatusList setOpen={setOpen} setSelectedStatus={handleStatusSelect} />
      </PopoverContent>
    </Popover>
  );
}

function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: Status | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedStatus(
                  statuses.find((priority) => priority.value === value) || null
                );
                setOpen(false);
              }}>
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
