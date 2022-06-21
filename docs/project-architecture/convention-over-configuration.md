# Convention over Configuration

We usually prefer file naming/organization conventions. You don't have to follow our standards, but we recommend them to standardize your applications and to ensure that developers don't have to learn your methodology in addition to a framework.

## Files organization

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

## Linter
