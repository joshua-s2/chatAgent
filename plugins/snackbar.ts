import { toast } from "vue-sonner";

export default defineNuxtPlugin((nuxtApp) => {
  const show = (
    message: string,
    options?: {
      description: string;
      action: {
        label: string;
        onClick: () => void;
      };
    },
    title?: string
  ) => {
    if (!toast) {
      console.error(
        "Toast function is undefined. Please verify the 'useToast' setup."
      );
      return;
    }

    toast.success(message, {
      ...options,
      style: { textTransform: "capitalize" },
    });
  };

  const error = (
    message: string,
    options?: {
      description: string;
      action: {
        label: string;
        onClick: () => void;
      };
    },
    title?: string
  ) => {
    if (!toast) {
      console.error(
        "Toast function is undefined. Please verify the 'useToast' setup."
      );
      return;
    }
    toast.error(message, {
      ...options,
      style: { textTransform: "capitalize" },
    });
  };

  const warning = (
    message: string,
    options?: {
      description: string;
      action: {
        label: string;
        onClick: () => void;
      };
    },
    title?: string
  ) => {
    if (!toast) {
      console.error(
        "Toast function is undefined. Please verify the 'useToast' setup."
      );
      return;
    }
    toast.warning(message, {
      ...options,
      style: { textTransform: "capitalize" },
    });
  };

  nuxtApp.provide("snackbar", {
    show,
    error,
    warning,
  });
});
