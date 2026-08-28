import Navbar from "./Navbar";

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f5e9]">
      <Navbar />
      <main className="page-width py-8 md:py-12">
        {children}
      </main>
    </div>
  );
}