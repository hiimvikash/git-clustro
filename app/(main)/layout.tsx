import NavigationSideBar from "@/components/navigation/navigation-sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // MainLayoutOuterDiv - MLOD
    <div className="h-full">
        {/*SonDiv1 - SD1 */}
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSideBar/>
      </div>
      
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
