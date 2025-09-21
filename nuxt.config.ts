// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/ui", "shadcn-nuxt"],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE,
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  components: {
    dirs: [
      // Scan the default `components/` directory
      "~/components",

      // Optionally, scan other custom folders
      {
        path: "~/components/ui", // Components in `UI` folder can use `UIButton` or `UICard`
      },
    ],
  },
});
