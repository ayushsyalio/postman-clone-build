'use client'

import React from "react";
import { useDeleteReqfromCollection } from "../hooks/request";
import { toast } from "sonner";
import Modal from "@/components/ui/modal";


const DeleteRequest = ({
  isModalOpen,
  setIsModalOpen,
  requestId,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  requestId:string;
}) => {
    const {mutateAsync, isPending} = useDeleteReqfromCollection(requestId)
    const handleDelete = async ()=>{
        try {
            await mutateAsync()
            toast.success("Request deleted successfully")
            setIsModalOpen(false)
        } catch (error) {
            console.error("Failed to delete request")
            console.error("Failed to delete request", error)
            
        }
    } 
  return (
    <Modal
    title="Delete request"
    description="Are you sure want to delete this request?"
    isOpen={isModalOpen}
    onClose={()=>setIsModalOpen(false)}
    onSubmit={handleDelete}
    submitText={isPending ? "Deleting":"Delete"}
    submitVariant="destructive"
>
    <p className="text-sm text-zinc-500">
        Once deleted, all the data in this request will be deleted permanently
    </p>

    </Modal>
  )
};

export default DeleteRequest;
