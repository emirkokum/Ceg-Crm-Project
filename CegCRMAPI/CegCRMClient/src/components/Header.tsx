import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-14 px-4 border-b bg-white shadow-sm">
      {/* Toggle Butonu: Sadece md altı görünür */}
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      <h1 className="text-xl font-semibold">CRM Paneli</h1>

      <div>{/* Kullanıcı avatarı, logout vs. buraya eklenebilir */}</div>
    </header>
  );
}
