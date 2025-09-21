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

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      title: "Chat agent - A lightweight chat agent inspired by Siena AI",
      meta: [
        {
          name: "description",
          content: "A lightweight chat agent inspired by Siena AI",
        },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content:
            "Chat agent Spectrum - A lightweight chat agent inspired by Siena AI",
        },
        {
          name: "twitter:description",
          content: "A lightweight chat agent inspired by Siena AI",
        },
        {
          name: "twitter:image",
          content: "",
        },
        { property: "og:type", content: "website" },
        {
          property: "og:title",
          content: "Chat agent - A lightweight chat agent inspired by Siena AI",
        },
        {
          property: "og:description",
          content: "A lightweight chat agent inspired by Siena AI",
        },
        { property: "og:url", content: "https://chat-agent-joshua.vercel.app" },
        {
          property: "og:image",
          content: "",
        },
        { name: "theme-color", content: "#0a0a0a" },
      ],
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
