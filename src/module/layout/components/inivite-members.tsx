import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import { Copy, LinkIcon, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { useWorkspaceStore } from "../store";
import {
  useGenerateWorkspaceInvite,
  useGetworkspaceMembers,
} from "@/module/invites/hooks/invite";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const InviteMember = () => {
  const [inviteLink, setInviteLink] = useState("");
  const { selectedWorkspace } = useWorkspaceStore();
  const { mutateAsync, isPending } = useGenerateWorkspaceInvite(
    selectedWorkspace?.id || ""
  );

  const { data: workspaceMember, isLoading } = useGetworkspaceMembers(
    selectedWorkspace?.id || ""
  );

  console.log("Selected workspace in invite member:", workspaceMember);

  const generateInviteLink = async () => {
    if (!selectedWorkspace?.id) {
      toast.error("Please select a workspace first");
      return;
    }
    try {
      const response = await mutateAsync();
      setInviteLink(response);
      toast.success("Invite link generated successfully");
    } catch (error) {
      toast.error("Failed to generate invite link");
    }
  };

  const copyToClipboard = async () => {
    if (inviteLink) {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Invite link copied to clipboard");
    }
  };

  return (
    <DropdownMenu>
      <Hint label="Invite Member">
        <DropdownMenuTrigger asChild>
          <Button className="border border-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 hover:text-emerald-300">
            <UserPlus className="size-4 text-emerald-400" />
          </Button>
        </DropdownMenuTrigger>
      </Hint>
      <DropdownMenuContent className="w-80 rounded-xl" align="end">
        <div className="p-4">
          <DropdownMenuLabel>
            Invite to {selectedWorkspace?.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator/>

          {/* Members avatar  */}
          <div className="flex -space-x-2 overflow-hidden mb-3">
            {isLoading?(
                <p className="text-xs text-muted-foreground">Loading Members...</p>
            ):(
                workspaceMember?.map((member)=>(
                    <Hint key={member.id} label={member.user.name || "Unknown User"}>
                        <Avatar className="border-2 border-background size-8 mt-2">
                            <AvatarImage src={member.user.image || ""}/>
                            <AvatarFallback>
                                {member.user.name?.charAt(0) || "?"}

                            </AvatarFallback>
                        </Avatar>
                    </Hint>
                ))
            )}
          </div>
          {/* Invite link input  */}
          <div className="flex gap-2 items-center">
            <Input 
            value={inviteLink}
            placeholder="Generate an invite link..."
            readOnly
            />
            <Button
            variant='outline'
            size='icon'
            onClick={copyToClipboard}
            disabled={!inviteLink}
            >
                <Copy className="h-4 w-4"/>
            </Button>
          </div>

          {/* Generate button  */}
          <Button
          className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          onClick={generateInviteLink}
          disabled={isPending}
          >
            <LinkIcon/>
            {isPending?'Generating...' :'Generate link'}
          </Button>



        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InviteMember;
