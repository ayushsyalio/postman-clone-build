'use client'

import React from "react";
import { useDeleteCollection } from "../hooks/collection";
import { toast } from "sonner";
import Modal from "@/components/ui/modal";

const DeleteCollection = ({
  isModalOpen,
  setIsModalOpen,
  collectionId,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  collectionId: string;
}) => {
    const {mutateAsync, isPending} = useDeleteCollection(collectionId)
    const handleDelete = async ()=>{
        try {
            await mutateAsync()
            toast.success("Collection deleted successfully")
            setIsModalOpen(false)
        } catch (error) {
            console.error("Failed to delete collection")
            console.error("Failed to delete collection", error)
            
        }
    } 
  return (
    <Modal
    title="Delete collection"
    description="Are you sure want to delete this collection?"
    isOpen={isModalOpen}
    onClose={()=>setIsModalOpen(false)}
    onSubmit={handleDelete}
    submitText={isPending ? "Deleting":"Delete"}
    submitVariant="destructive"
>
    <p className="text-sm text-zinc-500">
        Once deleted, all the data in this collection will be deleted permanently
    </p>

    </Modal>
  )
};

export default DeleteCollection;
