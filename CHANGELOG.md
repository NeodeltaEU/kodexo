# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-dev.2](https://github.com/Uminily/kodexo/compare/v0.1.2...v1.0.0-dev.2) (2022-05-08)


### Bug Fixes

* **access-control:** defineOrGetRole method ([1f9296b](https://github.com/Uminily/kodexo/commit/1f9296bbee99e9183b2ee43786dfda06c8b25925))
* **access-control:** getRole method missing ([6a2afd6](https://github.com/Uminily/kodexo/commit/6a2afd61b34e8f74fba7e306923ce92469807b08))
* add yarn.lock ([fc45f61](https://github.com/Uminily/kodexo/commit/fc45f61e677196a92ca3dfac7c4412271eed4eff))
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
* bull connection item ([22b9bb3](https://github.com/Uminily/kodexo/commit/22b9bb34502a9871d90976eda8c5db8f7665c872))
* change pino pretty to dev ([af576e2](https://github.com/Uminily/kodexo/commit/af576e28e902a560cb82896d3107ba81b375e497))
* **common:** class transformer version ([588a0cb](https://github.com/Uminily/kodexo/commit/588a0cb3fcf2b19ee1b23bd29431c816b5e14771))
* **common:** controller must end with Controller ([e2c1a35](https://github.com/Uminily/kodexo/commit/e2c1a35d654ee02d883823b459b0372ac16f216b))
* **common:** endpoint controller resource ([803df4d](https://github.com/Uminily/kodexo/commit/803df4d1714f7fde97ad5c3778e408f687e2b105))
* **common:** errors handling for validations ([8152b25](https://github.com/Uminily/kodexo/commit/8152b25282f08a089475a06395fa6960373527f9))
* **common:** validation middleware errors ([292ce2f](https://github.com/Uminily/kodexo/commit/292ce2f743e8a8deaeec9188ca0715bcce534d0e))
* **config:** add getOrFail to config ([c711ec0](https://github.com/Uminily/kodexo/commit/c711ec0f1fb935a135b1bc92f4b5ad3d240aa538))
* **config:** return value on getOrFail method ([18cb31e](https://github.com/Uminily/kodexo/commit/18cb31e893f552c8a09cc59561e57923fffe89cb))
* **crud:** add req.assign ([ea75831](https://github.com/Uminily/kodexo/commit/ea758318c257d7a11806011b66c137e130327a52))
* **crud:** assign param not handled ([c82e70f](https://github.com/Uminily/kodexo/commit/c82e70fd91699974e727d2b4df532ad5b11853fd))
* **crud:** change repo visibility on CrudService ([268fcbc](https://github.com/Uminily/kodexo/commit/268fcbc0324dd413e55ba7908ae17f0feb782e6b))
* **crud:** classToPlain before saving ([42adca3](https://github.com/Uminily/kodexo/commit/42adca3414633554c09c6445e291c62fa53e1cfc))
* **crud:** custom collection id fields ([aefa8cc](https://github.com/Uminily/kodexo/commit/aefa8cc69887baa9e36d70deb8d01dc9fd3b7e40))
* **crud:** derp last fix ([db3cba3](https://github.com/Uminily/kodexo/commit/db3cba3b074d5202dae847e2cc55e569d233f52e))
* **crud:** enable override & merge for getOne ([12dcc10](https://github.com/Uminily/kodexo/commit/12dcc1098376cb724ba88ae95f8c7f038518ef4a))
* **crud:** errors with embedded entity ([1f317e1](https://github.com/Uminily/kodexo/commit/1f317e18f2c1abec5cf3f356853f618c5c0e9824))
* **crud:** filter partial type ([b45325f](https://github.com/Uminily/kodexo/commit/b45325fbb925bdd53a05a344590068cea1281f77))
* **crud:** isUnique validator ([91d4680](https://github.com/Uminily/kodexo/commit/91d46805352d036025bc316864603f813348e997))
* **crud:** mandatory req in service ([cbac87f](https://github.com/Uminily/kodexo/commit/cbac87ff8a238427ef1d615cc17a9c356b952398))
* **crud:** order doesn't remove first charac - ([246a3a0](https://github.com/Uminily/kodexo/commit/246a3a045b43c5a530b321dc0ca9bb65187c1fa5))
* **crud:** prepare for delete tenancy system ([6c561af](https://github.com/Uminily/kodexo/commit/6c561af81aec175aa6884297dfb3a0fa8d1aef41))
* **crud:** query parsing mandatory filters ([030773f](https://github.com/Uminily/kodexo/commit/030773f5a267b06060288f70e1e4dedd5b0be7b1))
* **crud:** queryparams must be not mandatory ([c0dab9c](https://github.com/Uminily/kodexo/commit/c0dab9c8304764d862d45e8531cdbc9098db83fd))
* **crud:** remove orm caching ([62f8722](https://github.com/Uminily/kodexo/commit/62f87220121ac7913b09bf4c129f9c6bf4000280))
* **crud:** request interfaces ([f94e908](https://github.com/Uminily/kodexo/commit/f94e90883b3456c04cafc4b30cda743285cc8d1a))
* **crud:** same thing with filters ([368a303](https://github.com/Uminily/kodexo/commit/368a3034e7b9fa03a550014e1874898f70ae2b04))
* **crud:** update IsUnique decorator ([528c947](https://github.com/Uminily/kodexo/commit/528c94746839e44ed0be943eb83eed98d82c16f4))
* **crud:** updateOne decorator option ([36303bd](https://github.com/Uminily/kodexo/commit/36303bdcb6a726e1b569df0d274df87129609e6a))
* dafuq lerna ([d9db97d](https://github.com/Uminily/kodexo/commit/d9db97dc7a42f8206189e6f27c038b3decc3a69b))
* **errors:** dev version ([ac326dd](https://github.com/Uminily/kodexo/commit/ac326ddd9a464d773ca1fd3c195db421ce209258))
* first init async service ([f6860fb](https://github.com/Uminily/kodexo/commit/f6860fb75d948cfdddd037a4e706c60ba0542656))
* **injection:** add missing normalize-path ([c489866](https://github.com/Uminily/kodexo/commit/c489866843917e76e6261ff757dd6c9dc580f6ca))
* **injection:** import constructor params order ([c779cf7](https://github.com/Uminily/kodexo/commit/c779cf7df3312aa09e4ef719da8ee561e78a1f82))
* **injection:** param args interpreted as property ([83dc9e8](https://github.com/Uminily/kodexo/commit/83dc9e8a67fcc6bf21d5982b851c4d32c6c7147c))
* loading queue was weird ([fe6b4a2](https://github.com/Uminily/kodexo/commit/fe6b4a2d5f86b7529fa99923057443c3a1b4061f))
* mikro orm in peer dependencies ([48b0d15](https://github.com/Uminily/kodexo/commit/48b0d15890268392639239d82dafaba9b621b699))
* mikro-orm bullshits ([a65001e](https://github.com/Uminily/kodexo/commit/a65001eee9520da093d1e1c05de850037a7e1bad))
* **mikro-orm:** add em from postgres def ([70ac41f](https://github.com/Uminily/kodexo/commit/70ac41f0e0f45854cf61b1a4cc70cd9a51926256))
* **mikro-orm:** change to mikro 5.0 beta version ([157fa18](https://github.com/Uminily/kodexo/commit/157fa187b66fecff489daa306dbd34d74489acf9))
* **mikro-orm:** fix peerDependencies ([3cd4a99](https://github.com/Uminily/kodexo/commit/3cd4a99f4cc82028cc508572f556c65e24728605))
* **mikro-orm:** flags with submodules imports ([324ead6](https://github.com/Uminily/kodexo/commit/324ead67bd84321af287eb0980a11e3bb3986b85))
* **mikro-orm:** force provider casting ([ddd061b](https://github.com/Uminily/kodexo/commit/ddd061bb3681cf6ec1ca346ea1c5bee085f98221))
* **mikro-orm:** remove useless lodash import ([8b639fd](https://github.com/Uminily/kodexo/commit/8b639fd7ce2b40d03a6c096383a0279a03f9e75a))
* peerDependencies for mikro orm ([fddd0be](https://github.com/Uminily/kodexo/commit/fddd0bec9f7a7fcf9da1dc380c3452ce0c482bfb))
* **queueing:** add slug mention on prefix ([9557ad4](https://github.com/Uminily/kodexo/commit/9557ad49ea9c1c266ccbba9617c0aa86452ae232))
* **queueing:** bind queue instance to worker ([681d485](https://github.com/Uminily/kodexo/commit/681d4852169461e85fde4f9f674108f9ab303de4))
* **queueing:** children params no more mandatory ([471119a](https://github.com/Uminily/kodexo/commit/471119a87db00a556b4d76b242656cb22bfb2aa0))
* **queueing:** events on worker instead of queue ([3bbcdd4](https://github.com/Uminily/kodexo/commit/3bbcdd4e12a80175eac53374de19f9aea498c998))
* **queueing:** export Job class from bullmq ([c747eae](https://github.com/Uminily/kodexo/commit/c747eae13e6c9ad27241dbbc2018a28503eea9bb))
* **queueing:** prefixing queue option ([02a518e](https://github.com/Uminily/kodexo/commit/02a518e66bb0d3546f9441f2cf830d4bc6315c13))
* **queueing:** prepare flow producer ([518b676](https://github.com/Uminily/kodexo/commit/518b6767813366fb688000a86aa0fe27dd3ff24d))
* update class-transformer security ([f4a69aa](https://github.com/Uminily/kodexo/commit/f4a69aafd847bf08e50bc70d49d88162e562a435))
* update yarn.lock ([b867623](https://github.com/Uminily/kodexo/commit/b867623821bbf545529bc049d4d615059f029e01))
* versions mikro orm ([9bc2918](https://github.com/Uminily/kodexo/commit/9bc29180845dd8b54592d42858bb66efad8b4cc7))


### Features

* **access-control:** new access-control package ([82fe54f](https://github.com/Uminily/kodexo/commit/82fe54f9e61c80dba9d90d0a351376d95f7f0dcf))
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
* **common:** add @Injectable decorator ([9be4f52](https://github.com/Uminily/kodexo/commit/9be4f525254c8af75485aec98993c251390174f1))
* **common:** add @Patch decorator ([3b23610](https://github.com/Uminily/kodexo/commit/3b2361059c63045142bbdb12b88cc4517d345b40))
* **common:** add query params decorator ([0595f48](https://github.com/Uminily/kodexo/commit/0595f48a1f0dc3707d1a6b4e65d5ceecdf8d07bf))
* **crud:** add @LimitPopulate decorator ([2daa530](https://github.com/Uminily/kodexo/commit/2daa530839d952fa7bea8cedb109da1da6378450))
* **crud:** add decorators options ([5df1e7b](https://github.com/Uminily/kodexo/commit/5df1e7b802a17d92015d521d088842b2cde121fb))
* **crud:** add limitDeepPopulate option to @Crud ([24e7d5b](https://github.com/Uminily/kodexo/commit/24e7d5b65d64c6332cee2561ed18624ff9e6327d))
* **crud:** add override & merge options to parser ([cf84e62](https://github.com/Uminily/kodexo/commit/cf84e6239489ce93be0dfa76e62f9ce6b4a9ddbb))
* **crud:** add query-schema header system ([806af73](https://github.com/Uminily/kodexo/commit/806af732f9fa638782a959f3b90c51faac987a80))
* **crud:** add req.filter option ([b69a8ba](https://github.com/Uminily/kodexo/commit/b69a8ba70a93fe0dc085ade97d0f95eb38cc8b94))
* **crud:** remove auto populating with ids ([382ade3](https://github.com/Uminily/kodexo/commit/382ade3e006f400ec2e62a07924eab825e3a7ac8))
* first steps about cli ([87f1bee](https://github.com/Uminily/kodexo/commit/87f1bee817268dd4838e0e127d96e6dba9fb0198))
* **injection:** add named registry option ([246d85b](https://github.com/Uminily/kodexo/commit/246d85b3d5ef8826d63c7e39d69560d1ec61b31f))
* **injection:** modules now have providers option ([4c4da34](https://github.com/Uminily/kodexo/commit/4c4da340391db464cbfcf8eda2ee2a723acfe73a))
* middleware implementation ([1f3f92f](https://github.com/Uminily/kodexo/commit/1f3f92fa8e44b21f9e44520cf9fa5d09ad7f1786))
* **mikro-orm:** add soft delete filter ([ff955c1](https://github.com/Uminily/kodexo/commit/ff955c13e91ff4af1d178914d6299675aaff4c0d))
* **mikro-orm:** add subscribers settings ([6f044c1](https://github.com/Uminily/kodexo/commit/6f044c12c86d76ce86117f4c48dcdfdd7158107a))
* **mikro-orm:** entities only if prov. is loaded ([e221397](https://github.com/Uminily/kodexo/commit/e22139776849b702e82af6f00563312c06bc721d))
* **mikro-orm:** modular mikro components loading ([bcd86ef](https://github.com/Uminily/kodexo/commit/bcd86ef0547121928d91a6ca4f44be656dba71ff))
* permits @Use usage on controller ([35ac25e](https://github.com/Uminily/kodexo/commit/35ac25eabb7d3e6ecb2162da697b1b0bed0d953c))
* **queueing:** add events on queue ([163d8f5](https://github.com/Uminily/kodexo/commit/163d8f5ddbed22eb646c2f58522f652562897de4))
* **queueing:** add flow producer system ([9cc7ed1](https://github.com/Uminily/kodexo/commit/9cc7ed1370dd39fd359b92cfbf70161b1f0f97f2))
* start headers & x-total-count on getMany ([51ef2ae](https://github.com/Uminily/kodexo/commit/51ef2ae180633a28207cd458a175d8a67da1bf85))
* **storage:** new storage module ([7723ec9](https://github.com/Uminily/kodexo/commit/7723ec90f7c0c1e4b31eb300edf1b152ef0ccfbf))





## [0.1.2](https://github.com/Uminily/kodexo/compare/v0.1.1...v0.1.2) (2021-07-15)


### Bug Fixes

* build miss on all packages ([e14f23c](https://github.com/Uminily/kodexo/commit/e14f23cadb653453681acffec608f2d365a534f4))





## 0.1.1 (2021-07-13)

**Note:** Version bump only for package root
