export interface snackbarTypes {
  show: (message: string, options?: any, title?: string) => void;
  error: (message: string, options?: any, title?: string) => void;
  warning: (message: string, options?: any, title?: string) => void;
}
