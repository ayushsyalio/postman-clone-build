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
    
      <Header user={user!}/>
      <main className='max-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] flex flex-1 overflow-hidden'>
        <div className="flex h-full w-full">
          
          <div className="w-12 border-r border-zinc-800 bg-zinc-900">
            Tabbed left
          </div>
          <div className="flex-1 bg-zinc-950">
            {children}
          </div>
        </div>
      </main>
    </>
  );
};

export default RootLayout;
