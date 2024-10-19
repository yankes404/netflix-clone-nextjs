"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserButton } from "./features/auth/components/user-button";
import { signIn } from "next-auth/react";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex gap-4">
        <Button variant="primary">
          Primary
        </Button>
        <Button variant="foreground">
          Foreground
        </Button>
        <Button variant="outline">
          Outline
        </Button>
        <Button variant="secondary">
          Secondary
        </Button>
      </div>
      <Input placeholder="Test" />
      <div className="flex justify-end">
        <UserButton />
      </div>
      <button onClick={() => signIn("github")}>
        login
      </button>
    </div>
  )
}
 
export default HomePage;