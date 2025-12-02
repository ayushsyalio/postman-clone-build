import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCollection, deleteCollections, getCollections, editCollections } from "../actions";

export function useCollections(workspaceId:string){
    return useQuery({
        queryKey:['collections', workspaceId],
        queryFn:async()=>getCollections(workspaceId)
    })
}

export function useCreateCollections(workspaceId:string){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async(name:string)=>createCollection(workspaceId, name),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["collections", workspaceId]})
        }

       
    })
}

export function useDeleteCollection(collectionId:string){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:async()=>deleteCollections(collectionId),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["collections"]})
        }
    })

}

export function useEditCollection(collectionId:string, name:string){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:async()=>editCollections(collectionId, name),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["collections"]})
        }

    })
}