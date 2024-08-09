"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import LocationInput from "@/components/locationInput";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { MapPin, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/dateRangePicker";

const FormSchema = z.object({
  city: z.string({
    required_error: "Please select a city.",
  }),
});

export default function ParentComponent() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onStatusChange(status: any | null) {
    form.setValue("city", status ? status.value : "");
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col">
        <LocationInput
          onStatusChange={onStatusChange}
          placeholder="Where to Carpool?"
          icon={<MapPin size={15} />}
        />
        <div className="ml-6 w-[3px] bg-gray-300 h-[20px]" />
        <LocationInput
          onStatusChange={onStatusChange}
          placeholder="Where are you going?"
          icon={<Search size={15} />}
        />
        <DateRangePicker className="mt-5" />
        <div className="items-top flex space-x-2 mt-5 ml-4">
          <div className="flex items-center space-x-2">
            <Switch id="women-only-mode" />
            <Label htmlFor="women-only-mode">Women Only</Label>
          </div>
        </div>
      </div>
    </form>
  );
}
