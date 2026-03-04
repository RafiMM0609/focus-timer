// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  app: {
    head: {
      title: 'FocusFlow — Timer',
      meta: [
        { name: 'description', content: 'Boost your productivity with FocusFlow — Pomodoro, 52/17, Custom & Flow modes.' },
        { name: 'theme-color', content: '#FAFF00' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap' },
      ],
    },
  },
})
