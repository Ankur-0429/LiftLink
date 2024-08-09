"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import LocationInput from "@/components/locationInput";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {useForm} from "react-hook-form";

const languages: { label: string; value: string }[]  = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

const cities: { label: string; value: string }[] = [
  { label: "New York", value: "ny" },
  { label: "Los Angeles", value: "la" },
  { label: "Chicago", value: "ch" },
  { label: "Houston", value: "ho" },
  { label: "Phoenix", value: "ph" },
] as const;

const FormSchema = z.object({
  language: z.string({
    required_error: "Please select a language.",
  }),
  city: z.string({
    required_error: "Please select a city.",
  }),
});

export default function ParentComponent() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

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
      <LocationInput
        control={form.control}
        name="language"
        options={languages}
        placeholder="Select language"
        label="Language"
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
