# Convention over Configuration

We usually prefer file naming/organization conventions. You don't have to follow our standards, but we recommend them to standardize your applications and to ensure that developers don't have to learn your methodology in addition to a framework.

## Files organization

We won't make a long speech, this is what our file organization looks like:

```
my-project
├── src
|   ├── common
|   |   ├── dto
|   |   |   └── common.dto.ts
|   |   ├── entities
|   |   |   └── common.entity.ts
|   |   ├── middlewares
|   |   |   └── auth.middleware.ts
|   |   ├── services
|   |   |   └── notifications.service.ts
|   |   └── common.module.ts
|   ├── features
|   |   └── my-feature
|   |       ├── dto
|   |       |   ├── common-my-feature.dto.ts
|   |       |   ├── create-my-feature.dto.ts
|   |       |   └── update-my-feature.dto.ts
|   |       ├── entities                          # Related MikroORM entities
|   |       |   └── my-feature.entity.ts
|   |       ├── serializations
|   |       |   └── my-feature.serialized.ts
|   |       ├── services
|   |       |   └── my-feature.service.ts
|   |       ├── subscribers                       # MikroORM Subscribers
|   |       |   └── my-feature.subscriber.ts
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

## Naming variables & classes

### Controller

| # | Rule |
| - | ---- |
| 1 | Apply PascalCase syntax |
| 2 | Name of the feature, followed by `Controller` |
| 3 | Plural if an entity is involved |

Examples:
```typescript
// Entities
class HousesController {}
class CarsController {}
class MailsController {}

// Not entities but single feature
class AuthController {}
```

### Service

| # | Rule |
| - | ---- |
| 1 | Apply PascalCase syntax |
| 2 | Name of the feature, followed by `Service` |
| 3 | Plural if an entity is involved |

```typescript
// Entities
class HousesService {}
class CarsService {}
class MailsService {}

// Not entities but single feature
class AuthService {}
```

### Module

| # | Rule |
| - | ---- |
| 1 | Apply PascalCase syntax |
| 2 | Name of the feature, followed by `Module` |
| 3 | Plural if an entity is involved |

```typescript
// Entities
class HousesModule {}
class CarsModule {}
class MailsModule {}

// Not entities but single feature
class AuthModule {}
```

## Linter & VSCode Extensions

In our projects, we have implemented `eslint` with a particular configuration of prettier, very opiniated. We invite you to use the extensions on Vscode :
- ESLint
- Prettier - Code Formatter
- EditorConfig for VS Code
