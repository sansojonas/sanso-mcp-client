import { getShortcutKeyList, Shortcuts } from "lib/keyboard-shortcuts";
import { PropsWithChildren } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "ui/dialog";

interface KeyboardShortcutsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsPopup({
  open,
  onOpenChange,
  children,
}: PropsWithChildren<KeyboardShortcutsPopupProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="md:max-w-3xl">
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogDescription />
        <div className="grid grid-cols-2 gap-5">
          {Object.entries(Shortcuts).map(([key, shortcut]) => (
            <div
              key={key}
              className="flex items-center gap-2 w-full text-sm px-2"
            >
              <p>{shortcut.description}</p>
              <div className="flex-1" />
              {getShortcutKeyList(shortcut).map((key) => {
                return (
                  <div
                    key={key}
                    className="p-1.5 text-xs border min-w-8 min-h-8 flex items-center justify-center rounded-md bg-muted"
                  >
                    <span>{key}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
