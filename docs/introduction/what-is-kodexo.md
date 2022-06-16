# What is Kodexo?

Kodexo is a back-end framework, based on Node.js and built entirely with TypeScript. It uses and exposes classes (OOP), many decorators and Functional Programming. Kodexo only exposes REST API endpoints and does not focus on distributing assets and/or views.

Today, the main HTTP engine is [tinyhttp](https://github.com/tinyhttp/tinyhttp) (full compat with Express). For everything related to the database, the library uses [Mikro-ORM](https://mikro-orm.io) and the `@kodexo/crud` module allows to generate routes on the fly based on the Mikro model.

Kodexo also integrates notions like ACL, Uploader, DTO validation & OpenAPI 3.1 documentation generation, allowing to have the minimum required to have a stable API and to start projects easily.

::: warning
Kodexo is currently in `dev` status. It is already adapted, largely tested and ready to be used in production, but be aware that the configuration and functionality are still under development and may change in the future.
:::

## Motivation

Nowadays, serverless and microservice are in fashion, that's a fact and we accept it. We are the first users of this kind of tools. The multiplication of nocode databases, serverless endpoints, GraphQL APIs, gRPC, CRQS usage, event-driven architecture etc., all this leads today to know a multitude of tools to obtain more or less the same thing: the exposure of data from a data source and roughly the modification of the data through predetermined actions

We started from the principle that REST is a robust and recognized solution that may be based on an old-fashioned Web, but that allows to put a multitude of endpoints online quickly. These endpoints are easily testable, understandable by the majority of users, cross-platform, cross-language with libraries that have been successfully proven. That's why we still believe in the REST "monolith" as the foundation of our projects.

There are many libraries that offer many TS decorators, some of which have become standards/references in the Javascript ecosystem. Aware that we don't want to reinvent the wheel, we have been inspired a lot by the work of their teams and we are very grateful to projects like [Nest](https://nestjs.com), [Ts.ED](https://tsed.io/) or [FoalTS](https://foalts.org/). Kodexo wants to follow the same logic and accelerate developer productivity while remaining simple to use with standards and unifying the way of working on an API. We want to remove as many boilerplates as possible and put the business logic back at the heart of the developer's work.

## Objectives & Final output

When building an API with Kodexo, the goal is simple: get a Docker container that contains a stable software brick that can be connected to one or more data sources quickly. Deployable on any PaaS/K8s that supports Docker (or more simply via docker compose), the idea is to get a build of your API image at each of your pushes through your favorite CI.

Note that Docker encapsulation is really not mandatory, but we are pushing in this direction for more simplicity in deployments and ease of use to make cross-providing.
