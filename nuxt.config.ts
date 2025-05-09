// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";


export default defineNuxtConfig({
  app: {
    head: {
      title: "Swiyu",
      meta: [
        { name: "description", content: "Swiyu" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  compatibilityDate: '2025-05-09',
  runtimeConfig: {
    public: {
      issuerURL: process.env.ISSUER_URL,
      issuerAPIKey: process.env.ISSUER_API_KEY,
      verifierURL: process.env.VERIFIER_URL,
      verifierAPIKey: process.env.VERIFIER_API_KEY,
    }
  },
  devtools: { enabled: true },
  modules: ['@nuxt/image'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
})
