// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from "path";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      issuerURL: process.env.ISSUER_URL,
      issuerAPIKey: process.env.ISSUER_API_KEY,
      verifierURL: process.env.VERIFIER_URL,
      verifierAPIKey: process.env.VERIFIER_API_KEY,
    }
  },
  devtools: { enabled: true },
  modules: [
      '@nuxtjs/tailwindcss'
  ],
  alias: {
    "@": resolve(__dirname, "/")
  },
  css: ["~/assets/main.scss"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
