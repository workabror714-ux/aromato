import { TelegramProvider } from "@/components/miniapp/TelegramProvider";
import { MiniAppCartBar } from "@/components/miniapp/MiniAppCartBar";

export default function MiniAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TelegramProvider>
      <div className="min-h-screen bg-bg pb-24">{children}</div>
      <MiniAppCartBar />
    </TelegramProvider>
  );
}
