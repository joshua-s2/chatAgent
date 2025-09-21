import type { snackbarTypes } from "./other/snackbarType";

declare module "#app" {
  interface NuxtApp {
    $snackbar: snackbarTypes;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $snackbar: snackbarTypes;
  }
}
