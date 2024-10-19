"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const HomePage = () => {
  const { data: user } = useSession();

  if (user) {
    return (
      <div className="flex flex-col gap-2">
        <p>{JSON.stringify(user)}</p>
        <button onClick={() => signOut()}>
          sign out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn("github")}
    >
      by github
    </button>
  )
}
 
export default HomePage;