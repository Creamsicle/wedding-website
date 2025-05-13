import SubpageNavigation from "@/components/SubpageNavigation";

export default function SubpagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SubpageNavigation />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 