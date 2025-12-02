import { Input } from '@/components/ui/input';
import Modal from '@/components/ui/modal';
import React, { useState } from 'react'
import { useCreateCollections } from '../hooks/collection';
import { toast } from 'sonner';

interface Props{
    workspaceId:string;
    isModalOpen:boolean;
    setIsModalOpen:(open:boolean)=>void;
}

const CreateCollection = ({workspaceId, isModalOpen, setIsModalOpen}:Props) => {
    const [name, setName] = useState("")
    const {mutateAsync, isPending} = useCreateCollections(workspaceId)

    const handleSubmit = async ()=>{
        if(!name.trim) return;

        try {
            await mutateAsync(name)
            toast.success("Collection created successfully")
            setName("")
            setIsModalOpen(false)
        } catch (error) {
            toast.error("failed to create collection")
            console.error("Failed to create collection", error)

            
        }

    }


  return (
    <Modal title='Add new collection'
    description='Add a new collection to organize your requests'
    isOpen={isModalOpen}
    onClose={()=>setIsModalOpen(false)}
    onSubmit={handleSubmit}
    submitText={isPending ? "Creating.." : "Create Collection"}
    submitVariant='default'
    >
        <div className='space-y-4'>
            <Input
            className='w-full p-2 border rounded'
            placeholder='Collection name...'
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />

        </div>

    </Modal>
  )
}

export default CreateCollection