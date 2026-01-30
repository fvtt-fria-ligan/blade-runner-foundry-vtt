# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [13.2.0](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/compare/13.1.1...13.2.0) (2026-01-30)

### Features

- Allow modules to register item custom types. ([a78f9bf](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/a78f9bf03b63ae12563dfa1d09a7947a4cd9ebe5))
- bump `foundry-year-zero-roller` to v6.1.0 ([1b87d9e](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/1b87d9eaa65ec02892dcabb115b383c2299a82ce))

## [13.1.1](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/compare/13.1.0...13.1.1) (2025-08-25)

### Bug Fixes

- 🐛 Fix push button on floating dice chat card #62

## [13.1.0](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/compare/13.0.0...13.1.0) (2025-06-18)

### Features

- ✨🌐 Add polish translation

### Bug Fixes

- 🐛 Fix the actor sheet config theme change ([9fb051c](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/9fb051c5ae2cf296729e7908e9e0bedb4237661d))

## [13.0.0](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/compare/12.0.1...13.0.0) (2025-06-16)

### Features

- ✨ Add recommended modules ([ee80a41](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/ee80a4131680e14eec5f034d992f1602ed128c8d))
- ✨ Add support for module Item Piles ([8328ddb](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/8328ddbc7a17bbfb222013039a00f7dc5210da26))
- ✨ Add update chat message ([085fc38](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/085fc3871c68a7978928f356cf9e88bbe4a728f1))
- ✨ Expose YearZeroRoller into game.bladerunner.roll ([b2ac644](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/b2ac644199fc5393908a2eef68907430369bc229))
- **ChatMessage:** ✨ Remove jQuery from chat buttons ([5decc21](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/5decc2159177fa11f42adeee71e4993f4fb2e58b))
- **i18n:** ✨ 🌐 Add more translation lines ([3e019b8](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/3e019b8f090905ffb72e95696475be0fba51f501))
- **item-piles:** ✨ Add more config ([b8bac27](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/b8bac27efe4bce4981b8a723e1d369d927976d0b))

### Bug Fixes

- 🐛 Add custom select helper and remove deprecation warnings ([5c56642](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/5c56642d6e9fc83b7c91ad95c7cd74c22718c58f))
- 🐛 Attempt to repair the a.inline-roll overriding body event listener ([15381ce](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/15381ce0de99cde2da474bccde990a4f720717c7))
- 🐛 Change more namespaces ([ea51d91](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/ea51d9150feaf47301a1174d52d9a450aa6f60c4))
- 🐛 Change p class notes by hint ([69e2ea9](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/69e2ea9caf8b3eca9dc46bff8541accba7b28e4b))
- 🐛 Move DiceSoNice FX config to assets ([e527219](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/e5272190d735cd652a72ba984dd28f0151ecbab4))
- 🐛 Reactivate the roll button in chat message after action ([8e66ed1](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/8e66ed10f0da02963bdc00101885913af3c3fb61))
- 🐛 Remove async roll deprecation warnings ([8e79ddf](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/8e79ddfd4ae870463065c1b121689633d870c0e3))
- 🐛 Remove more namespace warnings with RollTables ([868027a](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/868027a8ec98b4283dfc2168371e5ffec2145e98))
- 🐛 Remove namespaces warnings ([6f24858](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/6f24858e636c936c7d2987bd5178a8e33426df2b))
- 🐛 Repair ChatMessage ContextMenu ApplyDamage ([0422272](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/042227267441bc22dc1fd0d921eac1df2b3e6ef4))
- 🐛 Repair JQuery in chat hooks ([712ac26](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/712ac26f7992ee2e6efb9bd58f06dc4ad263ad71))
- 🐛 Repair Sheet Config ([6a1439c](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/6a1439c4b31a988ba81460ea038438d8d111dac8))
- 🐛 Repair table enricher ([36e1dd8](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/36e1dd87815f4dd611a527c0cbce36d12ea616e3))
- 🐛 Repair the chat roll result expand ([4a6a455](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/4a6a4552a556751aff2c814907cb893438823b22))
- 🐛 Repair vehicle component not repairable ([895497c](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/895497ce54ba6c5387f57265806793a6ced52d80))
- 🐛 Repair Vehicle crash mitigation roll ([a875cf9](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/a875cf95b3f1f30e3388cf8bb997f23308295243))
- 🐛 Repair window position of the ActorSheetConfig ([1b139a6](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/1b139a6b09a76d965a95159819c8dcb5835ae8b5))
- 🐛 Replace more namespaces ([d3d1b8f](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/d3d1b8f77c213383597375cbba16de89144c2cf3))
- **Item:** 🐛 Repair the ActiveEffects ([e6aef71](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/e6aef71a8ec05b0797900029d03dbed112548851))

