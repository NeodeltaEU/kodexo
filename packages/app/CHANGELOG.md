# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-dev.2](https://github.com/Uminily/kodexo/compare/v0.1.2...v1.0.0-dev.2) (2022-05-08)


### Bug Fixes

* **app:** add cors options for x-query-schema ([ece5259](https://github.com/Uminily/kodexo/commit/ece525907daa57cce05b3978f5059fbcc0f2e700))
* **app:** add logger for providers loading ([4182bc1](https://github.com/Uminily/kodexo/commit/4182bc19175389b095a9b7af1dca9b1692f4ec34))
* **app:** credentials & cookies cors options ([485414d](https://github.com/Uminily/kodexo/commit/485414d4294cb49f7ce2b261495c7e0cbf815434))
* **app:** exposed correct headers from cors ([b9b9bec](https://github.com/Uminily/kodexo/commit/b9b9bec59d30633e323147ac475af591bf49ddfa))
* **app:** forget appProvidersService exports ([112cae4](https://github.com/Uminily/kodexo/commit/112cae441ea4c1b5f665c090457c84474eed0d87))
* **app:** injector from package injection ([c3b99d4](https://github.com/Uminily/kodexo/commit/c3b99d4b94d769b45cfcf35fe8a8780b7a3fe244))
* **app:** method lowercasing ([c3a0a45](https://github.com/Uminily/kodexo/commit/c3a0a455cacfd074ca08d60bfd3316774b3c65b4))
* **app:** middleware error handling ([66a1a83](https://github.com/Uminily/kodexo/commit/66a1a835e249d20037636a5e92f976dddc59b607))
* **app:** middleware use check ([299183b](https://github.com/Uminily/kodexo/commit/299183b62bc3c2f115cc915b5d78630b9d31c6dc))
* **app:** miss authorization header in cors ([cd612b6](https://github.com/Uminily/kodexo/commit/cd612b620153812fbf7251aea8a1eba07cc0ae25))
* **app:** public method on appProviders ([eca5b45](https://github.com/Uminily/kodexo/commit/eca5b45cee56bc8028f48f64f056fe9ed9a34530))
* **app:** queues init before afterInit method ([9a8128e](https://github.com/Uminily/kodexo/commit/9a8128e9184be102eef522efbca75e320bec7823))
* **app:** server can have di constructor ([242c50c](https://github.com/Uminily/kodexo/commit/242c50cb2d17d9aa29bc35874dd0c2287830b192))
* first init async service ([f6860fb](https://github.com/Uminily/kodexo/commit/f6860fb75d948cfdddd037a4e706c60ba0542656))
* **injection:** import constructor params order ([c779cf7](https://github.com/Uminily/kodexo/commit/c779cf7df3312aa09e4ef719da8ee561e78a1f82))
* **injection:** param args interpreted as property ([83dc9e8](https://github.com/Uminily/kodexo/commit/83dc9e8a67fcc6bf21d5982b851c4d32c6c7147c))
* loading queue was weird ([fe6b4a2](https://github.com/Uminily/kodexo/commit/fe6b4a2d5f86b7529fa99923057443c3a1b4061f))
* update class-transformer security ([f4a69aa](https://github.com/Uminily/kodexo/commit/f4a69aafd847bf08e50bc70d49d88162e562a435))


### Features

* add @Delete and @Put methods decorators ([d288b10](https://github.com/Uminily/kodexo/commit/d288b102037ef11a2f701eed7ecc8a8752d312e8))
* add cookies params & options ([ff4e3e1](https://github.com/Uminily/kodexo/commit/ff4e3e17e7e95952c09b65f7c24f7dbc0d3be484))
* add entities modules & logs ([8d35799](https://github.com/Uminily/kodexo/commit/8d357992000e9ef93c105aeaee28afc5a5c27709))
* add interceptor & serializer systems ([5032d8d](https://github.com/Uminily/kodexo/commit/5032d8d0c381dd951a309ee7b46bff6d4a45ba64))
* add interceptor facility ([c45b58d](https://github.com/Uminily/kodexo/commit/c45b58d59b53db26e5daa8f720f1e0f131d703f2))
* add UseValidation decorator ([0911c1c](https://github.com/Uminily/kodexo/commit/0911c1ce2f496369031e5c839f1a4505387c7126))
* add worker & queue ([d3ef4db](https://github.com/Uminily/kodexo/commit/d3ef4dbdb51f4fda5db2dbe8f9e844dafe0e8e6e))
* **app:** add app providers service ([f688cc7](https://github.com/Uminily/kodexo/commit/f688cc77d293f4dd78dc2b138eca4c9ce2f73373))
* **app:** add controller debug ([eb7af67](https://github.com/Uminily/kodexo/commit/eb7af67eb2b4f5aa2051206ba1518c100d28aff1))
* **app:** add readiness probe system ([40b993f](https://github.com/Uminily/kodexo/commit/40b993f8e7c18277dd80dadff89075c55ea32e16))
* **app:** add requestBody to openapi specs ([1dd6e27](https://github.com/Uminily/kodexo/commit/1dd6e27f139135c88b56f7b2ac5a6797bba3719a))
* **app:** add RoutesService & actions ([3f0d789](https://github.com/Uminily/kodexo/commit/3f0d789decedef929e6cf63b4cf58e56a349979f))
* **app:** wip implements v3.1 ([4057b02](https://github.com/Uminily/kodexo/commit/4057b026b774d189ebf8c6771be77893436ea118))
* **app:** wip openapi automatic ([9c7eb88](https://github.com/Uminily/kodexo/commit/9c7eb889102a5ee2a50f247cd727187c7cd0b25a))
* change everything with modules ([f9a8972](https://github.com/Uminily/kodexo/commit/f9a89725a2db6b039e1179b606452ec85cbbb239))
* **injection:** modules now have providers option ([4c4da34](https://github.com/Uminily/kodexo/commit/4c4da340391db464cbfcf8eda2ee2a723acfe73a))
* middleware implementation ([1f3f92f](https://github.com/Uminily/kodexo/commit/1f3f92fa8e44b21f9e44520cf9fa5d09ad7f1786))
* permits @Use usage on controller ([35ac25e](https://github.com/Uminily/kodexo/commit/35ac25eabb7d3e6ecb2162da697b1b0bed0d953c))
* start headers & x-total-count on getMany ([51ef2ae](https://github.com/Uminily/kodexo/commit/51ef2ae180633a28207cd458a175d8a67da1bf85))
* **storage:** new storage module ([7723ec9](https://github.com/Uminily/kodexo/commit/7723ec90f7c0c1e4b31eb300edf1b152ef0ccfbf))





# [0.19.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.18.0...@kodexo/app@0.19.0) (2022-04-24)


### Features

* add interceptor & serializer systems ([5032d8d](https://github.com/Uminily/kodexo/commit/5032d8d0c381dd951a309ee7b46bff6d4a45ba64))





# [0.18.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.17.1...@kodexo/app@0.18.0) (2022-04-23)


### Features

* add interceptor facility ([c45b58d](https://github.com/Uminily/kodexo/commit/c45b58d59b53db26e5daa8f720f1e0f131d703f2))





## [0.17.1](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.17.0...@kodexo/app@0.17.1) (2022-04-23)

**Note:** Version bump only for package @kodexo/app





# 0.17.0 (2022-03-22)


### Bug Fixes

* **app:** add cors options for x-query-schema ([ece5259](https://github.com/Uminily/kodexo/commit/ece525907daa57cce05b3978f5059fbcc0f2e700))
* **app:** add logger for providers loading ([4182bc1](https://github.com/Uminily/kodexo/commit/4182bc19175389b095a9b7af1dca9b1692f4ec34))
* **app:** credentials & cookies cors options ([485414d](https://github.com/Uminily/kodexo/commit/485414d4294cb49f7ce2b261495c7e0cbf815434))
* **app:** exposed correct headers from cors ([b9b9bec](https://github.com/Uminily/kodexo/commit/b9b9bec59d30633e323147ac475af591bf49ddfa))
* **app:** forget appProvidersService exports ([112cae4](https://github.com/Uminily/kodexo/commit/112cae441ea4c1b5f665c090457c84474eed0d87))
* **app:** injector from package injection ([c3b99d4](https://github.com/Uminily/kodexo/commit/c3b99d4b94d769b45cfcf35fe8a8780b7a3fe244))
* **app:** method lowercasing ([c3a0a45](https://github.com/Uminily/kodexo/commit/c3a0a455cacfd074ca08d60bfd3316774b3c65b4))
* **app:** middleware error handling ([66a1a83](https://github.com/Uminily/kodexo/commit/66a1a835e249d20037636a5e92f976dddc59b607))
* **app:** middleware use check ([299183b](https://github.com/Uminily/kodexo/commit/299183b62bc3c2f115cc915b5d78630b9d31c6dc))
* **app:** miss authorization header in cors ([cd612b6](https://github.com/Uminily/kodexo/commit/cd612b620153812fbf7251aea8a1eba07cc0ae25))
* **app:** public method on appProviders ([eca5b45](https://github.com/Uminily/kodexo/commit/eca5b45cee56bc8028f48f64f056fe9ed9a34530))
* **app:** queues init before afterInit method ([9a8128e](https://github.com/Uminily/kodexo/commit/9a8128e9184be102eef522efbca75e320bec7823))
* **app:** server can have di constructor ([242c50c](https://github.com/Uminily/kodexo/commit/242c50cb2d17d9aa29bc35874dd0c2287830b192))
* first init async service ([f6860fb](https://github.com/Uminily/kodexo/commit/f6860fb75d948cfdddd037a4e706c60ba0542656))
* **injection:** import constructor params order ([c779cf7](https://github.com/Uminily/kodexo/commit/c779cf7df3312aa09e4ef719da8ee561e78a1f82))
* **injection:** param args interpreted as property ([83dc9e8](https://github.com/Uminily/kodexo/commit/83dc9e8a67fcc6bf21d5982b851c4d32c6c7147c))
* loading queue was weird ([fe6b4a2](https://github.com/Uminily/kodexo/commit/fe6b4a2d5f86b7529fa99923057443c3a1b4061f))
* update class-transformer security ([f4a69aa](https://github.com/Uminily/kodexo/commit/f4a69aafd847bf08e50bc70d49d88162e562a435))


### Features

* add @Delete and @Put methods decorators ([d288b10](https://github.com/Uminily/kodexo/commit/d288b102037ef11a2f701eed7ecc8a8752d312e8))
* add cookies params & options ([ff4e3e1](https://github.com/Uminily/kodexo/commit/ff4e3e17e7e95952c09b65f7c24f7dbc0d3be484))
* add entities modules & logs ([8d35799](https://github.com/Uminily/kodexo/commit/8d357992000e9ef93c105aeaee28afc5a5c27709))
* add UseValidation decorator ([0911c1c](https://github.com/Uminily/kodexo/commit/0911c1ce2f496369031e5c839f1a4505387c7126))
* add worker & queue ([d3ef4db](https://github.com/Uminily/kodexo/commit/d3ef4dbdb51f4fda5db2dbe8f9e844dafe0e8e6e))
* **app:** add app providers service ([f688cc7](https://github.com/Uminily/kodexo/commit/f688cc77d293f4dd78dc2b138eca4c9ce2f73373))
* **app:** add controller debug ([eb7af67](https://github.com/Uminily/kodexo/commit/eb7af67eb2b4f5aa2051206ba1518c100d28aff1))
* **app:** add readiness probe system ([40b993f](https://github.com/Uminily/kodexo/commit/40b993f8e7c18277dd80dadff89075c55ea32e16))
* **app:** add RoutesService & actions ([3f0d789](https://github.com/Uminily/kodexo/commit/3f0d789decedef929e6cf63b4cf58e56a349979f))
* change everything with modules ([f9a8972](https://github.com/Uminily/kodexo/commit/f9a89725a2db6b039e1179b606452ec85cbbb239))
* **injection:** modules now have providers option ([4c4da34](https://github.com/Uminily/kodexo/commit/4c4da340391db464cbfcf8eda2ee2a723acfe73a))
* middleware implementation ([1f3f92f](https://github.com/Uminily/kodexo/commit/1f3f92fa8e44b21f9e44520cf9fa5d09ad7f1786))
* permits @Use usage on controller ([35ac25e](https://github.com/Uminily/kodexo/commit/35ac25eabb7d3e6ecb2162da697b1b0bed0d953c))
* start headers & x-total-count on getMany ([51ef2ae](https://github.com/Uminily/kodexo/commit/51ef2ae180633a28207cd458a175d8a67da1bf85))
* **storage:** new storage module ([7723ec9](https://github.com/Uminily/kodexo/commit/7723ec90f7c0c1e4b31eb300edf1b152ef0ccfbf))



## 0.1.2 (2021-07-15)



## 0.1.1 (2021-07-13)



# 0.1.0 (2021-07-13)



## 0.0.18 (2021-07-12)


### Features

* many modifications on logs & config ([b1a4ed5](https://github.com/Uminily/kodexo/commit/b1a4ed5eb7485b03a3388749f4f068067640e194))



## 0.0.17 (2021-07-12)



## 0.0.16 (2021-07-11)


### Bug Fixes

* **app:** handle favicon 404 error ([a683778](https://github.com/Uminily/kodexo/commit/a68377864a408000a18dc77bfaa3602c47cf1108))


### Features

* **app:** add afterInit hook on ServerHooks ([3baac31](https://github.com/Uminily/kodexo/commit/3baac31f8dd18516a0ffa610de798dd74bf26b10))



## 0.0.15 (2021-07-11)



## 0.0.14 (2021-07-10)



## 0.0.13 (2021-07-10)



## 0.0.12 (2021-07-10)



## 0.0.11 (2021-07-10)


### Bug Fixes

* **packages:** wrong repo ([b5dee6a](https://github.com/Uminily/kodexo/commit/b5dee6a71e411ef01addd9331690d5495d779e03))





## [0.16.2](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.16.1...@kodexo/app@0.16.2) (2021-12-17)

**Note:** Version bump only for package @kodexo/app





## [0.16.1](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.16.0...@kodexo/app@0.16.1) (2021-12-15)

**Note:** Version bump only for package @kodexo/app





# [0.16.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.15.6...@kodexo/app@0.16.0) (2021-12-10)


### Bug Fixes

* **app:** middleware use check ([299183b](https://github.com/Uminily/kodexo/commit/299183b62bc3c2f115cc915b5d78630b9d31c6dc))


### Features

* **storage:** new storage module ([7723ec9](https://github.com/Uminily/kodexo/commit/7723ec90f7c0c1e4b31eb300edf1b152ef0ccfbf))





## [0.15.6](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.15.5...@kodexo/app@0.15.6) (2021-12-06)

**Note:** Version bump only for package @kodexo/app





## [0.15.5](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.15.4...@kodexo/app@0.15.5) (2021-11-24)

**Note:** Version bump only for package @kodexo/app





## [0.15.4](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.15.3...@kodexo/app@0.15.4) (2021-11-24)

**Note:** Version bump only for package @kodexo/app





## [0.15.3](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.15.2...@kodexo/app@0.15.3) (2021-11-22)


### Bug Fixes

* update class-transformer security ([f4a69aa](https://github.com/Uminily/kodexo/commit/f4a69aafd847bf08e50bc70d49d88162e562a435))





## [0.15.2](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.15.1...@kodexo/app@0.15.2) (2021-11-22)


### Bug Fixes

* **app:** credentials & cookies cors options ([485414d](https://github.com/Uminily/kodexo/commit/485414d4294cb49f7ce2b261495c7e0cbf815434))





## [0.15.1](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.15.0...@kodexo/app@0.15.1) (2021-11-16)


### Bug Fixes

* **app:** public method on appProviders ([eca5b45](https://github.com/Uminily/kodexo/commit/eca5b45cee56bc8028f48f64f056fe9ed9a34530))





# [0.15.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.14.1...@kodexo/app@0.15.0) (2021-11-12)


### Features

* **injection:** modules now have providers option ([4c4da34](https://github.com/Uminily/kodexo/commit/4c4da340391db464cbfcf8eda2ee2a723acfe73a))





## [0.14.1](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.14.0...@kodexo/app@0.14.1) (2021-11-11)


### Bug Fixes

* **app:** forget appProvidersService exports ([112cae4](https://github.com/Uminily/kodexo/commit/112cae441ea4c1b5f665c090457c84474eed0d87))





# [0.14.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.13.4...@kodexo/app@0.14.0) (2021-11-11)


### Bug Fixes

* **app:** method lowercasing ([c3a0a45](https://github.com/Uminily/kodexo/commit/c3a0a455cacfd074ca08d60bfd3316774b3c65b4))


### Features

* **app:** add app providers service ([f688cc7](https://github.com/Uminily/kodexo/commit/f688cc77d293f4dd78dc2b138eca4c9ce2f73373))





## [0.13.4](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.13.3...@kodexo/app@0.13.4) (2021-11-09)

**Note:** Version bump only for package @kodexo/app





## [0.13.3](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.13.2...@kodexo/app@0.13.3) (2021-11-08)


### Bug Fixes

* **app:** middleware error handling ([66a1a83](https://github.com/Uminily/kodexo/commit/66a1a835e249d20037636a5e92f976dddc59b607))





## [0.13.2](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.13.1...@kodexo/app@0.13.2) (2021-11-08)

**Note:** Version bump only for package @kodexo/app





## [0.13.1](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.13.0...@kodexo/app@0.13.1) (2021-11-04)

**Note:** Version bump only for package @kodexo/app





# [0.13.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.12.2...@kodexo/app@0.13.0) (2021-11-04)


### Features

* **app:** add RoutesService & actions ([3f0d789](https://github.com/Uminily/kodexo/commit/3f0d789decedef929e6cf63b4cf58e56a349979f))





## [0.12.2](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.12.1...@kodexo/app@0.12.2) (2021-11-04)

**Note:** Version bump only for package @kodexo/app





## [0.12.1](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.12.0...@kodexo/app@0.12.1) (2021-10-12)

**Note:** Version bump only for package @kodexo/app





# [0.12.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.11.12...@kodexo/app@0.12.0) (2021-10-05)


### Features

* **app:** add readiness probe system ([40b993f](https://github.com/Uminily/kodexo/commit/40b993f8e7c18277dd80dadff89075c55ea32e16))





## [0.11.12](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.11.11...@kodexo/app@0.11.12) (2021-10-04)

**Note:** Version bump only for package @kodexo/app





## [0.11.11](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.11.10...@kodexo/app@0.11.11) (2021-10-04)

**Note:** Version bump only for package @kodexo/app





## [0.11.10](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.11.9...@kodexo/app@0.11.10) (2021-10-04)

**Note:** Version bump only for package @kodexo/app





## [0.11.9](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.11.8...@kodexo/app@0.11.9) (2021-09-23)

**Note:** Version bump only for package @kodexo/app





## [0.11.8](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.11.7...@kodexo/app@0.11.8) (2021-09-22)

**Note:** Version bump only for package @kodexo/app





## [0.11.7](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.11.6...@kodexo/app@0.11.7) (2021-09-21)

**Note:** Version bump only for package @kodexo/app





## [0.11.6](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.11.5...@kodexo/app@0.11.6) (2021-09-21)


### Bug Fixes

* **app:** queues init before afterInit method ([9a8128e](https://github.com/Uminily/kodexo/commit/9a8128e9184be102eef522efbca75e320bec7823))





## [0.11.5](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.11.4...@kodexo/app@0.11.5) (2021-09-21)

**Note:** Version bump only for package @kodexo/app





## [0.11.4](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.11.3...@kodexo/app@0.11.4) (2021-09-21)

**Note:** Version bump only for package @kodexo/app





## [0.11.3](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.11.2...@kodexo/app@0.11.3) (2021-09-20)

**Note:** Version bump only for package @kodexo/app





## [0.11.2](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.11.1...@kodexo/app@0.11.2) (2021-09-20)


### Bug Fixes

* **app:** injector from package injection ([c3b99d4](https://github.com/Uminily/kodexo/commit/c3b99d4b94d769b45cfcf35fe8a8780b7a3fe244))





## [0.11.1](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.11.0...@kodexo/app@0.11.1) (2021-09-02)


### Bug Fixes

* loading queue was weird ([fe6b4a2](https://github.com/Uminily/kodexo/commit/fe6b4a2d5f86b7529fa99923057443c3a1b4061f))





# [0.11.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.10.1...@kodexo/app@0.11.0) (2021-09-01)


### Features

* add worker & queue ([d3ef4db](https://github.com/Uminily/kodexo/commit/d3ef4dbdb51f4fda5db2dbe8f9e844dafe0e8e6e))
* **app:** add controller debug ([eb7af67](https://github.com/Uminily/kodexo/commit/eb7af67eb2b4f5aa2051206ba1518c100d28aff1))





## [0.10.1](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.10.0...@kodexo/app@0.10.1) (2021-08-12)


### Bug Fixes

* **app:** server can have di constructor ([242c50c](https://github.com/Uminily/kodexo/commit/242c50cb2d17d9aa29bc35874dd0c2287830b192))





# [0.10.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.9.1...@kodexo/app@0.10.0) (2021-08-12)


### Features

* add entities modules & logs ([8d35799](https://github.com/Uminily/kodexo/commit/8d357992000e9ef93c105aeaee28afc5a5c27709))





## [0.9.1](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.9.0...@kodexo/app@0.9.1) (2021-08-12)


### Bug Fixes

* **app:** add logger for providers loading ([4182bc1](https://github.com/Uminily/kodexo/commit/4182bc19175389b095a9b7af1dca9b1692f4ec34))





# [0.9.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.8.3...@kodexo/app@0.9.0) (2021-08-11)


### Features

* change everything with modules ([f9a8972](https://github.com/Uminily/kodexo/commit/f9a89725a2db6b039e1179b606452ec85cbbb239))





## [0.8.3](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.8.2...@kodexo/app@0.8.3) (2021-08-03)


### Bug Fixes

* first init async service ([f6860fb](https://github.com/Uminily/kodexo/commit/f6860fb75d948cfdddd037a4e706c60ba0542656))





## [0.8.2](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.8.1...@kodexo/app@0.8.2) (2021-08-03)

**Note:** Version bump only for package @kodexo/app





## [0.8.1](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.8.0...@kodexo/app@0.8.1) (2021-08-03)


### Bug Fixes

* **injection:** param args interpreted as property ([83dc9e8](https://github.com/Uminily/kodexo/commit/83dc9e8a67fcc6bf21d5982b851c4d32c6c7147c))





# [0.8.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.7.0...@kodexo/app@0.8.0) (2021-08-03)


### Features

* add cookies params & options ([ff4e3e1](https://github.com/Uminily/kodexo/commit/ff4e3e17e7e95952c09b65f7c24f7dbc0d3be484))





# [0.7.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.6.2...@kodexo/app@0.7.0) (2021-07-27)


### Features

* permits @Use usage on controller ([35ac25e](https://github.com/Uminily/kodexo/commit/35ac25eabb7d3e6ecb2162da697b1b0bed0d953c))





## [0.6.2](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.6.1...@kodexo/app@0.6.2) (2021-07-27)

**Note:** Version bump only for package @kodexo/app





## [0.6.1](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.6.0...@kodexo/app@0.6.1) (2021-07-27)

**Note:** Version bump only for package @kodexo/app





# [0.6.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.5.0...@kodexo/app@0.6.0) (2021-07-22)


### Features

* add UseValidation decorator ([0911c1c](https://github.com/Uminily/kodexo/commit/0911c1ce2f496369031e5c839f1a4505387c7126))





# [0.5.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.4.3...@kodexo/app@0.5.0) (2021-07-21)


### Features

* add @Delete and @Put methods decorators ([d288b10](https://github.com/Uminily/kodexo/commit/d288b102037ef11a2f701eed7ecc8a8752d312e8))





## [0.4.3](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.4.2...@kodexo/app@0.4.3) (2021-07-21)

**Note:** Version bump only for package @kodexo/app





## [0.4.2](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.4.1...@kodexo/app@0.4.2) (2021-07-18)


### Bug Fixes

* **app:** exposed correct headers from cors ([b9b9bec](https://github.com/Uminily/kodexo/commit/b9b9bec59d30633e323147ac475af591bf49ddfa))





## [0.4.1](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.4.0...@kodexo/app@0.4.1) (2021-07-18)


### Bug Fixes

* **app:** add cors options for x-query-schema ([ece5259](https://github.com/Uminily/kodexo/commit/ece525907daa57cce05b3978f5059fbcc0f2e700))
* **app:** miss authorization header in cors ([cd612b6](https://github.com/Uminily/kodexo/commit/cd612b620153812fbf7251aea8a1eba07cc0ae25))





# [0.4.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.3.0...@kodexo/app@0.4.0) (2021-07-18)


### Features

* start headers & x-total-count on getMany ([51ef2ae](https://github.com/Uminily/kodexo/commit/51ef2ae180633a28207cd458a175d8a67da1bf85))





# [0.3.0](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.2.2...@kodexo/app@0.3.0) (2021-07-16)


### Features

* middleware implementation ([1f3f92f](https://github.com/Uminily/kodexo/commit/1f3f92fa8e44b21f9e44520cf9fa5d09ad7f1786))





## [0.2.2](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.2.1...@kodexo/app@0.2.2) (2021-07-15)


### Bug Fixes

* **injection:** import constructor params order ([c779cf7](https://github.com/Uminily/kodexo/commit/c779cf7df3312aa09e4ef719da8ee561e78a1f82))





## [0.2.1](https://github.com/Uminily/kodexo/compare/@kodexo/app@0.2.0...@kodexo/app@0.2.1) (2021-07-15)

**Note:** Version bump only for package @kodexo/app





# 0.2.0 (2021-07-15)



## 0.1.2 (2021-07-15)



## 0.1.1 (2021-07-13)



# 0.1.0 (2021-07-13)



## 0.0.18 (2021-07-12)


### Features

* many modifications on logs & config ([b1a4ed5](https://github.com/Uminily/kodexo/commit/b1a4ed5eb7485b03a3388749f4f068067640e194))



## 0.0.17 (2021-07-12)



## 0.0.16 (2021-07-11)


### Bug Fixes

* **app:** handle favicon 404 error ([a683778](https://github.com/Uminily/kodexo/commit/a68377864a408000a18dc77bfaa3602c47cf1108))


### Features

* **app:** add afterInit hook on ServerHooks ([3baac31](https://github.com/Uminily/kodexo/commit/3baac31f8dd18516a0ffa610de798dd74bf26b10))



## 0.0.15 (2021-07-11)



## 0.0.14 (2021-07-10)



## 0.0.13 (2021-07-10)



## 0.0.12 (2021-07-10)



## 0.0.11 (2021-07-10)


### Bug Fixes

* **packages:** wrong repo ([b5dee6a](https://github.com/Uminily/kodexo/commit/b5dee6a71e411ef01addd9331690d5495d779e03))





## [0.1.2](https://github.com/Uminily/kodexo/compare/v0.1.1...v0.1.2) (2021-07-15)

**Note:** Version bump only for package @kodexo/app





## 0.1.1 (2021-07-13)

**Note:** Version bump only for package @kodexo/app
