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
import LocationInput from "@/components/locationInput";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { useState } from "react";

const CreatePost = () => {
  const session = useSession();

  const [fromLocation, setFromLocation] = useState(
    null as null | { latitude: number; longitude: number; address: string }
  );
  const [toLocation, setToLocation] = useState(
    null as null | { latitude: number; longitude: number; address: string }
  );
  const [dateTime, setDateTime] = useState(undefined as undefined | Date);
  const [womenOnly, setWomenOnly] = useState(false);
  const [participants, setParticipants] = useState("");
  const [occasion, setOccasion] = useState("");
  const [open, setOpen] = useState(false);
  const isFormComplete: boolean =
    !!fromLocation &&
    !!toLocation &&
    !!dateTime &&
    !!participants &&
    !!occasion;

  const submitCarpool = async () => {
    const data = {
      dateTime,
      womenOnly,
      participants,
      occasion,
      fromLocation,
      toLocation,
    };
    if (
      !!data.fromLocation &&
      !!data.toLocation &&
      !!data.dateTime &&
      !!data.participants &&
      !!data.occasion &&
      session.data?.user?.id
    ) {
      const channel = {
        departure: data.dateTime,
        from: data.fromLocation,
        to: data.toLocation,
        participants: parseInt(data.participants),
        womenOnly,
        description: data.occasion,
      };

      await fetch("/api/channel", {
        method: "POST",
        body: JSON.stringify(channel),
      });

      setOpen(false)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Carpool</DialogTitle>
          <DialogDescription>
            We won&apos;t share these exact locations to other users
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <LocationInput
            onStatusChange={setFromLocation}
            placeholder="Where to Carpool?"
            icon={<MapPin size={15} />}
          />
          <div className="ml-6 w-[3px] bg-gray-300 h-[20px]" />
          <LocationInput
            onStatusChange={setToLocation}
            placeholder="Where are you going?"
            icon={<Search size={15} />}
          />
        </div>
        <DateTimePicker
          hourCycle={12}
          onChange={setDateTime}
          value={dateTime}
        />
        <div className="items-top flex space-x-2 ml-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="women-only-mode"
              checked={womenOnly}
              onCheckedChange={setWomenOnly}
            />
            <Label htmlFor="women-only-mode">Women Only</Label>
          </div>
        </div>

        <Input
          placeholder="Number of participants"
          type="number"
          value={participants}
          onChange={(e) => {
            setParticipants(e.target.value);
          }}
          min={1}
          max={8}
        />

        <Textarea
          className="my-5"
          placeholder="What's the occassion?"
          value={occasion}
          onChange={(e) => {
            setOccasion(e.target.value);
          }}
        />
        <DialogFooter>
          <Button onClick={submitCarpool} disabled={!isFormComplete}>Create Carpool</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
