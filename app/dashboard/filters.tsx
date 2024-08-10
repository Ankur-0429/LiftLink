"use client";
import LocationInput from "@/components/locationInput";
import { MapPin, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { useState } from "react";
import { Status } from "@/type";
import DatePicker from "@/components/ui/date-picker";

export default function ParentComponent() {
  const [fromStatus, setFromStatus] = useState(null as Status | null);
  const [toStatus, setToStatus] = useState(null as Status | null);
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
      <div className="flex flex-col">
        <LocationInput
          onStatusChange={setFromStatus}
          placeholder="Where to Carpool?"
          icon={<MapPin size={15} />}
        />
        <div className="ml-6 w-[3px] bg-gray-300 h-[20px]" />
        <LocationInput
          onStatusChange={setToStatus}
          placeholder="Where are you going?"
          icon={<Search size={15} />}
        />
        <div className="mt-5">
          <DatePicker date={date} setDate={setDate} />
        </div>
        <div className="items-top flex space-x-2 mt-5 ml-4">
          <div className="flex items-center space-x-2">
            <Switch id="women-only-mode" />
            <Label htmlFor="women-only-mode">Women Only</Label>
          </div>
        </div>
      </div>
  );
}
