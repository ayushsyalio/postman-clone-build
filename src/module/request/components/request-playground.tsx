"use client";

import React, { useState } from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { useSaveRequest } from "../hooks/request";
import { Unplug } from "lucide-react";
import TabBar from "./tab-bar";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import RequestEditor from "./request-editor";

const PlaygroundPage = () => {
  const { tabs, activeTabId, addTab } = useRequestPlaygroundStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const { mutateAsync, isPending } = useSaveRequest(activeTab?.requestId!);
  const [saveModal, setShowSaveModal] = useState(false);

  useHotkeys(
    "ctrl+g, meta+shift+g",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      addTab();
      toast.success("New Request Tab Created");
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    },
    []
  );

  if (!activeTab) {
    return (
      <div className="flex space-y-4 flex-col h-full items-center justify-center">
        <div className="flex flex-col justify-center items-center h-40 w-40  rounded-full bg-zinc-800">
          <Unplug size={80} className="text-indigo-500 border-zinc-700" />
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center gap-8">
            <kbd
              className="px-2 py-1 bg-zinc-800 text-indigo-400 text-sm rounded
              border-zinc-500"
            >
              Ctrl+G
            </kbd>
            <span className="text-zinc-400 font-semibold">New Request</span>
          </div>

          <div className="flex justify-between items-center gap-8">
            <kbd className="px-2 py-1 bg-zinc-800 text-indigo-400 text-sm rounded border-zinc-500">
              Ctrl+S
            </kbd>
            <span className="text-zinc-400 font-semibold">Save Request</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <TabBar />
      <div className="flex-1 overflow-auto">
        <RequestEditor/>

      </div>
    </div>
  );
};

export default PlaygroundPage;
