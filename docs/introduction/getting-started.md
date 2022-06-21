# Getting Started

Before we get started, you should know that there are two types of projects with Kodexo: Automated CRUD APIs and Classic APIs. In this part, we will see how to start a **CRUD API** quickly.

::: info
Kodexo does not yet have a CLI that allows you to build a project from scratch. But in the future it is planned that you will be able to do so from a tool like this one. We will of course keep you informed.
:::

## Prerequisites

Make sure you have Git & Docker (via Docker Desktop if needed) installed on your machine. Kodexo works best with Node version 16 LTS. The minimum requirement is Node 14. 


## Installation

Run the following commands:

```bash
$ npx degit https://github.com/Uminily/kodexo-crud-starter my-crud-project
$ cd my-crud-project
$ npm install # or yarn
```

::: tip
Why `degit` command?
It's just to reset the git configuration and avoid headaches to add your own repo (without the history) or an integration to a monorepo. You can use a simple `git clone` if you prefer not to install or use an additional dependency.
:::

Now, your project is almost ready for use and should look like this:

```
my-crud-project
├── src
|   ├── features
|   |   └── my-feature
|   |       ├── dto
|   |       |   ├── common-my-feature.dto.ts
|   |       |   ├── create-my-feature.dto.ts
|   |       |   └── update-my-feature.dto.ts
|   |       ├── entities
|   |       |   └── my-feature.entity.ts
|   |       ├── serializations
|   |       |   └── my-feature.serialized.ts
|   |       ├── services
|   |       |   └── my-feature.service.ts
|   |       ├── my-feature.module.ts
|   |       └── my-feature.controller.ts
|   ├── config.ts
|   ├── server.ts
|   ├── start.ts
|   └── starter-crud.module.ts
├── .editorconfig
├── .eslintrc.js
├── .gitignore
├── .prettierignore
├── .prettierrc.js
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

This is the bare minimum for your Kodexo API CRUD project to work properly. Let's see what the project is made of:

- `src/features`: rather than making a more or less classical MVC model, we prefer to adopt a Component first model, especially on the back-end. It is up to the developer to sort out the business part upstream to create a `feature` per functional part of the project.
  - `src/features/my-feature`: this is the folder where you will create your feature, we recommend specifying feature names in the plural (example: users, cars, houses).
    - `src/features/my-feature/dto`: this is the folder where you will create your DTOs mainly for input data.
    - `src/features/my-feature/entities`: this is the folder where you will create your entities, we will have to register them on MikroORM & setup informations about OpenAPI.
    - `src/features/my-feature/serializations`: this is the folder where you will create your serialized entities for output data. They will also be used for the description of the results on OpenAPI.
    - `src/features/my-feature/services/my-feature.service.ts`: a CRUD feature controller service is required. It implements all the necessary methods to make the default routes work.
    - `src/features/my-feature/my-feature.module.ts`: the module of a feature references all the services and other injectables (middleware etc), this is a central part of Kodexo in the dependency injection.
    - `src/features/my-feature/my-feature.controller.ts`: the controller is the entry point, it is the one that exposes the endpoints to the world and on which we set the necessary security to access the methods of the service.
- `src/config.ts`: this is the configuration file for the server.
- `src/server.ts`: this is the main file of the server, this is where you can run scripts before or after the server is launched.
- `src/start.ts`: this is the entry point of the server, it is the one that will start the server.
- `src/starter-crud.module.ts`: this is the app module, it registers all basic modules and dependencies.


## Setup

### Start database locally 

Check that Docker is running and **make sure that port 5432 (for postgre) is available**. We will launch the container containing the database. If you already have a PostgreSQL database available, skip this step and go to the MikroORM configuration.

We can start the database with the following command:

```bash
$ docker-compose up -d
```

### Start development server

We will now start the server: 

```bash
$ npm run dev # or yarn dev
```

And that's it. Your development server is running.

::: tip
The development server looks at all your files and compiles/builds on the fly and reloads all your code changes. No need to restart the server each time, the hot reload takes care of that for you.
:::

Go to localhost:3000 to see the application, normally your API should return a 404 error which is totally expected since you don't have any route defined on the default route.

::: warning
If you already have an application that uses port 3000, you can go to the `config.ts` file. Just change the `port` variable to whatever you want.
:::
