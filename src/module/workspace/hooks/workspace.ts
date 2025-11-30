import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkspaces, getWorkspaceById, getWorkspaces } from "../actions";

export function useWorkspaces(){
    return useQuery({
        queryKey:["workspaces"],
        queryFn:async ()=>getWorkspaces()
    })
}

export function useCreateworkspace(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:async (name:string)=>createWorkspaces(name),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["workspaces"]})
        }
    })
}

export function useGetworkspace(id:string){
    return useQuery({
        queryKey:["workspace", id],
        queryFn:async ()=>getWorkspaceById(id)
    })

}