# Getting Started

Before we get started, you should know that there are two types of projects with Kodexo: Automated CRUD APIs and Classic APIs. In this part, we will see how to start a **CRUD API** quickly.

::: tip
Kodexo does not yet have a CLI that allows you to build a project from scratch. But in the future it is planned that you will be able to do so from a tool like this one. We will of course keep you informed.
:::

## Prerequisites

Make sure you have Git & Docker (via Docker Desktop if needed) installed on your machine. Kodexo works best with Node version 16 LTS. The minimum requirement is Node 14. 


## Installation

Run the following commands:

```bash
$ npm install -g degit
$ degit https://github.com/Uminily/kodexo-crud-starter my-crud-project
$ cd my-crud-project
$ npm install # or yarn
```

::: info
Why `degit` command?
It's just to reset the git configuration and avoid headaches to add your own repo (without the history) or an integration to a monorepo. You can use a simple `git clone` if you prefer not to install an additional dependency.
:::

Check that Docker is running and make sure that port 5432 (for postgre) is available. We will launch the container containing the database. If you already have a PostgreSQL database available, skip this step and go to the MikroORM configuration.
