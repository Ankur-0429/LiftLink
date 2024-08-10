"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Plus, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";
import { DateRangePicker } from "@/components/dateRangePicker";
import LocationInput from "@/components/locationInput";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  numberOfParticipants: z.preprocess(
    (value) => {
      if (typeof value === 'string' && value.trim() === '') {
        return undefined;
      }
      return parseFloat(value as string);
    },
    z.number({
      required_error: "Please select the number of participants.",
    })
  ),
});

const CreatePost = () => {
  const session = useSession();
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

  const { formState: { errors } } = form;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="border-2 border-border cursor-pointer py-2 px-3 rounded-full flex justify-between items-center">
          <div className="flex items-center gap-x-3">
            <Avatar>
              <AvatarImage
                src={session.data?.user?.image || undefined}
                alt={session.data?.user?.name || undefined}
              />
              <AvatarFallback>
                {session.data?.user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-muted-foreground">Create a Carpool</p>
          </div>
          <Plus />
        </div>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen sm:w-full sm:h-[550px]">
        <DialogHeader>
          <DialogTitle>Create Carpool</DialogTitle>
          <DialogDescription>
            We won&apos;t share these exact locations to other users
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <LocationInput
              onStatusChange={() => {}}
              placeholder="Where to Carpool?"
              icon={<MapPin size={15} />}
            />
            <div className="ml-6 w-[3px] bg-gray-300 h-[20px]" />
            <LocationInput
              onStatusChange={() => {}}
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

            <FormField
              control={form.control}
              name="numberOfParticipants"
              render={({ field }) => {
                return (
                  <FormItem className="mt-5">
                    <FormControl>
                      <Input
                        placeholder="Number of participants"
                        type="number"
                        min={1}
                        max={8}
                        {...field}
                      />
                    </FormControl>
                    {errors.numberOfParticipants && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.numberOfParticipants.message}
                    </p>
                  )}
                  </FormItem>
                );
              }}
            />

            <Textarea className="my-5" placeholder="What's the occassion?" />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
