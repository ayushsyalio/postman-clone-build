import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  EllipsisVertical,
  FilePlus,
  Folder,
  Loader,
  Trash,
} from "lucide-react";
import React, { useState } from "react";
import EditCollection from "./edit-collection";
import DeleteCollection from "./delete-collection";
import SaveRequestToCollectionModal from "./add-request-modal";
import { useGetAllRequestFromCollection, useSaveRequest } from "@/module/request/hooks/request";
import { REST_METHOD } from "@prisma/client";

import { isErrored } from "stream";
import { cn } from "@/lib/utils";
import DeleteRequest from "@/module/request/components/delete-request";
import { useRequestPlaygroundStore } from "@/module/request/store/useRequestStore";

interface Props {
  collection: {
    id: string;
    name: string;
    updatedAt: Date;
    workspaceId: string;
  },
  request:{
    id:string;
    name:string;
    method:REST_METHOD;
    url:string;
  }
}

const CollectionFolder = ({ collection }: Props) => {
  const [isCollapsed, setCollapsed] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);
 
  const [isDeleteReqOpen, setIsdDeleteReqOpen] = useState(false);
 const [isEditReqOpen, setIsEditReqOpen] = useState(false);

  const { data: requestData, isPending } = useGetAllRequestFromCollection(
    collection.id
  );

  const {openRequestTab} = useRequestPlaygroundStore();



  const requestColorMap: Record<REST_METHOD, string> = {
    [REST_METHOD.GET]: "text-green-500",
    [REST_METHOD.POST]: "text-blue-500",
    [REST_METHOD.PUT]: "text-yellow-500",
    [REST_METHOD.DELETE]: "text-red-500",
    [REST_METHOD.PATCH]: "text-orange-500",
  };

  const hasRequests = requestData && requestData.length > 0;

  return (
    <>
      <Collapsible
        open={isCollapsed}
        onOpenChange={setCollapsed}
        className="w-full"
      >
        <div className="flex flex-col w-full ">
          <div className="flex flex-row justify-center items-center p-2 flex-1 w-full hover:bg-zinc-900 rounded-md">
            <CollapsibleTrigger className="flex flex-row justify-center items-center space-x-2 flex-1">
              <div className="flex items-center space-x-1">
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                )}

                <Folder className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-zinc-200 capitalize">
                  {collection.name}
                </span>
              </div>
            </CollapsibleTrigger>
            <div className="flex flex-row justify-center items-center space-x-2">
              <FilePlus
                className="h-4 w-4 text-zinc-400 hover:text-indigo-400 cursor-pointer"
                onClick={() => setIsAddRequestOpen(true)}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-zinc-800 rounded">
                    <EllipsisVertical className="w-4 h-4 text-zinc-400 hover:text-indigo-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 flex flex-col justify-start items-start p-2">
                  <DropdownMenuItem
                    onClick={() => setIsAddRequestOpen(true)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex flex-row">
                      <div className="font-semibold flex justify-center items-center">
                        <FilePlus className="text-green-400 mr-2 w-4 h-4" />
                        Add Request
                      </div>
                      <span className="text-xs text-zinc-400 bg-zinc-700 px-1 rounded ">
                        ⌘A
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsEditOpen(true)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex flex-row ">
                      <div className="font-semibold flex justify-center items-center">
                        <Edit className="text-blue-400 mr-2 w-4 h-4" />
                        Edit
                      </div>
                      <span className="text-xs text-zinc-400 bg-zinc-700 px-1 rounded">
                        ⌘E
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsDeleteOpen(true)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex flex-row ">
                      <div className="font-semibold flex justify-center items-center">
                        <Trash className="text-red-500 mr-2 h-4 w-4" />
                        Delete
                      </div>
                      <span className="text-xs text-zinc-400 bg-zinc-700 px-1 rounded">
                        ⌘D
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <CollapsibleContent className="w-full ">
            {isPending ? (
              <div className="pl-8 py-2">
                <div className="flex items-center space-x-2">
                  <Loader size={16} className="text-indigo-500 animate-spin" />
                </div>
              </div>
            ) : isErrored ? (
              <div className="pl-8 py-2">
                <span className="text-xs text-red-400">
                  Failed to load request
                </span>
              </div>
            ) : hasRequests ? (
              <div>
                {requestData.map((request) => (
                  <div
                    key={request.id}
                    onClick={()=>openRequestTab(request)}

                    className="flex items-center justify-center py-2 px-3 hover:bg-zinc-900/50 rounded-md cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={cn(
                            "text-xs font-bold px-2 py-1 rounded",
                            requestColorMap[request.method],
                            "bg-zinc-800"
                          )}
                        >
                          {request.method}
                        </span>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm text-zinc-200 truncate font-medium">
                          {request.name || request.url}
                        </span>
                        {request.name && request.url && (
                          <span className="text-xs text-zinc-500 truncate">
                            {request.url}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-zinc-800 rounded">
                            <EllipsisVertical className="w-3 h-3 text-zinc-400" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-32">
                          <DropdownMenuItem onClick={()=>setIsEditOpen(true)}>
                            <Edit className="text-2 mr-2 w-3 h-3" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>setIsdDeleteReqOpen(true)}>
                            <Trash className="text-red-400 mr-2 w-3 h-3" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pl-8 py-2">
                <span className="text-xs text-zinc-500 italic">
                  No requests yet.
                </span>
              </div>
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>

      <SaveRequestToCollectionModal
        isModalOpen={isAddRequestOpen}
        setIsModalOpen={setIsAddRequestOpen}
        collectionId={collection.id}
      />

      <EditCollection
        isModalOpen={isEditOpen}
        setIsModalOpen={setIsEditOpen}
        collectionId={collection.id}
        initialName={collection.name}
      />
      <DeleteCollection
        isModalOpen={isDeleteOpen}
        setIsModalOpen={setIsDeleteOpen}
        collectionId={collection.id}
      />
      <DeleteRequest
      isModalOpen={isDeleteReqOpen}
      setIsModalOpen={setIsdDeleteReqOpen}
      requestId={collection.id}
      />
    </>
  );
};

export default CollectionFolder;
