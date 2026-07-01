import { useState } from "react";

export default function useSidebar() {
  const [open, setOpen] = useState<boolean>(false);

  const close =  () => setOpen(false);

  return {
    open,
    setOpen,
    toggle: () => setOpen(prev => !prev),
    close,
  };
}