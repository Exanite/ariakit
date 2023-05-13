import * as React from "react";
import * as Ariakit from "@ariakit/react";

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
}

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ open, onClose, ...props }, ref) => {
    const dialog = Ariakit.useDialogStore({
      open,
      setOpen: (open) => !open && onClose?.(),
    });
    return (
      <Ariakit.Dialog
        {...props}
        ref={ref}
        store={dialog}
        backdrop={<div className="backdrop" />}
      />
    );
  }
);

export { DialogHeading, DialogDismiss } from "@ariakit/react";
