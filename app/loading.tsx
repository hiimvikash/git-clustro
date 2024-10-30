import { LoaderCircle } from "lucide-react";

const MainLoading = () => {
  return (
    <div className="h-full flex items-center justify-center animate-pulse">
      <LoaderCircle className="h-5 w-5 text-zinc-400 animate-spin" />
    </div>
  );
};

export default MainLoading;

