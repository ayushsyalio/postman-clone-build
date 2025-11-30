"use client";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import { useWorkspaces } from "@/module/workspace/hooks/workspace";
import { Loader, Plus, User } from "lucide-react";
import { useWorkspaceStore } from "../store";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import CreateWorkspace from "./createWorkspace";

const Workspace = () => {
  const { data: workspaces, isLoading } = useWorkspaces();
  const { selectedWorkspace, setSelectedWorkspace } = useWorkspaceStore();
  const [isModalopen, setIsmodalOpen] = useState(false)

  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !selectedWorkspace) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces, selectedWorkspace, setSelectedWorkspace]);

  if (isLoading) {
    return <Loader className="animate-spin size-4 text-indigo-400" />;
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="font-semibold text-indigo-400">No workspace found</div>
    );
  }

  return (
    <>
      <Hint label="Change Workspace">
        <Select
          value={selectedWorkspace?.id}
          onValueChange={(id) => {
            const ws = workspaces.find((w) => w.id === id);
            if (ws) setSelectedWorkspace(ws);
          }}
        >
          <SelectTrigger className="border border-indigo-400 bg-indigo-400/10 hover:bg-indigo-400/20 text-indigo-400 hover:text-indigo-300 flex flex-row items-center space-x-1">
            <User className="size-4 text-indigo-400" />
            <span className="text-sm text-indigo-400 font-semibold">
              <SelectValue placeholder="select workspace" />
            </span>
          </SelectTrigger>

          <SelectContent>
            {workspaces.map((ws) => (
              <SelectItem key={ws.id} value={ws.id}>
                {ws.name}
              </SelectItem>
            ))}
            <Separator className="my-1 "/>
            <div className="p-2 flex flex-row justify-between items-center">
              <span className="font-semibold text-zinc-600">My workspaces
                <Button size="sm" variant={"outline"} onClick={()=>setIsmodalOpen(true)} className="m-2">
                  <Plus size={16} className="text-indigo-400" />

                </Button>
              </span>

            </div>
          </SelectContent>
        </Select>
      </Hint>
      <CreateWorkspace isModalOpen = {isModalopen} setIsModalOpen={setIsmodalOpen}/>
    </>
  );
};

export default Workspace;
