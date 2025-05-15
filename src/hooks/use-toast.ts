
import * as React from "react";
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";

// Define toast context types
type ToastType = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

type ToasterToast = ToastType;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
      id: string;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Side effects - clear timeouts
      if (toastId) {
        if (toastTimeouts.has(toastId)) {
          clearTimeout(toastTimeouts.get(toastId));
          toastTimeouts.delete(toastId);
        }
      } else {
        for (const [id, timeout] of toastTimeouts.entries()) {
          clearTimeout(timeout);
          toastTimeouts.delete(id);
        }
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const ToastContext = React.createContext<{
  toasts: ToasterToast[];
  toast: (props: Omit<ToasterToast, "id" | "open">) => string;
  dismiss: (toastId?: string) => void;
  update: (id: string, props: Omit<ToasterToast, "id">) => void;
}>({
  toasts: [],
  toast: () => "",
  dismiss: () => {},
  update: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, {
    toasts: [],
  });

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.open || !toast.id) return;

      if (toastTimeouts.has(toast.id)) return;

      const timeout = setTimeout(() => {
        dispatch({
          type: "REMOVE_TOAST",
          toastId: toast.id,
        });
      }, TOAST_REMOVE_DELAY);

      toastTimeouts.set(toast.id, timeout);
    });
  }, [state.toasts]);

  const toast = React.useCallback((props: Omit<ToasterToast, "id" | "open">) => {
    const id = genId();

    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        open: true,
      },
    });

    return id;
  }, []);

  const update = React.useCallback((id: string, props: Omit<ToasterToast, "id">) => {
    dispatch({
      type: "UPDATE_TOAST",
      id,
      toast: props,
    });
  }, []);

  const dismiss = React.useCallback((toastId?: string) => {
    dispatch({
      type: "DISMISS_TOAST",
      toastId,
    });
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        toast,
        dismiss,
        update,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const { toast, dismiss, update, toasts } = React.useContext(ToastContext);
  
  return {
    toast,
    dismiss,
    update,
    toasts,
  };
}

export type { ToastType };
