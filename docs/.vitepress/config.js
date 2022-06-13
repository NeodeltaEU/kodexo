import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'Kodexo',
  themeConfig: {
    nav: nav(),

    sidebar: sidebar(),
  }
})

function nav() {
  return [
    { text: 'Home', link: '/' }
  ]
}

function sidebar() {
  return [
    {
      text: 'Introduction',
      collapsible: true,
      items: [
        {text: 'What is Kodexo?', link: '/introduction/what-is-kodexo'},
        {text: 'Getting started', link: '/getting-started'},
      ]
    }
  ]
}
