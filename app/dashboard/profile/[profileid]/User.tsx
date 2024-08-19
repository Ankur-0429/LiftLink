"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AvatarImage } from "@radix-ui/react-avatar";
import moment from "moment";
import { signOut, useSession } from "next-auth/react";

export interface UserInterface {
  name: string;
  image: string;
  createdAt: Date;
  numOwnedChannels: number;
  numJoinedChannels: number;
}

const User = ({
  name,
  image,
  numJoinedChannels,
  numOwnedChannels,
  createdAt,
  id,
}: UserInterface & {
  id: string;
}) => {
  const session = useSession();
  return (
    <div className="p-3 px-6">
      <div className="flex gap-x-2 items-center mt-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="leading-none">
          <p className="font-semibold text-2xl">{name}</p>
          <span className="text-muted-foreground text-lg">
            Joined {moment(createdAt).fromNow()} ago
          </span>
        </div>
      </div>
      <div className="mt-6 ml-24">
        <div className="flex items-start gap-x-6">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold">{numJoinedChannels}</span>
            <p className="text-muted-foreground">Channels Joined</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold">{numOwnedChannels}</span>
            <p className="text-muted-foreground">Channels Owned</p>
          </div>
        </div>
      </div>
      {session.data?.user?.id === id && (
        <div className="ml-24 mt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>

          <Button variant="destructive">Delete your account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. This will permanently delete your account, channels, and messages</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={async () => {
                  const res = await fetch("/api/profile/" + id, {
                    method: "DELETE"
                  });
                  if (res.ok) {
                    signOut();
                  }
                }}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default User;
