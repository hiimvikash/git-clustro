import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils";

interface UserAvatorProps  {
    src?: string;
    className?: string;
}
export const UserAvator = ({src, className}: UserAvatorProps) => {
    return ( 
        <Avatar className={cn(
            "h-7 w-7 md:h-10 md:w-10",
            className
        )}>
            <AvatarImage src={src}/>         
        </Avatar>
    );
}