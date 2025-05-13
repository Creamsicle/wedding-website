import NavigationMenu from "@/components/NavigationMenu";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="absolute w-full z-10">
        <NavigationMenu />
      </header>
      {children}
    </div>
  );
} 