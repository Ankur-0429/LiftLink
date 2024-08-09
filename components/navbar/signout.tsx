"use client";

import { signOut } from "@/auth";
import { Button } from "../ui/button";

const NavigationSignOut = () => {
  return (
    <Button onClick={() => {
        signOut();
    }}>Sign out</Button>
  )
}

export default NavigationSignOut;