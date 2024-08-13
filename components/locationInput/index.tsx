"use client";

import * as React from "react";
import debounce from "lodash.debounce";
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
import { Skeleton } from "../ui/skeleton";

type LocationInputProps = {
  onStatusChange: (status: {address: string; latitude: number; longitude: number;} | null) => void;
  placeholder: string;
  icon: React.ReactNode;
};

export default function LocationInput({
  onStatusChange,
  placeholder,
  icon,
}: LocationInputProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<{address: string; latitude: number; longitude: number;} | null>(
    null
  );

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onStatusChange(null);
    setSelectedStatus(null);
  };

  const handleStatusSelect = (status: {address: string; latitude: number; longitude: number;} | null) => {
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
                {selectedStatus.address}
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
  setSelectedStatus: (status: {address: string; latitude: number, longitude: number;} | null) => void;
}) {
  const [value, setValue] = React.useState("");
  const [statuses, setStatuses] = React.useState([] as {address: string; latitude: number, longitude: number;}[]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSearchChange = async (query: string) => {
    if (!query) {
      setIsLoading(false);
      return;
    }
    const authHeader = new Headers();
    authHeader.append(
      "Authorization",
      process.env.NEXT_PUBLIC_RADAR_API_KEY as string
    );

    const request = new Request(
      "https://api.radar.io/v1/search/autocomplete?" +
        new URLSearchParams({ query }).toString(),
      {
        headers: authHeader,
        method: "GET",
      }
    );

    try {
      const response = await fetch(request);
      const data = await response.json();
      if (data.addresses) {
        const newStatuses = data.addresses.map((address: any) => ({
          latitude: address.latitude,
          longitude: address.longitude,
          address: address.formattedAddress,
        }));
        setStatuses(newStatuses);
      }
    } catch {}
    setIsLoading(false);
  };

  const debouncedSearchChange = React.useCallback(
    debounce(handleSearchChange, 1000),
    []
  );

  const handleValueChange = (value: string) => {
    setValue(value);
    setIsLoading(true);
    debouncedSearchChange(value);
  };

  return (
    <Command>
      <CommandInput
        value={value}
        onValueChange={handleValueChange}
        placeholder="Filter by location..."
      />
      <CommandList>
        {isLoading ? (
          <Skeleton className="h-10 w-[250px]" />
        ) : (
          <>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {statuses.map((status) => (
                <CommandItem
                  key={status.address}
                  value={status.address}
                  onSelect={(value) => {
                    setSelectedStatus(
                      statuses.find((priority) => priority.address === value) ||
                        null
                    );
                    setOpen(false);
                  }}>
                  {status.address}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}
