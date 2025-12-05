'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addRequestToCollection, type Request, getAllRequestfromCollections, saveRequest, deleteRequest } from "../actions";

export function useAddRequestToCollection(collectionId:string){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (value:Request)=>addRequestToCollection(collectionId, value),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({queryKey:['requests', collectionId]})
            console.log(data)
        }
    })
}

export function useGetAllRequestFromCollection(collectionId:string){
    return useQuery({
        queryKey:["requests", collectionId],
        queryFn:async()=>getAllRequestfromCollections(collectionId)

    })
}

export function useSaveRequest(id:string){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async(value:Request)=>saveRequest(id, value),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({queryKey:["requests"]})
            console.log(data)
        }
    })
}
export function useDeleteReqfromCollection(requestId:string){
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn:async()=>deleteRequest(requestId),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({queryKey:["requests"]})
            console.log(data)

        }
    })
}