## [12.0.1](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/compare/12.0.0...12.0.1) (2024-07-04)

### Bug Fixes

- 🐛 Fixed an issue with items in character sheets displaying the text "[object Promise]" instead of its proper description. ([ed58576](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/ed58576b6d0703563b96f7b39d3969124ab664fe))

## [12.0.0](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/compare/11.0.2...12.0.0) (2024-06-09)

### Bug Fixes

- Fixed v12 compatibility with YZUR library and verified system for 12.327

## [11.0.2](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/compare/11.0.1...11.0.2) (2024-03-26)

### Features

- **Settings:** ✨ Add new setting to disable handwritten font ([44af555](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/44af555cf69687f82a8fd3cf64a95a850fc00758))

## [11.0.1](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/compare/11.0.0...11.0.1) (2023-07-18)

### Bug Fixes

- Enabled German, Spanish and Korean languages (a parameter was missing).
- Fixed translations issues in French and German.

## [11.0.0](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/compare/10.1.0...11.0.0) (2023-06-26)

### Features

- ✨ Add compatibility for Foundry V11

## [10.1.0](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/compare/10.0.2...10.1.0) (2023-06-26)

### Features

- ✨ Add @FontAwesomeIcon enricher ([416537d](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/416537da23bb8f2ad11621b5765958f73b26eef5))
- ✨ Add 10.0.1 message ([4045703](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/4045703ba3f72a7126f503a3624a7aa98973b06a))
- ✨ Add Active Effects support ([9ddad15](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/9ddad15fa3dc2a13850eb5221fd6ed0d4af10a43))
- ✨ Add custom a.inline-roll event listener ([c96ceee](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/c96ceee4a2c2b695bee3a13e1b1cfcd351f03248))
- ✨ Add custom text editor enrichers ([eac7d99](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/eac7d9972066042a15bdb536f75718f8bbbca4b7))
- ✨ Add drag & drop hotbar macros support ([43b1f37](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/43b1f3745451630948d9b9ae3389367834334785))
- ✨ Add drawCrit method ([dfa6182](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/dfa618248bd3b5f8dd8fe6519a0d96147ea4e9d4))
- ✨ Add DrawSize ([b16262c](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/b16262c3f958dfcea435c753a19dbdcd4344947c))
- ✨ Add Loot (item pile) sheet ([a838cd9](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/a838cd952d0421abae299373a6799e9753be01f1))
- ✨ Add more custom enrichers for icons ([f0f1497](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/f0f1497ef6140015c00924269313f82b9a92f851))
- ✨ Add more screenshots ([89c1539](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/89c153918327c71fbee1e27e7aeed64cbe9a2ce9))
- ✨ Add new font style for editor ([fa059c2](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/fa059c2424dcf657da93e34442c53f9d8da0f491))
- ✨ Add screenshots ([fe896ac](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/fe896ac44ea83f1f2fdb8d7e1636cdab56c7a81d))
- ✨ Add vehicle page in the Game System's Manual journal entry ([d920026](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/d9200267b221556ce7ce61b55e1ab2c96561d34d))
- ✨ Add vehicle sheet ([971f64e](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/971f64e410f76760095092ce209a88df7cc37852))
- ✨ automatic crit draw ([e2fc10c](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/e2fc10c78b31f15293f25e7d7f09d39429c596d1))
- ✨ Finalize enricher ([3c65fdb](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/3c65fdb0f5d712e79c805b08768964ecacc7ad4d))
- ✨ Vehicle damage draw ([9e95024](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/9e9502424934e46ed86a2b7f49b5e147add9d93c))
- **Actor:** ✨ Drag'n drop Actions ([53b42d2](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/53b42d2d46581adfdb0ded05958a2da6ad047086))
- **Assets:** ✨ Add new screenshots ([73dc71a](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/73dc71a00949e46037470a7468d31c3a284d8888))
- **Character-Sheet:** ✨ Add Edit Nature setting for players ([740cf9a](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/740cf9a6e067e98c663ef59405e0200dce7de577))
- **Character:** ✨ Add "mvr" attribute in sheet config ([cd35efc](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/cd35efc50e9fc71a81b10524a9e34ddf0080fd5a))
- **Character:** ✨ Add [@max](https://github.com/max)Push to rollData ([e92cfa9](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/e92cfa918adb6f38143dc9bbc08469fc8bb5d4c7))
- **DsN:** ✨ Add D3 dice preset ([07ebb93](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/07ebb93f917dfbcc1eef8b31cfcbafe98d003b63))
- **DsN:** ✨ Add default SFX ([5028d99](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/5028d995d25b97c7f5d88ac4b5e7b13b5555d6fa))
- **DsN:** ✨ Add dice icons for Dice So Nice ([ae14489](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/ae1448906e5c5ce9fd5239a1150b8789cd154745))
- **DsN:** ✨ Add template for all other dice ([569fabb](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/569fabbf0b4b36b1440d00948e5f8483e9655a9e))
- **Enricher:** ✨ Add BladeRunnerWeapon text enricher ([06cfd3b](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/06cfd3b8533d99ebbc26e5ee8b1e2fd75860ad7c))
- **Enrichers:** ✨ Add Blade Runner Actor enricher ([400007d](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/400007d1aa3a999d109124edf52ac97aa0de0109))
- **Enrichers:** ✨ Add BR symbol enricher ([ad2afa2](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/ad2afa2d776f748b1af12f84f213b0a50b61ffe7))
- **Enrichers:** ✨ Add Handout enricher ([b81f7ca](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/b81f7ca2f238c762675162363148a9ea3d06c01f))
- **Item:** ✨ Add consumable option ([c6daeb9](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/c6daeb95d29cf9458da34d0a5329cd6cf068b501))
- **Manifest:** ✨ Add changelog link ([363e6e8](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/363e6e8ff33a49aec77d0718b217057704c044fb))
- **Modifiers:** ✨ Add a Health & Resolve modifier option for items ([8401ae2](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/8401ae2da8f657d829da730364960ac4809755ee))
- **Modifiers:** ✨ Add careful-aim default for ranged attacks ([292f121](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/292f121034903ae899237b4cdf997dda9e2975ba))
- **Roll:** ✨ Add infos in chat card ([0ee0067](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/0ee0067ecb10d513fd8bd7747273deb4c3d823dc))
- **Roller:** ✨ Add .waitForRoll method ([6356f27](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/6356f27cff29c833c99a1925bedd04e1de4646ae))
- **Roller:** ✨ Add push selection dialog ([e74a3da](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/e74a3da39f73b1e654e701733f138d945732785f))
- **Settings:** ✨ Add auto armor setting ([1fff642](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/1fff642c81880255478bca107b22a2cd2451b6c8))
- **Sheets:** ✨ Add drag sorting for items and crew ([7645165](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/7645165157d4bc3709a545fb872e82199c4c00c4))
- **Sheets:** ✨ Add vehicle sheet ([c455465](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/c455465b153ca6652b1c2678a2c62f30f88af06c))
- **Vehicle:** ✨ Add mounted weapons support ([d1fb4cc](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/d1fb4ccf52937e156e6098f30ad43cfa81050c56))
- **Vehicle:** ✨ Add prepareMountedWeapons ([0c2a784](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/0c2a784e4e032bec5c9c13bb27217b9990e53ee2))
- **Vehicle:** ✨ Add ramming & explode ([51a0704](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/51a07046d23fb58857a6006efd31e39d4717b4a1))
- **Vehicle:** ✨ Add ramming action ([213e90b](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/213e90bfd56b70063997c1e70d8b9b870439106a))
- **Vehicle:** ✨ Cleanses all actor references ([cef0e79](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/cef0e790614736572353f94c964910d9290c35c4))
- **Weapon-Damage-Type:** ✨ Add a third damage type as Stress ([cde2ea9](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/cde2ea968eec4432f57331bcea6804f142097596))

### Bug Fixes

- 🐛 Add enriched HTML to description fields ([a66a920](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/a66a920135a17ad128a02d4ff97370d3c6d78664))
- 🐛 Add YZEC custom registration (hook) ([7f46e8c](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/7f46e8c7bd27286e11c15b65b0121e000ee7bef0))
- 🐛 Correct success (eye) symbol for text ([273577b](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/273577b54f82f7396cd34b68853acff99aa8194b))
- 🐛 createActor starting data ([02b2f94](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/02b2f940e668c4dda4dc2426b9b0674764b23c4f))
- 🐛 Enrich item tooltip and description in Actor sheet ([b5e4cd9](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/b5e4cd97992c08be46791ef7c3ee94634b190387))
- 🐛 Enrich modifier description in roll dialog ([22a9f16](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/22a9f164c3b00dd9d29883a1cca6e2daf2eab691))
- 🐛 enricher ([d78d58b](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/d78d58b874021930f72b85f0c2d7128b57ab9124))
- 🐛 get-actor with non-PC ([9823dcb](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/9823dcb81b75b99a2d403d8825010a342651410b))
- 🐛 isOffensive should not account null value ([cc9ee96](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/cc9ee96c53dbfc8a22ea4b0d3a20b803debe831c))
- 🐛 messaging-system ([aa0a169](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/aa0a169f8f2c64010b24cf17ff9dccd52c7b850a))
- 🐛 Move text enricher into init ([6051969](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/6051969e5e2b7b579416dd8d2e7017b4defc08bc))
- 🐛 Repair all broken binaries ([d374ef7](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/d374ef781c18fa07824e17fc21489e4268d56482))
- 🐛 Repair links in the readme ([47900de](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/47900dedc2030132a535cf2bf6b18dec7aa0b301))
- 🐛 Resolve recover rule ([44b97f4](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/44b97f4a965e4a30cd077d321df9e27c7bc04008))
- 🐛 settings ([52cd5aa](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/52cd5aaf5526511b6fa1b731524d9a639ba16d81))
- 🐛 Style issue with Minimal UI module ([0e8caf5](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/0e8caf5c2bdae0ce034ab96e6b20dbf44e3ca6a6))
- 🐛 weapon enricher ([d740079](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/d740079b75c4aaa1234772de404d1e221211fba0))
- **Actor:** 🐛 Add if clause for img replacement on precreate ([57def81](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/57def81230aa0745e67441938478a04a42b5630a))
- **Actor:** 🐛 Remove deprecation warning for message.roll ([b3238da](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/b3238dad64230ee991357fb69396f5016e6bfabc))
- Add correct FL shop url link ([0519122](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/05191228776f25eddcada74545adae529c974944))
- **Assets:** 🐛 Repair character sheet background ([e2efb4f](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/e2efb4ffb8abea04329459f2f5cc1802900b4a2b))
- **Chat:** 🐛 Preserve flavor between roll pushes ([0faa53c](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/0faa53c88e3fcbe3d36a7c8be344311839354f5f))
- **Enrichers:** 🐛 Show description only when needed ([5892074](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/58920749655c248274dc7ad541754ea6391bd067))
- **Game-Pause:** Add the LADP badge to the system ([9beb8cc](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/9beb8ccd7ca6f15fc582eef9aea0c0f5e94c1079))
- **Item-Sheet:** 🐛 Display the roll item button when needed ([0140f90](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/0140f9038a5e69d29f7dcb0f1fd2b7086a52ab14))
- **Item:** 🐛 toMessage resource name ([90e1af1](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/90e1af17c812d0b5a79ae255dfc3510ea48da6be))
- **loot-sheet:** 🐛 Remove roll header button ([7083d49](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/7083d49e793755092cb83522c273274940efbb44))
- **Manifest:** 🐛 splash screen ([cea4089](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/cea4089d86734bcc59b45f0e3a70f5ac4762d426))
- **Partial-sheet:** 🐛 Add missing class ([2ae33b0](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/2ae33b04e881943339ffb6d6aba47bdaa212854d))
- **Readme:** 🐛 Make the download tag automatic ([45220af](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/45220afa02e18fdea5abe4ede1698a76677f670f))
- **Readme:** Add banner ([d866904](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/d8669045413614d20f057f4a9fce84110b5d385f))
- **readme:** Fix badges ([b6be1fa](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/b6be1fa0e2b5b4ba5a4d89f0d960812d9bb87e83))
- **Release:** Correct autopublish crash ([835be31](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/835be31075624bf1325d80465d8b4994f00ea1de))
- **Roller:** 🐛 Add result.locked reset ([d9aa673](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/d9aa673f223c4fa497deb6ae5e98b1333b3701ac))
- **Roller:** 🐛 Ignore dice of size 0 ([c3bfc53](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/c3bfc533ebcd1817d1a56492a565094ccf1d1a52))
- **Roller:** 🐛 Issue with disadvantage on two dice with the same value ([7fac63a](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/7fac63a4f742ebbd40a68e3a7a8e88a080754a2c)), closes [#14](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/issues/14)
- **Utils:** 🐛 Check canvas for get-actor ([47781ed](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/47781ed6c4a0716eb0d9f4c78851ca550465cc38))
- **Vehicle-sheet:** 🐛 Empty button seat ([31e051c](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/31e051cf3060baa0786fcdb1bff325916d981686))
- **Vehicle:** 🐛 Apply damage to vehicles ([b8042e1](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/b8042e11089631a14d8be666aa0a110dc297613c))

## [10.0.2](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/compare/9.0.0...10.0.2) (2022-12-05)

### Features

- ✨ Add @FontAwesomeIcon enricher ([416537d](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/416537da23bb8f2ad11621b5765958f73b26eef5))
- ✨ Add 10.0.1 message ([4045703](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/4045703ba3f72a7126f503a3624a7aa98973b06a))
- ✨ Add custom a.inline-roll event listener ([c96ceee](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/c96ceee4a2c2b695bee3a13e1b1cfcd351f03248))
- ✨ Add custom text editor enrichers ([eac7d99](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/eac7d9972066042a15bdb536f75718f8bbbca4b7))
- ✨ Add drag & drop hotbar macros support ([43b1f37](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/43b1f3745451630948d9b9ae3389367834334785))
- ✨ Add more custom enrichers for icons ([f0f1497](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/f0f1497ef6140015c00924269313f82b9a92f851))
- ✨ Add more screenshots ([89c1539](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/89c153918327c71fbee1e27e7aeed64cbe9a2ce9))
- ✨ Add new font style for editor ([fa059c2](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/fa059c2424dcf657da93e34442c53f9d8da0f491))
- ✨ Add screenshots ([fe896ac](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/fe896ac44ea83f1f2fdb8d7e1636cdab56c7a81d))
- ✨ Finalize enricher ([3c65fdb](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/3c65fdb0f5d712e79c805b08768964ecacc7ad4d))
- **Actor:** ✨ Drag'n drop Actions ([53b42d2](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/53b42d2d46581adfdb0ded05958a2da6ad047086))
- **Assets:** ✨ Add new screenshots ([73dc71a](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/73dc71a00949e46037470a7468d31c3a284d8888))
- **Character:** ✨ Add "mvr" attribute in sheet config ([cd35efc](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/cd35efc50e9fc71a81b10524a9e34ddf0080fd5a))
- **Character:** ✨ Add [@max](https://github.com/max)Push to rollData ([e92cfa9](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/e92cfa918adb6f38143dc9bbc08469fc8bb5d4c7))
- **DsN:** ✨ Add D3 dice preset ([07ebb93](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/07ebb93f917dfbcc1eef8b31cfcbafe98d003b63))
- **DsN:** ✨ Add default SFX ([5028d99](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/5028d995d25b97c7f5d88ac4b5e7b13b5555d6fa))
- **DsN:** ✨ Add dice icons for Dice So Nice ([ae14489](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/ae1448906e5c5ce9fd5239a1150b8789cd154745))
- **DsN:** ✨ Add template for all other dice ([569fabb](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/569fabbf0b4b36b1440d00948e5f8483e9655a9e))
- **Enricher:** ✨ Add BladeRunnerWeapon text enricher ([06cfd3b](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/06cfd3b8533d99ebbc26e5ee8b1e2fd75860ad7c))
- **Enrichers:** ✨ Add Blade Runner Actor enricher ([400007d](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/400007d1aa3a999d109124edf52ac97aa0de0109))
- **Enrichers:** ✨ Add BR symbol enricher ([ad2afa2](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/ad2afa2d776f748b1af12f84f213b0a50b61ffe7))
- **Enrichers:** ✨ Add Handout enricher ([b81f7ca](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/b81f7ca2f238c762675162363148a9ea3d06c01f))
- **Item:** ✨ Add consumable option ([c6daeb9](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/c6daeb95d29cf9458da34d0a5329cd6cf068b501))
- **Modifiers:** ✨ Add a Health & Resolve modifier option for items ([8401ae2](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/8401ae2da8f657d829da730364960ac4809755ee))
- **Modifiers:** ✨ Add careful-aim default for ranged attacks ([292f121](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/292f121034903ae899237b4cdf997dda9e2975ba))
- **Roll:** ✨ Add infos in chat card ([0ee0067](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/0ee0067ecb10d513fd8bd7747273deb4c3d823dc))
- **Roller:** ✨ Add push selection dialog ([e74a3da](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/e74a3da39f73b1e654e701733f138d945732785f))
- **Settings:** ✨ Add auto armor setting ([1fff642](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/1fff642c81880255478bca107b22a2cd2451b6c8))
- **Weapon-Damage-Type:** ✨ Add a third damage type as Stress ([cde2ea9](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/cde2ea968eec4432f57331bcea6804f142097596))

### Bug Fixes

- 🐛 Add enriched HTML to description fields ([a66a920](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/a66a920135a17ad128a02d4ff97370d3c6d78664))
- 🐛 Correct success (eye) symbol for text ([273577b](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/273577b54f82f7396cd34b68853acff99aa8194b))
- 🐛 createActor starting data ([02b2f94](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/02b2f940e668c4dda4dc2426b9b0674764b23c4f))
- 🐛 Enrich item tooltip and description in Actor sheet ([b5e4cd9](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/b5e4cd97992c08be46791ef7c3ee94634b190387))
- 🐛 Enrich modifier description in roll dialog ([22a9f16](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/22a9f164c3b00dd9d29883a1cca6e2daf2eab691))
- 🐛 enricher ([d78d58b](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/d78d58b874021930f72b85f0c2d7128b57ab9124))
- 🐛 isOffensive should not account null value ([cc9ee96](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/cc9ee96c53dbfc8a22ea4b0d3a20b803debe831c))
- 🐛 messaging-system ([aa0a169](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/aa0a169f8f2c64010b24cf17ff9dccd52c7b850a))
- 🐛 Move text enricher into init ([6051969](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/6051969e5e2b7b579416dd8d2e7017b4defc08bc))
- 🐛 Repair all broken binaries ([d374ef7](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/d374ef781c18fa07824e17fc21489e4268d56482))
- 🐛 Repair links in the readme ([47900de](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/47900dedc2030132a535cf2bf6b18dec7aa0b301))
- 🐛 Resolve recover rule ([44b97f4](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/44b97f4a965e4a30cd077d321df9e27c7bc04008))
- 🐛 weapon enricher ([d740079](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/d740079b75c4aaa1234772de404d1e221211fba0))
- **Actor:** 🐛 Remove deprecation warning for message.roll ([b3238da](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/b3238dad64230ee991357fb69396f5016e6bfabc))
- **Assets:** 🐛 Repair character sheet background ([e2efb4f](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/e2efb4ffb8abea04329459f2f5cc1802900b4a2b))
- **Chat:** 🐛 Preserve flavor between roll pushes ([0faa53c](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/0faa53c88e3fcbe3d36a7c8be344311839354f5f))
- **Enrichers:** 🐛 Show description only when needed ([5892074](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/58920749655c248274dc7ad541754ea6391bd067))
- **Game-Pause:** Add the LADP badge to the system ([9beb8cc](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/9beb8ccd7ca6f15fc582eef9aea0c0f5e94c1079))
- **Item-Sheet:** 🐛 Display the roll item button when needed ([0140f90](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/0140f9038a5e69d29f7dcb0f1fd2b7086a52ab14))
- **Item:** 🐛 toMessage resource name ([90e1af1](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/90e1af17c812d0b5a79ae255dfc3510ea48da6be))
- **Manifest:** 🐛 splash screen ([cea4089](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/cea4089d86734bcc59b45f0e3a70f5ac4762d426))
- **Readme:** Add banner ([d866904](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/d8669045413614d20f057f4a9fce84110b5d385f))
- **readme:** Fix badges ([b6be1fa](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/b6be1fa0e2b5b4ba5a4d89f0d960812d9bb87e83))
- **Roller:** 🐛 Add result.locked reset ([d9aa673](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/d9aa673f223c4fa497deb6ae5e98b1333b3701ac))
- **Roller:** 🐛 Ignore dice of size 0 ([c3bfc53](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/c3bfc533ebcd1817d1a56492a565094ccf1d1a52))
- **Roller:** 🐛 Issue with disadvantage on two dice with the same value ([7fac63a](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/7fac63a4f742ebbd40a68e3a7a8e88a080754a2c)), closes [#14](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/issues/14)
- **Utils:** 🐛 Check canvas for get-actor ([47781ed](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/commit/47781ed6c4a0716eb0d9f4c78851ca550465cc38))
