"use client";
import { SidebarProvider } from "ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { AppHeader } from "@/components/layouts/app-header";
import { KeyboardShortcutsPopup } from "@/components/keyboard-shortcuts-popup";
import { ChatPreferencesPopup } from "@/components/chat-preferences-popup";
import { appStore } from "../store";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";
import { isShortcutEvent, Shortcuts } from "@/lib/keyboard-shortcuts";
export default function ChatLayout({
  children,
}: { children: React.ReactNode }) {
  const [openChatPreferences, openShortcutsPopup, appStoreMutate] = appStore(
    useShallow((state) => [
      state.openChatPreferences,
      state.openShortcutsPopup,
      state.mutate,
    ]),
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isShortcutPopupEvent = isShortcutEvent(
        e,
        Shortcuts.openShortcutsPopup,
      );
      const isChatPreferencesEvent = isShortcutEvent(
        e,
        Shortcuts.openChatPreferences,
      );
      if (!isShortcutPopupEvent && !isChatPreferencesEvent) return;
      e.preventDefault();
      e.stopPropagation();
      if (isShortcutPopupEvent) {
        appStoreMutate({ openShortcutsPopup: true });
      }
      if (isChatPreferencesEvent) {
        appStoreMutate({ openChatPreferences: true });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative w-full flex flex-col h-screen">
        <AppHeader />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
      <KeyboardShortcutsPopup
        open={openShortcutsPopup}
        onOpenChange={(open) => appStoreMutate({ openShortcutsPopup: open })}
      />
      <ChatPreferencesPopup
        open={openChatPreferences}
        onOpenChange={(open) => appStoreMutate({ openChatPreferences: open })}
      />
    </SidebarProvider>
  );
}
