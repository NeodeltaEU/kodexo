import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "en-US",
  title: "Kodexo",
  themeConfig: {
    nav: nav(),

    sidebar: sidebar(),
  },

  lastUpdated: true,

  vite: {
    server: {
      port: 4500,
    },
  },
});

function nav() {
  return [{ text: "Home", link: "/" }];
}

function sidebar() {
  return [
    {
      text: "Introduction",
      collapsible: true,
      items: [
        { text: "What is Kodexo?", link: "/introduction/what-is-kodexo" },
        { text: "Getting started", link: "/introduction/getting-started" },
      ],
    },
    {
      text: "Tutorial",
      collapsible: true,
      items: [
        { text: "First steps", link: "/tutorial/first-steps" },
        { text: "Create first Entity", link: "/tutorial/create-first-entity" },
        { text: "Create related Service", link: "/tutorial/create-related-service"},
        { text: "Register to Module", link: "/tutorial/register-to-module"},
        { text: "Create first Controller", link: "/tutorial/create-first-controller"},
        { text: "Activate CRUD Routes", link: "/tutorial/activate-crud-routes"},
        { text: "Validate inputs", link: "/tutorial/validate-inputs"},
        { text: "Serialize outputs", link: "/tutorial/serialize-outputs"},
        { text: "Register the feature", link: "/tutorial/register-the-feature"},
        { text: "Give it a try", link: "/tutorial/give-it-a-try"}
      ],
    },
    {
      text: "Project Architecture",
      collapsible: true,
      items: [
        { text: "Global architecture", link: "/project-architecture/global-architecture" },
        {
          text: "Convention over configuration",
          link: "/project-architecture/convention-over-configuration",
        },
        { text: "Configuration", link: "/project-architecture/configuration" },
      ],
    },
  ];
}
