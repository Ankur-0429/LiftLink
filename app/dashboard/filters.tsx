"use client";
import LocationInput from "@/components/locationInput";
import { MapPin, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/ui/date-picker";
import { useEffect, useState } from "react";

interface FiltersProps {
  filters: {
    fromStatus?: { address: string; latitude: number; longitude: number };
    toStatus?: { address: string; latitude: number; longitude: number };
    timeOfDay?: Date;
    womenOnly: boolean;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      fromStatus?: { address: string; latitude: number; longitude: number };
      toStatus?: { address: string; latitude: number; longitude: number };
      timeOfDay?: Date;
      womenOnly: boolean;
    }>
  >;
}

export default function Filters({ filters, setFilters }: FiltersProps) {
  const { fromStatus, toStatus, timeOfDay, womenOnly } = filters;
  const [date, setDate] = useState<Date | undefined>(timeOfDay);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, fromStatus, toStatus, timeOfDay: date }));
  }, [fromStatus, toStatus, timeOfDay, setFilters, date]);

  return (
    <div className="flex flex-col">
      <LocationInput
        onStatusChange={(status) =>
          setFilters((prev) => ({ ...prev, fromStatus: status || undefined }))
        }
        placeholder="Where to Carpool?"
        icon={<MapPin size={15} />}
      />
      <div className="ml-[1.4rem] w-[3px] bg-gray-300 h-[20px]" />
      <LocationInput
        onStatusChange={(status) =>
          setFilters((prev) => ({ ...prev, toStatus: status || undefined }))
        }
        placeholder="Where are you going?"
        icon={<Search size={15} />}
      />
      <div className="mt-5">
        <DatePicker
          date={date}
          setDate={setDate}
        />
      </div>
      <div className="items-top flex space-x-2 mt-5 ml-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="women-only-mode"
            checked={womenOnly}
            onCheckedChange={(status) =>
              setFilters((prev) => ({ ...prev, womenOnly: status }))
            }
          />
          <Label htmlFor="women-only-mode">Women Only</Label>
        </div>
      </div>
    </div>
  );
}
