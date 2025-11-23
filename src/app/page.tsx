import { Button } from "@/components/ui/button";
import { currentUser } from "@/module/authentication/actions";
import UserButton from "@/module/authentication/components/user-button";


export default async function Home() {
  const user = await currentUser();
  return (
   <div className="flex flex-col items-center justify-center h-screen">
    <UserButton user={user}/>
   </div>
  );
}
