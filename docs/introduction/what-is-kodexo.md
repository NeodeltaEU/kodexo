# What is Kodexo?

Kodexo is a back-end framework, based on Node.js and built entirely with TypeScript. It uses and exposes classes (OOP), many decorators and Functional Programming

Today, the main HTTP engine is tinyhttp. For everything related to the database, the library uses Mikro-ORM and the `@kodexo/crud` module allows to generate routes on the fly based on the Mikro model.

Kodexo also integrates a notion of ACL, Uploader, DTO validation & OpenAPI 3.1 documentation generation allowing to have the minimum required to have a stable API and to start projects easily.

::: warning
Kodexo is currently in `dev` status. It is already suitable & ready for production use, but config & features are still in development and might change in future.
:::

## Motivation

