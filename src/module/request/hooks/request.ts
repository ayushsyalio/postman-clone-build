'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addRequestToCollection, type Request, getAllRequestfromCollections, saveRequest, deleteRequest, run } from "../actions";
import { useRequestPlaygroundStore } from "../store/useRequestStore";

export function useAddRequestToCollection(collectionId:string){
    const {updateTabfromSavedRequest, activeTabId } = useRequestPlaygroundStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (value:Request)=>addRequestToCollection(collectionId, value),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({queryKey:['requests', collectionId]})
            //@ts-expect-error
            updateTabfromSavedRequest(activeTabId!, data)
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
    const {updateTabfromSavedRequest, activeTabId } = useRequestPlaygroundStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async(value:Request)=>saveRequest(id, value),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({queryKey:["requests"]})
            //@ts-expect-error
            updateTabfromSavedRequest(activeTabId!, data)
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

export function useRunRequest(requestId:string){
    const queryClient = useQueryClient();
    const {setResponseViewerData} = useRequestPlaygroundStore();
    
    return useMutation({
        mutationFn:async()=>await run(requestId),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({queryKey:['requests']});
            // @ts-ignore 
            setResponseViewerData(data);
        }
    })
}