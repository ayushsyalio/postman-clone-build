"use server";


import { currentUser } from "@/module/authentication/actions";
import Header from "@/module/layout/components/Header";
import { initializeworkspace } from "@/module/workspace/actions";
import React from "react";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const workspace = await initializeworkspace() 
  const user = await currentUser()
  console.log(workspace)
  return (
    <>
    {/* @ts-ignore */}
      <Header user={user}/>
      <main className="max-h-[calc(100vh-4rem) h-[calc(100vh-4rem)]] flex flex-1 overflow-hidden">
        <div className="flex h-full w-full bg-zinc-700">
          <div className="w-12 border-zinc-800">
            tabbbed left panel
          </div>

          <div className="flex-1 bg-zinc-700">
            {children}

          </div>
        </div>
      </main>
    </>
  );
};

export default RootLayout;
