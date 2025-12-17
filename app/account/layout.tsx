import SideNavigation from "../_components/SideNavigation";

export default function Layout({ children }: { children: React.JSX.Element }) {
  return (
    <div className="grid grid-cols-[16rem_1fr] h-full gap-12">
      <SideNavigation />
      <div>{children}</div>
    </div>
  );
}
