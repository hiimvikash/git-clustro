"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {ActionTooltip} from "@/components/tooltip-action"
 
interface NIProps{
id: string;
image : string;
name : string;
}
export const NavigationItem = ({id, image, name }: NIProps) => {
    const params = useParams();
    const router = useRouter();

    return ( 
    <ActionTooltip label={name} side="right" align="center">
        <button onClick={()=>{router.push(`/servers/${id}`)}} className="group relative flex items-center">
            <div className={
                cn( "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                        params?.serverId !== id && "group-hover:h-[20px]",
                        params?.serverId === id ? "h-[36px]" : "h-[8px]"
                )}
            />

            <div className={
                cn( "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
                )}>
                    <Image fill src={image.split("@")[1]} alt="server"/> 
                    
            </div>


        </button>

    </ActionTooltip>
        
    );
}