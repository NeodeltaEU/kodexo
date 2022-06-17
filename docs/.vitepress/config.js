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
      text: "Tutorial (CRUD version)",
      collapsible: true,
      items: [
        { text: "First steps", link: "/tutorial-crud/first-steps" },
        { text: "Create first Entity", link: "/tutorial-crud/create-first-entity" },
        { text: "Create related Service", link: "/tutorial-crud/create-related-service" },
        { text: "Register to Module", link: "/tutorial-crud/register-to-module" },
        { text: "Register the Feature", link: "/tutorial-crud/register-the-feature" },
        { text: "Create first Controller", link: "/tutorial-crud/create-first-controller" },
        { text: "Activate CRUD Routes", link: "/tutorial-crud/activate-crud-routes" },
        { text: "Validate Inputs: DTO", link: "/tutorial-crud/validate-inputs" },
        { text: "Serialize Outputs", link: "/tutorial-crud/serialize-outputs" },
        { text: "Give it a try", link: "/tutorial-crud/give-it-a-try" },
      ],
    },

    {
      text: "Common Project Architecture",
      collapsible: true,
      items: [
        { text: "Global architecture", link: "/project-architecture/global-architecture" },
        {
          text: "Convention over configuration",
          link: "/project-architecture/convention-over-configuration",
        },
        { text: "Configuration", link: "/project-architecture/configuration" },
        { text: "Module", link: "/project-architecture/module" },
        { text: "Controller", link: "/project-architecture/controller" },
        { text: "Service", link: "/project-architecture/service" },
        { text: "Dependency Injection", link: "/project-architecture/dependency-injection" },
        { text: "Hooks", link: "/project-architecture/hooks" },
        { text: "Error handling", link: "/project-architecture/error-handling" },
      ],
    },

    {
      text: "Thematic Guides",
      collapsible: true,
      items: [
        { text: "Validations & Sanitizations", link: "/thematic-guides/validation-sanitization" },
        { text: "Serialization", link: "/thematic-guides/serialization" },
        { text: "Middlewares & Interceptors", link: "/thematic-guides/middlewares-interceptors" },
        { text: "CRUD & MikroORM", link: "/thematic-guides/crud-mikro-orm" },
        { text: "ACL", link: "/thematic-guides/acl" },
        { text: "OpenAPI", link: "/thematic-guides/open-api" },
        { text: "Files & Upload", link: "/thematic-guides/files-upload" },
        { text: "Firebase", link: "/thematic-guides/firebase" },
      ],
    },

    {
      text: "Usage Guides",
      collapsible: true,
      items: [
        { text: "CRUD Endpoints", link: "/usages-guides/crud-endpoints" },
        { text: "Filtering", link: "/usages-guides/filtering" },
        { text: "Pagination & Ordering", link: "/usages-guides/pagination-ordering" },
        { text: "OpenAPI", link: "/usages-guides/openapi" },
      ],
    },
  ];
}
