:robot: I have created a release *beep* *boop*
---


<details><summary>agent-crew: 5.0.0</summary>

## [5.0.0](https://github.com/g0rdonL/paseo-plugins/compare/agent-crew-v4.1.4...agent-crew-v5.0.0) (2026-11-17)


###   BREAKING CHANGES

* **agent-crew:** agent-crew now requires Paseo 0.13. The manifest range is ^0.13.0 because useTabState and the unified client UI entry do not exist on 0.12.
* **agent-crew:** requires Paseo ^0.12.0. The includeBackground option throws on older hosts.
* the affected plugins no longer load on Paseo 0.9 or 0.10. Screen and sidebar IDs, params and settings are unchanged.
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170))

### Features

* add listing icon to plugin manifests ([#418](https://github.com/g0rdonL/paseo-plugins/issues/418)) ([2e7aadd](https://github.com/g0rdonL/paseo-plugins/commit/2e7aaddac381bb2a5c596f95b1f9b7b8aee89cb2))
* **agent-crew:** add opt-in Explorer auto-open ([#146](https://github.com/g0rdonL/paseo-plugins/issues/146)) ([@tensorcopy](https://github.com/tensorcopy)) ([b4e43a0](https://github.com/g0rdonL/paseo-plugins/commit/b4e43a00b86a29533d73b18f9bb100bcc46584b9))
* **agent-crew:** add steer choice and active crews sidebar row ([#261](https://github.com/g0rdonL/paseo-plugins/issues/261)) ([8a0856f](https://github.com/g0rdonL/paseo-plugins/commit/8a0856f9c18f85b4d29145450d8b634541af78b5))
* **agent-crew:** require Paseo 0.13 and persist panel state ([#382](https://github.com/g0rdonL/paseo-plugins/issues/382)) ([04c91a9](https://github.com/g0rdonL/paseo-plugins/commit/04c91a942f447b2469b759f28720761a64502214))
* **plugins:** declare Paseo 0.11 compatibility ([#248](https://github.com/g0rdonL/paseo-plugins/issues/248)) ([f983a8b](https://github.com/g0rdonL/paseo-plugins/commit/f983a8bf2025f009c178c15183d6cfac0b2024dd))
* **plugins:** support Paseo 0.10.1 ([#221](https://github.com/g0rdonL/paseo-plugins/issues/221)) ([9d71ea0](https://github.com/g0rdonL/paseo-plugins/commit/9d71ea09eaa9ed67429813ed3e2de2567c14c825))
* **release:** publish plugins to npm ([#80](https://github.com/g0rdonL/paseo-plugins/issues/80)) ([3c93048](https://github.com/g0rdonL/paseo-plugins/commit/3c93048cfefda97d8c2bc1631e3428fb64bdad09))
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170)) ([04acfca](https://github.com/g0rdonL/paseo-plugins/commit/04acfcabcf8140edbd3a98681a72cabef7bb74ba))
* require Paseo 0.11 and drop legacy surface navigation ([#286](https://github.com/g0rdonL/paseo-plugins/issues/286)) ([a46fe9e](https://github.com/g0rdonL/paseo-plugins/commit/a46fe9ee910c2cc485043d53c67dacf49bab402b))


### Bug Fixes

* **agent-crew:** allow nudging idle-released closed agents ([#413](https://github.com/g0rdonL/paseo-plugins/issues/413)) ([c81ee3b](https://github.com/g0rdonL/paseo-plugins/commit/c81ee3b362155e5cb9416b351ecb27a7c1ab7bfb))
* **agent-crew:** hide Paseo background helpers from the crew ([#600](https://github.com/g0rdonL/paseo-plugins/issues/600)) ([311d350](https://github.com/g0rdonL/paseo-plugins/commit/311d350c52e4104b8d1d6dacd9bcc0897fc09af0))
* **agent-crew:** include background workspaces ([#348](https://github.com/g0rdonL/paseo-plugins/issues/348)) ([3e590c1](https://github.com/g0rdonL/paseo-plugins/commit/3e590c13567604981d231658951d45cd09d35bf4))
* **agent-crew:** keep auto-open claims after repeated failures and stop opening panels once disabled ([#552](https://github.com/g0rdonL/paseo-plugins/issues/552)) ([41a6784](https://github.com/g0rdonL/paseo-plugins/commit/41a678470dc938b60724f7a8249cc01394082df8))
* **agent-crew:** keep auto-open running through a transient settings read error ([#553](https://github.com/g0rdonL/paseo-plugins/issues/553)) ([6c890e2](https://github.com/g0rdonL/paseo-plugins/commit/6c890e232733f0af37842cf4d5c999fddecd65c9))
* **agent-crew:** observe owned directories ([#160](https://github.com/g0rdonL/paseo-plugins/issues/160)) ([a89e2e2](https://github.com/g0rdonL/paseo-plugins/commit/a89e2e2a0082dcd42d3d44585089206047c98918))
* **agent-crew:** support Paseo 0.9 beta ([#90](https://github.com/g0rdonL/paseo-plugins/issues/90)) ([d2d3114](https://github.com/g0rdonL/paseo-plugins/commit/d2d3114bfcca63e0c184e9be4843a941a1fb56b6))
* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
* **plugins:** accept Paseo 0.13 in the plugin manifest range ([bdb9435](https://github.com/g0rdonL/paseo-plugins/commit/bdb943595515ab7f21a93c66cffeb6844bacdcdb))
* **plugins:** declare Paseo 0.12 compatibility ([7dbbe2a](https://github.com/g0rdonL/paseo-plugins/commit/7dbbe2a15aa7fb92ae846afa89a174cbed749f8e))
* **plugins:** prepare for Paseo 0.10 beta ([#186](https://github.com/g0rdonL/paseo-plugins/issues/186)) ([0294fd0](https://github.com/g0rdonL/paseo-plugins/commit/0294fd0fd7ad5101e724d4196a49ac27783b5483))
* **plugins:** ship OVERVIEW.md in published packages ([640f9a4](https://github.com/g0rdonL/paseo-plugins/commit/640f9a4d7bd6dbad226c4ee1ebaa199abfc62776))
</details>

<details><summary>tell-agent: 3.0.0</summary>

## [3.0.0](https://github.com/g0rdonL/paseo-plugins/compare/tell-agent-v2.0.2...tell-agent-v3.0.0) (2026-11-17)


###   BREAKING CHANGES

* **paseo-dracula,tell-agent:** paseo-dracula and tell-agent no longer support Paseo 0.9 or 0.10.
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170))

### Features

* **paseo-dracula,tell-agent:** add listing icon ([#419](https://github.com/g0rdonL/paseo-plugins/issues/419)) ([2262366](https://github.com/g0rdonL/paseo-plugins/commit/2262366d69b6520752f8988c5fdfe0d0d74d312c))
* **plugins:** declare Paseo 0.11 compatibility ([#248](https://github.com/g0rdonL/paseo-plugins/issues/248)) ([f983a8b](https://github.com/g0rdonL/paseo-plugins/commit/f983a8bf2025f009c178c15183d6cfac0b2024dd))
* **plugins:** support Paseo 0.10.1 ([#221](https://github.com/g0rdonL/paseo-plugins/issues/221)) ([9d71ea0](https://github.com/g0rdonL/paseo-plugins/commit/9d71ea09eaa9ed67429813ed3e2de2567c14c825))
* **release:** publish plugins to npm ([#80](https://github.com/g0rdonL/paseo-plugins/issues/80)) ([3c93048](https://github.com/g0rdonL/paseo-plugins/commit/3c93048cfefda97d8c2bc1631e3428fb64bdad09))
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170)) ([04acfca](https://github.com/g0rdonL/paseo-plugins/commit/04acfcabcf8140edbd3a98681a72cabef7bb74ba))
* **tell-agent:** add cross-workspace agent messaging ([#11](https://github.com/g0rdonL/paseo-plugins/issues/11)) ([af2bf1f](https://github.com/g0rdonL/paseo-plugins/commit/af2bf1f3230653599af345ea96baeb74e17a0c66))
* **tell-agent:** steer the source agent's active turn by default ([#259](https://github.com/g0rdonL/paseo-plugins/issues/259)) ([4aaf478](https://github.com/g0rdonL/paseo-plugins/commit/4aaf4781128ae9b829f15bdcb9d12ce01f1a7a64))


### Bug Fixes

* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
* **plugins:** accept Paseo 0.13 in the plugin manifest range ([bdb9435](https://github.com/g0rdonL/paseo-plugins/commit/bdb943595515ab7f21a93c66cffeb6844bacdcdb))
* **plugins:** declare Paseo 0.12 compatibility ([7dbbe2a](https://github.com/g0rdonL/paseo-plugins/commit/7dbbe2a15aa7fb92ae846afa89a174cbed749f8e))
* **plugins:** prepare for Paseo 0.10 beta ([#186](https://github.com/g0rdonL/paseo-plugins/issues/186)) ([0294fd0](https://github.com/g0rdonL/paseo-plugins/commit/0294fd0fd7ad5101e724d4196a49ac27783b5483))
* **plugins:** ship OVERVIEW.md in published packages ([640f9a4](https://github.com/g0rdonL/paseo-plugins/commit/640f9a4d7bd6dbad226c4ee1ebaa199abfc62776))
* **tell-agent:** allow messaging idle-released closed agents ([#411](https://github.com/g0rdonL/paseo-plugins/issues/411)) ([373acab](https://github.com/g0rdonL/paseo-plugins/commit/373acab7f773b67badef1a450d7d5c26a3a88468))
* **tell-agent:** avoid unsupported client type import ([#153](https://github.com/g0rdonL/paseo-plugins/issues/153)) (@Nurshot) ([a8fc7b8](https://github.com/g0rdonL/paseo-plugins/commit/a8fc7b83321351170a086222c9ba5875ca381dee))
* **tell-agent:** follow the agent directory so new sessions get a pill ([#158](https://github.com/g0rdonL/paseo-plugins/issues/158)) ([@qinkangdeid](https://github.com/qinkangdeid)) ([aadeaac](https://github.com/g0rdonL/paseo-plugins/commit/aadeaac194513009debc921265a7fb133897d51f))
* **tell-agent:** support Paseo 0.9 beta ([#85](https://github.com/g0rdonL/paseo-plugins/issues/85)) ([f8425f6](https://github.com/g0rdonL/paseo-plugins/commit/f8425f6c4b6271db5514abe3bf3c541c6240ccef))
</details>

<details><summary>agent-monitor: 5.0.0</summary>

## [5.0.0](https://github.com/g0rdonL/paseo-plugins/compare/agent-monitor-v4.4.5...agent-monitor-v5.0.0) (2026-11-17)


###   BREAKING CHANGES

* **agent-monitor:** agent-monitor now requires Paseo 0.13; the manifest range is ^0.13.0 and Paseo 0.12 hosts are no longer supported.
* **agent-monitor:** requires Paseo ^0.12.0. The includeBackground option throws on older hosts.
* the affected plugins no longer load on Paseo 0.9 or 0.10. Screen and sidebar IDs, params and settings are unchanged.
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170))

### Features

* add listing icon to plugin manifests ([#418](https://github.com/g0rdonL/paseo-plugins/issues/418)) ([2e7aadd](https://github.com/g0rdonL/paseo-plugins/commit/2e7aaddac381bb2a5c596f95b1f9b7b8aee89cb2))
* **agent-monitor:** add an interactive agent graph ([#364](https://github.com/g0rdonL/paseo-plugins/issues/364)) ([@andresantoniuk](https://github.com/andresantoniuk)) ([4e99d73](https://github.com/g0rdonL/paseo-plugins/commit/4e99d73da8f874b9385a35fa342ce3daabac8537))
* **agent-monitor:** group and sort the roster independently ([#433](https://github.com/g0rdonL/paseo-plugins/issues/433)) ([@andresantoniuk](https://github.com/andresantoniuk)) ([c92938e](https://github.com/g0rdonL/paseo-plugins/commit/c92938ef61ea56169af06a8d051756bed365210b))
* **agent-monitor:** live sidebar row, attention popover and monitor screen params ([#256](https://github.com/g0rdonL/paseo-plugins/issues/256)) ([b6b8123](https://github.com/g0rdonL/paseo-plugins/commit/b6b8123bc985a6b7e1659099d1a8eb2fd7de5b90))
* **agent-monitor:** multi-host roster, graph and mission control ([#424](https://github.com/g0rdonL/paseo-plugins/issues/424)) ([@andresantoniuk](https://github.com/andresantoniuk)) ([60f0ab2](https://github.com/g0rdonL/paseo-plugins/commit/60f0ab221d26d398123f484e344a027544be51cd))
* **agent-monitor:** require Paseo 0.13 and handle cross-host delegated agents ([#383](https://github.com/g0rdonL/paseo-plugins/issues/383)) ([3314e99](https://github.com/g0rdonL/paseo-plugins/commit/3314e99b5ebb2177bea0c20c00a4fee249aab38e))
* **plugins:** declare Paseo 0.11 compatibility ([#248](https://github.com/g0rdonL/paseo-plugins/issues/248)) ([f983a8b](https://github.com/g0rdonL/paseo-plugins/commit/f983a8bf2025f009c178c15183d6cfac0b2024dd))
* **plugins:** support Paseo 0.10.1 ([#221](https://github.com/g0rdonL/paseo-plugins/issues/221)) ([9d71ea0](https://github.com/g0rdonL/paseo-plugins/commit/9d71ea09eaa9ed67429813ed3e2de2567c14c825))
* **release:** publish plugins to npm ([#80](https://github.com/g0rdonL/paseo-plugins/issues/80)) ([3c93048](https://github.com/g0rdonL/paseo-plugins/commit/3c93048cfefda97d8c2bc1631e3428fb64bdad09))
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170)) ([04acfca](https://github.com/g0rdonL/paseo-plugins/commit/04acfcabcf8140edbd3a98681a72cabef7bb74ba))
* require Paseo 0.11 and drop legacy surface navigation ([#286](https://github.com/g0rdonL/paseo-plugins/issues/286)) ([a46fe9e](https://github.com/g0rdonL/paseo-plugins/commit/a46fe9ee910c2cc485043d53c67dacf49bab402b))


### Bug Fixes

* **agent-monitor:** do not call addEventListener where window has none ([#430](https://github.com/g0rdonL/paseo-plugins/issues/430)) ([@andresantoniuk](https://github.com/andresantoniuk)) ([404656f](https://github.com/g0rdonL/paseo-plugins/commit/404656ff56707e86f3ae7e0b13f879eaf57b58d0))
* **agent-monitor:** hide background helpers and count background work as running ([#604](https://github.com/g0rdonL/paseo-plugins/issues/604)) ([7b52016](https://github.com/g0rdonL/paseo-plugins/commit/7b520166eccfcbbbdc0020b9785e1d7c48433221))
* **agent-monitor:** include background workspaces and page agents stably ([#346](https://github.com/g0rdonL/paseo-plugins/issues/346)) ([731b6f6](https://github.com/g0rdonL/paseo-plugins/commit/731b6f62626030e18987d690b5549e423cf2d6f7))
* **agent-monitor:** let a deep link win over a stale pending focus ([#549](https://github.com/g0rdonL/paseo-plugins/issues/549)) ([e27b280](https://github.com/g0rdonL/paseo-plugins/commit/e27b2803201fcb6e1ffa415b979bff9e0e9cc14c))
* **agent-monitor:** own directory observations ([#162](https://github.com/g0rdonL/paseo-plugins/issues/162)) ([961906c](https://github.com/g0rdonL/paseo-plugins/commit/961906c9354a5cbd1ed6d65c4e50be3b523a91f4))
* **agent-monitor:** prefer first-class parentAgentId with legacy label fallback ([#285](https://github.com/g0rdonL/paseo-plugins/issues/285)) ([2e3ce7f](https://github.com/g0rdonL/paseo-plugins/commit/2e3ce7f86e52fd2ffa448977b1e3fab5bd2f59e7))
* **agent-monitor:** stop importing types from @getpaseo/client in shipped client code ([#585](https://github.com/g0rdonL/paseo-plugins/issues/585)) ([9903409](https://github.com/g0rdonL/paseo-plugins/commit/990340905511c43731297dd7ebbb376a684118dd))
* **agent-monitor:** support Paseo 0.9 beta ([#83](https://github.com/g0rdonL/paseo-plugins/issues/83)) ([6a52638](https://github.com/g0rdonL/paseo-plugins/commit/6a52638645d6fc9b5e9b586444af561a84bcd358))
* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
* **plugins:** accept Paseo 0.13 in the plugin manifest range ([bdb9435](https://github.com/g0rdonL/paseo-plugins/commit/bdb943595515ab7f21a93c66cffeb6844bacdcdb))
* **plugins:** declare Paseo 0.12 compatibility ([7dbbe2a](https://github.com/g0rdonL/paseo-plugins/commit/7dbbe2a15aa7fb92ae846afa89a174cbed749f8e))
* **plugins:** prepare for Paseo 0.10 beta ([#186](https://github.com/g0rdonL/paseo-plugins/issues/186)) ([0294fd0](https://github.com/g0rdonL/paseo-plugins/commit/0294fd0fd7ad5101e724d4196a49ac27783b5483))
* **plugins:** ship OVERVIEW.md in published packages ([640f9a4](https://github.com/g0rdonL/paseo-plugins/commit/640f9a4d7bd6dbad226c4ee1ebaa199abfc62776))
</details>

<details><summary>fresh-worktrees: 4.0.0</summary>

## [4.0.0](https://github.com/g0rdonL/paseo-plugins/compare/fresh-worktrees-v3.1.3...fresh-worktrees-v4.0.0) (2026-11-17)


###   BREAKING CHANGES

* the affected plugins no longer load on Paseo 0.9 or 0.10. Screen and sidebar IDs, params and settings are unchanged.
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170))

### Features

* add listing icon to plugin manifests ([#418](https://github.com/g0rdonL/paseo-plugins/issues/418)) ([2e7aadd](https://github.com/g0rdonL/paseo-plugins/commit/2e7aaddac381bb2a5c596f95b1f9b7b8aee89cb2))
* **fresh-worktrees:** add sidebar footer with stale workspace count and refresh all ([#254](https://github.com/g0rdonL/paseo-plugins/issues/254)) ([ec6b461](https://github.com/g0rdonL/paseo-plugins/commit/ec6b46171f606105b7d8e09aec1ff07d3cef35a4))
* **fresh-worktrees:** keep local base branch current ([#9](https://github.com/g0rdonL/paseo-plugins/issues/9)) ([2ebd062](https://github.com/g0rdonL/paseo-plugins/commit/2ebd0620d4356103c2a162b503103090b7289add))
* **plugins:** declare Paseo 0.11 compatibility ([#248](https://github.com/g0rdonL/paseo-plugins/issues/248)) ([f983a8b](https://github.com/g0rdonL/paseo-plugins/commit/f983a8bf2025f009c178c15183d6cfac0b2024dd))
* **plugins:** support Paseo 0.10.1 ([#221](https://github.com/g0rdonL/paseo-plugins/issues/221)) ([9d71ea0](https://github.com/g0rdonL/paseo-plugins/commit/9d71ea09eaa9ed67429813ed3e2de2567c14c825))
* **release:** publish plugins to npm ([#80](https://github.com/g0rdonL/paseo-plugins/issues/80)) ([3c93048](https://github.com/g0rdonL/paseo-plugins/commit/3c93048cfefda97d8c2bc1631e3428fb64bdad09))
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170)) ([04acfca](https://github.com/g0rdonL/paseo-plugins/commit/04acfcabcf8140edbd3a98681a72cabef7bb74ba))
* require Paseo 0.11 and drop legacy surface navigation ([#286](https://github.com/g0rdonL/paseo-plugins/issues/286)) ([a46fe9e](https://github.com/g0rdonL/paseo-plugins/commit/a46fe9ee910c2cc485043d53c67dacf49bab402b))


### Bug Fixes

* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
* **fresh-worktrees:** prepare for Paseo 0.9 ([#84](https://github.com/g0rdonL/paseo-plugins/issues/84)) ([17e45c2](https://github.com/g0rdonL/paseo-plugins/commit/17e45c2b3687949340339bcc0146563be6e9c631))
* **fresh-worktrees:** prevent freshness RPC storms ([#28](https://github.com/g0rdonL/paseo-plugins/issues/28)) ([6244ebe](https://github.com/g0rdonL/paseo-plugins/commit/6244ebec4dee63694fa16a376877453510d9364f))
* **fresh-worktrees:** share a refresh only between callers with the same signal ([#547](https://github.com/g0rdonL/paseo-plugins/issues/547)) ([2c16a8f](https://github.com/g0rdonL/paseo-plugins/commit/2c16a8f5c6bc195a2ba3c52718b225151593b208))
* **fresh-worktrees:** use host-owned workspace subscriptions ([#128](https://github.com/g0rdonL/paseo-plugins/issues/128)) ([ec8e64c](https://github.com/g0rdonL/paseo-plugins/commit/ec8e64cb96f2bf48cb68be06280c4d039a46cec7))
* **plugins:** accept Paseo 0.13 in the plugin manifest range ([bdb9435](https://github.com/g0rdonL/paseo-plugins/commit/bdb943595515ab7f21a93c66cffeb6844bacdcdb))
* **plugins:** declare Paseo 0.12 compatibility ([7dbbe2a](https://github.com/g0rdonL/paseo-plugins/commit/7dbbe2a15aa7fb92ae846afa89a174cbed749f8e))
* **plugins:** prepare for Paseo 0.10 beta ([#186](https://github.com/g0rdonL/paseo-plugins/issues/186)) ([0294fd0](https://github.com/g0rdonL/paseo-plugins/commit/0294fd0fd7ad5101e724d4196a49ac27783b5483))
* **plugins:** ship OVERVIEW.md in published packages ([640f9a4](https://github.com/g0rdonL/paseo-plugins/commit/640f9a4d7bd6dbad226c4ee1ebaa199abfc62776))
</details>

<details><summary>paseo-beads: 4.0.0</summary>

## [4.0.0](https://github.com/g0rdonL/paseo-plugins/compare/paseo-beads-v3.1.2...paseo-beads-v4.0.0) (2026-11-17)


###   BREAKING CHANGES

* **paseo-beads:** paseo-beads now requires Paseo 0.13. Paseo 0.11 and 0.12 are no longer supported.
* the affected plugins no longer load on Paseo 0.9 or 0.10. Screen and sidebar IDs, params and settings are unchanged.
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170))

### Features

* add listing icon to plugin manifests ([#418](https://github.com/g0rdonL/paseo-plugins/issues/418)) ([2e7aadd](https://github.com/g0rdonL/paseo-plugins/commit/2e7aaddac381bb2a5c596f95b1f9b7b8aee89cb2))
* **paseo-beads:** add workspace bead viewer ([#13](https://github.com/g0rdonL/paseo-plugins/issues/13)) ([96e02e5](https://github.com/g0rdonL/paseo-plugins/commit/96e02e5521521b738cf11e8240d3926849898c3e))
* **paseo-beads:** ready beads sidebar row, popover and linkable bead screen on Paseo 0.11 ([#260](https://github.com/g0rdonL/paseo-plugins/issues/260)) ([104f416](https://github.com/g0rdonL/paseo-plugins/commit/104f4168d0a9c4f931f3e9f30b1a551b10ee5342))
* **paseo-beads:** require Paseo 0.13, render Markdown and persist panel state ([#381](https://github.com/g0rdonL/paseo-plugins/issues/381)) ([3cb15d1](https://github.com/g0rdonL/paseo-plugins/commit/3cb15d10c698bfaba4060c1cfb7e7c0b56eec707))
* **plugins:** declare Paseo 0.11 compatibility ([#248](https://github.com/g0rdonL/paseo-plugins/issues/248)) ([f983a8b](https://github.com/g0rdonL/paseo-plugins/commit/f983a8bf2025f009c178c15183d6cfac0b2024dd))
* **plugins:** support Paseo 0.10.1 ([#221](https://github.com/g0rdonL/paseo-plugins/issues/221)) ([9d71ea0](https://github.com/g0rdonL/paseo-plugins/commit/9d71ea09eaa9ed67429813ed3e2de2567c14c825))
* **release:** publish plugins to npm ([#80](https://github.com/g0rdonL/paseo-plugins/issues/80)) ([3c93048](https://github.com/g0rdonL/paseo-plugins/commit/3c93048cfefda97d8c2bc1631e3428fb64bdad09))
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170)) ([04acfca](https://github.com/g0rdonL/paseo-plugins/commit/04acfcabcf8140edbd3a98681a72cabef7bb74ba))
* require Paseo 0.11 and drop legacy surface navigation ([#286](https://github.com/g0rdonL/paseo-plugins/issues/286)) ([a46fe9e](https://github.com/g0rdonL/paseo-plugins/commit/a46fe9ee910c2cc485043d53c67dacf49bab402b))


### Bug Fixes

* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
* **paseo-beads:** support Paseo 0.9 beta ([#87](https://github.com/g0rdonL/paseo-plugins/issues/87)) ([7c895c8](https://github.com/g0rdonL/paseo-plugins/commit/7c895c8a82541e2e2d7d626a8f1d9ef28d6c7536))
* **plugins:** accept Paseo 0.13 in the plugin manifest range ([bdb9435](https://github.com/g0rdonL/paseo-plugins/commit/bdb943595515ab7f21a93c66cffeb6844bacdcdb))
* **plugins:** declare Paseo 0.12 compatibility ([7dbbe2a](https://github.com/g0rdonL/paseo-plugins/commit/7dbbe2a15aa7fb92ae846afa89a174cbed749f8e))
* **plugins:** prepare for Paseo 0.10 beta ([#186](https://github.com/g0rdonL/paseo-plugins/issues/186)) ([0294fd0](https://github.com/g0rdonL/paseo-plugins/commit/0294fd0fd7ad5101e724d4196a49ac27783b5483))
* **plugins:** ship OVERVIEW.md in published packages ([640f9a4](https://github.com/g0rdonL/paseo-plugins/commit/640f9a4d7bd6dbad226c4ee1ebaa199abfc62776))
</details>

<details><summary>paseo-omp: 6.0.0</summary>

## [6.0.0](https://github.com/g0rdonL/paseo-plugins/compare/paseo-omp-v5.7.0...paseo-omp-v6.0.0) (2026-11-17)


###   BREAKING CHANGES

* **paseo-omp:** requires Paseo ^0.14.0
* **paseo-omp:** paseo-omp now requires Paseo 0.13 (^0.13.0) on the daemon and every app loading the client entry.
* **paseo-omp:** requires Paseo ^0.12.0. The includeBackground option throws on older hosts.
* **paseo-omp:** on Paseo 0.11 hosts a missing default OMP executable blocks create, resume, and draft operations, including agents configured with a per-agent command.
* the affected plugins no longer load on Paseo 0.9 or 0.10. Screen and sidebar IDs, params and settings are unchanged.
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170))

### Features

* add listing icon to plugin manifests ([#418](https://github.com/g0rdonL/paseo-plugins/issues/418)) ([2e7aadd](https://github.com/g0rdonL/paseo-plugins/commit/2e7aaddac381bb2a5c596f95b1f9b7b8aee89cb2))
* **paseo-omp:** accounts tab for OMP logins, usage, resets and balancing ([#491](https://github.com/g0rdonL/paseo-plugins/issues/491)) ([2ab33c4](https://github.com/g0rdonL/paseo-plugins/commit/2ab33c4e283b4397298b2afa1a8ec4201cc53195))
* **paseo-omp:** add a read-only Rules tab ([#506](https://github.com/g0rdonL/paseo-plugins/issues/506)) ([8c4ac69](https://github.com/g0rdonL/paseo-plugins/commit/8c4ac692e02947af376d048ec770d91ac83c8bc4))
* **paseo-omp:** add a read-only Security tab with scan phase and finding counts ([#523](https://github.com/g0rdonL/paseo-plugins/issues/523)) ([7cd5bbe](https://github.com/g0rdonL/paseo-plugins/commit/7cd5bbed6fbb8303e87b89bd659517854a4e4696))
* **paseo-omp:** add a Tool policy card to the Configuration tab ([#518](https://github.com/g0rdonL/paseo-plugins/issues/518)) ([4f89c49](https://github.com/g0rdonL/paseo-plugins/commit/4f89c496e3cf79f76bbb1f7c06e75f0924001eb6))
* **paseo-omp:** add Budget settings for session spend warning and limit ([#507](https://github.com/g0rdonL/paseo-plugins/issues/507)) ([b5e4666](https://github.com/g0rdonL/paseo-plugins/commit/b5e466642759c4da6ee9faf54583b971b4255ce6))
* **paseo-omp:** add config workspace shell ([#48](https://github.com/g0rdonL/paseo-plugins/issues/48)) ([1c0126b](https://github.com/g0rdonL/paseo-plugins/commit/1c0126b51bd3c8ceccacf7758fc14270cd67440e))
* **paseo-omp:** add Extensions tab for extensions, hooks and custom tools ([#514](https://github.com/g0rdonL/paseo-plugins/issues/514)) ([fdc7973](https://github.com/g0rdonL/paseo-plugins/commit/fdc7973b6b73302bf8a56c125afa03a662f2ce0b))
* **paseo-omp:** add first OMP provider plugin ([#19](https://github.com/g0rdonL/paseo-plugins/issues/19)) ([f6f3e5e](https://github.com/g0rdonL/paseo-plugins/commit/f6f3e5e224bf8537f85305d79ea5d1bcf5849549))
* **paseo-omp:** add first-class MCP management ([#64](https://github.com/g0rdonL/paseo-plugins/issues/64)) ([5a8fefa](https://github.com/g0rdonL/paseo-plugins/commit/5a8fefa9148e8d01f0461aa4a90619ec6ae2c2fa))
* **paseo-omp:** add guided model role picker ([#108](https://github.com/g0rdonL/paseo-plugins/issues/108)) ([23be6ff](https://github.com/g0rdonL/paseo-plugins/commit/23be6ff4f8dd7aad8c331b08e50ce28820be4c56))
* **paseo-omp:** add host inherited environment settings ([#159](https://github.com/g0rdonL/paseo-plugins/issues/159)) ([b3c80d9](https://github.com/g0rdonL/paseo-plugins/commit/b3c80d991d1b72de872afdd32e2a531e01569b13))
* **paseo-omp:** add MCPs tab with browser authorization ([#497](https://github.com/g0rdonL/paseo-plugins/issues/497)) ([e799d2a](https://github.com/g0rdonL/paseo-plugins/commit/e799d2a3552cbb19f5b5c346c438c33abc390bd5))
* **paseo-omp:** add opt-in output redaction ([#44](https://github.com/g0rdonL/paseo-plugins/issues/44)) ([0b0cea1](https://github.com/g0rdonL/paseo-plugins/commit/0b0cea1501230437fe4d6390b67ca25ee2079c93))
* **paseo-omp:** add Skills tab with per-skill on/off and learned-skill delete ([#512](https://github.com/g0rdonL/paseo-plugins/issues/512)) ([0d37c15](https://github.com/g0rdonL/paseo-plugins/commit/0d37c15ee01962f2b2ff632dea28c8bf9cad3bcd))
* **paseo-omp:** add support diagnostics help report ([#120](https://github.com/g0rdonL/paseo-plugins/issues/120)) ([b567c87](https://github.com/g0rdonL/paseo-plugins/commit/b567c87a7a0a0e7cdb6da111e667ba1a15a4f651))
* **paseo-omp:** add workspace-scoped OMP management ([#59](https://github.com/g0rdonL/paseo-plugins/issues/59)) ([2807aec](https://github.com/g0rdonL/paseo-plugins/commit/2807aec6217ed2d52f8b4666f0a41a688109f8f5))
* **paseo-omp:** adopt Paseo 0.11 screens and hub sidebar row ([#262](https://github.com/g0rdonL/paseo-plugins/issues/262)) ([557e726](https://github.com/g0rdonL/paseo-plugins/commit/557e726d8000ef353b1d99664f93cd6d61bf93ad))
* **paseo-omp:** browse complete runtime settings catalog ([#49](https://github.com/g0rdonL/paseo-plugins/issues/49)) ([ef68cd7](https://github.com/g0rdonL/paseo-plugins/commit/ef68cd754fa3aad4a15bcdc8649f8c7dcdcde79e))
* **paseo-omp:** check models.yml for errors and add a Refresh models action in Diagnostics ([#520](https://github.com/g0rdonL/paseo-plugins/issues/520)) ([08114e2](https://github.com/g0rdonL/paseo-plugins/commit/08114e222ef596545856421fb35265de45aa9efb))
* **paseo-omp:** edit lsp.json and dap.json in the Configuration tab ([#527](https://github.com/g0rdonL/paseo-plugins/issues/527)) ([f2d194a](https://github.com/g0rdonL/paseo-plugins/commit/f2d194ada83eee7a785b3f31b0f434d2144f49a4))
* **paseo-omp:** edit scalar settings in sidebar ([#50](https://github.com/g0rdonL/paseo-plugins/issues/50)) ([78da43f](https://github.com/g0rdonL/paseo-plugins/commit/78da43fd155ed06e29faef507156399b55cf3439))
* **paseo-omp:** enlarge OMP tool images on click ([#439](https://github.com/g0rdonL/paseo-plugins/issues/439)) ([@ogzerber](https://github.com/ogzerber)) ([c734f2b](https://github.com/g0rdonL/paseo-plugins/commit/c734f2bfcf1c936d9cb7215ec8ea55cb172436d5))
* **paseo-omp:** explain OMP's magic keywords and their off switches in the Help tab ([#526](https://github.com/g0rdonL/paseo-plugins/issues/526)) ([5dec591](https://github.com/g0rdonL/paseo-plugins/commit/5dec59145c5dd270ed2a925473faa446130defca))
* **paseo-omp:** explain the secrets setting and its limits in the Configuration tab ([#511](https://github.com/g0rdonL/paseo-plugins/issues/511)) ([bbee836](https://github.com/g0rdonL/paseo-plugins/commit/bbee8362bb6f242584adc099b8c3731013f89944))
* **paseo-omp:** explain tool access boundary and mark quotas as recorded usage ([#277](https://github.com/g0rdonL/paseo-plugins/issues/277)) ([a479d4a](https://github.com/g0rdonL/paseo-plugins/commit/a479d4ab7c15f91dd37c2f30c102c0ed4b063f68))
* **paseo-omp:** gate provider operations on default OMP detection ([#287](https://github.com/g0rdonL/paseo-plugins/issues/287)) ([e8fc770](https://github.com/g0rdonL/paseo-plugins/commit/e8fc770e8cfbf2113fb2ef72be90590c778e3d88))
* **paseo-omp:** group the optional-tool switches in the Configuration Tools category ([#515](https://github.com/g0rdonL/paseo-plugins/issues/515)) ([692431c](https://github.com/g0rdonL/paseo-plugins/commit/692431c20e04d4fed807785249dc8407078dab6e))
* **paseo-omp:** label Copilot accounts with username and GHE host ([#624](https://github.com/g0rdonL/paseo-plugins/issues/624)) ([@taemire](https://github.com/taemire)) ([80d57b5](https://github.com/g0rdonL/paseo-plugins/commit/80d57b5d92fdaba0e182930ce6c663d846dbe531))
* **paseo-omp:** link each rule-fired notice to that rule ([#532](https://github.com/g0rdonL/paseo-plugins/issues/532)) ([53cced1](https://github.com/g0rdonL/paseo-plugins/commit/53cced1f3fe33a98140725be0a6ad9c8c7bc5eeb))
* **paseo-omp:** list, download and assign OMP local models in the Configuration tab ([#528](https://github.com/g0rdonL/paseo-plugins/issues/528)) ([38efe42](https://github.com/g0rdonL/paseo-plugins/commit/38efe42d07aa89781b0a6ad38f2038a28ad948dd))
* **paseo-omp:** make composer pills configurable ([#76](https://github.com/g0rdonL/paseo-plugins/issues/76)) ([28e7501](https://github.com/g0rdonL/paseo-plugins/commit/28e75011a06a11cdc963187aa4106dfc21d561e6))
* **paseo-omp:** make the plugin's own providers opt-in for new installs ([#541](https://github.com/g0rdonL/paseo-plugins/issues/541)) ([f2835a2](https://github.com/g0rdonL/paseo-plugins/commit/f2835a2cd12e04ea5ed3b6a4c01a750e94989774))
* **paseo-omp:** make the session limit host-wide and configurable ([#427](https://github.com/g0rdonL/paseo-plugins/issues/427)) ([@georgepullen](https://github.com/georgepullen)) ([d1e81e1](https://github.com/g0rdonL/paseo-plugins/commit/d1e81e181876922d8fa8d02988b5b88b4c621b6a))
* **paseo-omp:** manage OMP marketplace catalogs from the plugins tab ([#508](https://github.com/g0rdonL/paseo-plugins/issues/508)) ([32cb260](https://github.com/g0rdonL/paseo-plugins/commit/32cb26062890b50cc3343641434941cbc7093547))
* **paseo-omp:** pick subagent names and switch agents off in the routing editor ([#516](https://github.com/g0rdonL/paseo-plugins/issues/516)) ([790dd74](https://github.com/g0rdonL/paseo-plugins/commit/790dd74c153f72260ac62be503db5a21848dd768))
* **paseo-omp:** remove the Sessions composer pill ([#505](https://github.com/g0rdonL/paseo-plugins/issues/505)) ([29e62fc](https://github.com/g0rdonL/paseo-plugins/commit/29e62fce7183566a18edc628094d7dfb21de31e9))
* **paseo-omp:** require Paseo 0.13 ([#385](https://github.com/g0rdonL/paseo-plugins/issues/385)) ([c7771f8](https://github.com/g0rdonL/paseo-plugins/commit/c7771f80299f45805cb159ddbd485861d3413346))
* **paseo-omp:** show ast_edit previews as a read-only diff card ([#519](https://github.com/g0rdonL/paseo-plugins/issues/519)) ([1a9a62d](https://github.com/g0rdonL/paseo-plugins/commit/1a9a62d0cc9d714d1a6f3a08a76d0c05208d1305))
* **paseo-omp:** show eval screenshots on bundled omp agents ([#525](https://github.com/g0rdonL/paseo-plugins/issues/525)) ([a49863a](https://github.com/g0rdonL/paseo-plugins/commit/a49863a38d0ec7fb65b52ec94ea7532ed6c73061))
* **paseo-omp:** show generate_image results with a thumbnail and download ([#513](https://github.com/g0rdonL/paseo-plugins/issues/513)) ([eb747df](https://github.com/g0rdonL/paseo-plugins/commit/eb747dffb89de27765330622a292ee109c800901))
* **paseo-omp:** show how often each rule fired in the Rules tab ([#533](https://github.com/g0rdonL/paseo-plugins/issues/533)) ([2605f75](https://github.com/g0rdonL/paseo-plugins/commit/2605f75a13a08755393b0d3f5ae2f4ff74c457da))
* **paseo-omp:** show lsp diagnostics as a card on bundled omp agents ([#510](https://github.com/g0rdonL/paseo-plugins/issues/510)) ([cb7cab3](https://github.com/g0rdonL/paseo-plugins/commit/cb7cab3b38aa6f54bb5e4fab2924293f898aaaf0))
* **paseo-omp:** show OMP rule notices for bundled omp agents ([#504](https://github.com/g0rdonL/paseo-plugins/issues/504)) ([b198fcc](https://github.com/g0rdonL/paseo-plugins/commit/b198fccfb7eb5a1912389121a59aee5314a0f97a))
* **paseo-omp:** show OMP update status and an Update button in Diagnostics ([#509](https://github.com/g0rdonL/paseo-plugins/issues/509)) ([10aba27](https://github.com/g0rdonL/paseo-plugins/commit/10aba27245c77179f9da8fd8ec37a3b081c15e4c))
* **paseo-omp:** steer and stop OMP subagents from the conversation ([#438](https://github.com/g0rdonL/paseo-plugins/issues/438)) ([@georgepullen](https://github.com/georgepullen)) ([ec3e271](https://github.com/g0rdonL/paseo-plugins/commit/ec3e27171f8ed9e59f55cb1c79fc33bdeda96486))
* **paseo-omp:** support explicit env passthrough ([#39](https://github.com/g0rdonL/paseo-plugins/issues/39)) ([e22b3b4](https://github.com/g0rdonL/paseo-plugins/commit/e22b3b448f218bdecfcb3a168c14fa32051a6392))
* **paseo-omp:** test what a rule would catch from the Rules tab ([#531](https://github.com/g0rdonL/paseo-plugins/issues/531)) ([a566cec](https://github.com/g0rdonL/paseo-plugins/commit/a566cece4a5379165d7342da93fe833316d391ee))
* **paseo-omp:** turn a rule on or off from the Rules tab ([#529](https://github.com/g0rdonL/paseo-plugins/issues/529)) ([07e9ccb](https://github.com/g0rdonL/paseo-plugins/commit/07e9ccb97d4aa99c2d1f2d8db9eda2b3c468bcc7))
* **paseo-omp:** use plain model name as catalog label ([#216](https://github.com/g0rdonL/paseo-plugins/issues/216)) ([@mcowger](https://github.com/mcowger)) ([13214de](https://github.com/g0rdonL/paseo-plugins/commit/13214dee7a99e06feb9ffbfc50cd50d67297ac37))
* **paseo-omp:** veto idle runtime release while OMP work is pending ([#412](https://github.com/g0rdonL/paseo-plugins/issues/412)) ([3e93ef3](https://github.com/g0rdonL/paseo-plugins/commit/3e93ef3e74acc543a8e9629124d693752cf81b2e))
* **paseo-omp:** warn in Diagnostics when SYSTEM.md or Paseo's Append system prompt affects OMP prompt files ([#517](https://github.com/g0rdonL/paseo-plugins/issues/517)) ([a38fa4f](https://github.com/g0rdonL/paseo-plugins/commit/a38fa4f6d6b433c0ab0712dfe6bc7080b8bc33f1))
* **plugins:** declare Paseo 0.11 compatibility ([#248](https://github.com/g0rdonL/paseo-plugins/issues/248)) ([f983a8b](https://github.com/g0rdonL/paseo-plugins/commit/f983a8bf2025f009c178c15183d6cfac0b2024dd))
* **plugins:** support Paseo 0.10.1 ([#221](https://github.com/g0rdonL/paseo-plugins/issues/221)) ([9d71ea0](https://github.com/g0rdonL/paseo-plugins/commit/9d71ea09eaa9ed67429813ed3e2de2567c14c825))
* **release:** publish plugins to npm ([#80](https://github.com/g0rdonL/paseo-plugins/issues/80)) ([3c93048](https://github.com/g0rdonL/paseo-plugins/commit/3c93048cfefda97d8c2bc1631e3428fb64bdad09))
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170)) ([04acfca](https://github.com/g0rdonL/paseo-plugins/commit/04acfcabcf8140edbd3a98681a72cabef7bb74ba))
* require Paseo 0.11 and drop legacy surface navigation ([#286](https://github.com/g0rdonL/paseo-plugins/issues/286)) ([a46fe9e](https://github.com/g0rdonL/paseo-plugins/commit/a46fe9ee910c2cc485043d53c67dacf49bab402b))


### Bug Fixes

* address Astra review findings ([#207](https://github.com/g0rdonL/paseo-plugins/issues/207)) ([04a2ac5](https://github.com/g0rdonL/paseo-plugins/commit/04a2ac5eeef51c0be3f6308fe39c155e237ceda9))
* allow scrolling in Settings UI on mobile/compact views ([#245](https://github.com/g0rdonL/paseo-plugins/issues/245)) ([5f38b18](https://github.com/g0rdonL/paseo-plugins/commit/5f38b18ebdfe541d450a327e4fda5e9ebcd38cda))
* **deps:** keep react-dom on the catalog's react version ([#627](https://github.com/g0rdonL/paseo-plugins/issues/627)) ([57e9d30](https://github.com/g0rdonL/paseo-plugins/commit/57e9d30812dba8613bca7691d7559fd09b43d2c4))
* **deps:** support Paseo 0.14.0 ([#429](https://github.com/g0rdonL/paseo-plugins/issues/429)) ([7d79f4c](https://github.com/g0rdonL/paseo-plugins/commit/7d79f4cec882888dd48f0674957d3cd8b97a720b))
* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0 ([#488](https://github.com/g0rdonL/paseo-plugins/issues/488)) ([7e03060](https://github.com/g0rdonL/paseo-plugins/commit/7e0306043670294badb5b6c2c5b374c9c84da457))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
* **deps:** support Paseo 0.16.0-beta.2 ([#596](https://github.com/g0rdonL/paseo-plugins/issues/596)) ([052192f](https://github.com/g0rdonL/paseo-plugins/commit/052192f57495f3da8f94887495ff1fda0c0f04ff))
* **omp:** preserve safe published URLs ([#42](https://github.com/g0rdonL/paseo-plugins/issues/42)) ([4530430](https://github.com/g0rdonL/paseo-plugins/commit/4530430a02bee076f8940c376401d3266ce17499))
* **packaging:** lock npm runtime dependencies with npm-shrinkwrap.json ([#300](https://github.com/g0rdonL/paseo-plugins/issues/300)) ([1b0755c](https://github.com/g0rdonL/paseo-plugins/commit/1b0755c9097681cdc167fb26bd2d1c3cc5e72830))
* **paseo-omp,paseo-shared-browser:** run npm ci through the shell and drop staged overrides ([#445](https://github.com/g0rdonL/paseo-plugins/issues/445)) ([d727c7a](https://github.com/g0rdonL/paseo-plugins/commit/d727c7a7569104f2bcf9ad53d722788296450c65))
* **paseo-omp:** accept bounded tool metadata ([#110](https://github.com/g0rdonL/paseo-plugins/issues/110)) ([102c6bf](https://github.com/g0rdonL/paseo-plugins/commit/102c6bfde945100784a7b5e69a5648520dbc5816))
* **paseo-omp:** accept image prompts without a caption ([#236](https://github.com/g0rdonL/paseo-plugins/issues/236)) ([693ad2e](https://github.com/g0rdonL/paseo-plugins/commit/693ad2ebe055c9988f2523a51bf276e83fb5c60c))
* **paseo-omp:** accept the OMP 18.13 and 18.14 RPC frames ([#435](https://github.com/g0rdonL/paseo-plugins/issues/435)) ([@georgepullen](https://github.com/georgepullen)) ([0d83549](https://github.com/g0rdonL/paseo-plugins/commit/0d83549f759ee55bb92fb9ab96c6b725a0b2f9b5))
* **paseo-omp:** advertise nested subsession capability ([#62](https://github.com/g0rdonL/paseo-plugins/issues/62)) ([fcb4e82](https://github.com/g0rdonL/paseo-plugins/commit/fcb4e8243e9559d70f26ac6945e2f3c0bf05d575))
* **paseo-omp:** align environment preflight limits ([#113](https://github.com/g0rdonL/paseo-plugins/issues/113)) ([e93d12e](https://github.com/g0rdonL/paseo-plugins/commit/e93d12e84c250f87e93e96f980122361c51f1e4d))
* **paseo-omp:** align prompt attachment rendering ([#41](https://github.com/g0rdonL/paseo-plugins/issues/41)) ([4b708c8](https://github.com/g0rdonL/paseo-plugins/commit/4b708c897b4af4cd6673e7581f736e95843b545b))
* **paseo-omp:** avoid Windows cleanup race ([#123](https://github.com/g0rdonL/paseo-plugins/issues/123)) ([15b3818](https://github.com/g0rdonL/paseo-plugins/commit/15b3818044433b0a701068b76ff5187a41b4cf02))
* **paseo-omp:** await permission acknowledgement in canary smoke ([#289](https://github.com/g0rdonL/paseo-plugins/issues/289)) ([f503485](https://github.com/g0rdonL/paseo-plugins/commit/f5034853d13f0dc5aeec15e4959a35f801a8e3a1))
* **paseo-omp:** bound model catalogs and retain safe failure diagnostics ([#73](https://github.com/g0rdonL/paseo-plugins/issues/73)) (@Trevor-Mengel) ([e70afb7](https://github.com/g0rdonL/paseo-plugins/commit/e70afb72be782446e7ff585bad40940c7231bdc5))
* **paseo-omp:** branch directly from rewind tokens ([#114](https://github.com/g0rdonL/paseo-plugins/issues/114)) ([2ff4e6b](https://github.com/g0rdonL/paseo-plugins/commit/2ff4e6b6b48aff3ac13f0be82ebed8c513597a4b))
* **paseo-omp:** cancel the login by id when the sign-in modal closes early ([#551](https://github.com/g0rdonL/paseo-plugins/issues/551)) ([a1250d5](https://github.com/g0rdonL/paseo-plugins/commit/a1250d5f81fc7964a4c30ae6735784837ffb29ef))
* **paseo-omp:** classify OMP get_session_lease RPC command ([#444](https://github.com/g0rdonL/paseo-plugins/issues/444)) ([50f52b7](https://github.com/g0rdonL/paseo-plugins/commit/50f52b7524237f9ee91dd70157ffca4eb1c940e9))
* **paseo-omp:** complete canary subagents with yield ([#219](https://github.com/g0rdonL/paseo-plugins/issues/219)) ([32ec05b](https://github.com/g0rdonL/paseo-plugins/commit/32ec05b66d3abc648d29582fe99a7242debded85))
* **paseo-omp:** correlate terminal events by request ([#81](https://github.com/g0rdonL/paseo-plugins/issues/81)) ([41f756e](https://github.com/g0rdonL/paseo-plugins/commit/41f756e9bebf5cbc275e5cbd3657c37d45a18997))
* **paseo-omp:** decouple live taskkill tree test from the 750 ms budget ([#476](https://github.com/g0rdonL/paseo-plugins/issues/476)) ([755239e](https://github.com/g0rdonL/paseo-plugins/commit/755239e0f844daf8eff063b604c02fff30ac4486)), refs [#457](https://github.com/g0rdonL/paseo-plugins/issues/457)
* **paseo-omp:** degrade oversized host tool results ([#111](https://github.com/g0rdonL/paseo-plugins/issues/111)) ([3e9b35f](https://github.com/g0rdonL/paseo-plugins/commit/3e9b35fc1e2685c1597f5b8e616c1d7455911908))
* **paseo-omp:** distinguish accounts in recorded quota popover ([#623](https://github.com/g0rdonL/paseo-plugins/issues/623)) ([@taemire](https://github.com/taemire)) ([e3d6b23](https://github.com/g0rdonL/paseo-plugins/commit/e3d6b235cd3e34b5da61a4ae1800cbe5890ac714))
* **paseo-omp:** do not replace an in-progress disposal after a rewind failure ([#556](https://github.com/g0rdonL/paseo-plugins/issues/556)) ([d7cc81f](https://github.com/g0rdonL/paseo-plugins/commit/d7cc81f541d5cab74fba41857f7384431ed0badb))
* **paseo-omp:** drop expired and abandoned quota windows ([#313](https://github.com/g0rdonL/paseo-plugins/issues/313)) ([bcd991e](https://github.com/g0rdonL/paseo-plugins/commit/bcd991e05714743103a86bd7a6b234f0f984a460))
* **paseo-omp:** expose native Paseo tools ([#52](https://github.com/g0rdonL/paseo-plugins/issues/52)) ([3b52adf](https://github.com/g0rdonL/paseo-plugins/commit/3b52adff1de6329fa9f0bc4a1dcea339166e3974))
* **paseo-omp:** fail closed on unowned later-turn terminal events ([#69](https://github.com/g0rdonL/paseo-plugins/issues/69)) ([072cd09](https://github.com/g0rdonL/paseo-plugins/commit/072cd09e38e450376bcd3f4c7b5eae9a670b56b5))
* **paseo-omp:** find OMP via Windows Path and accept taskkill exit 128 ([#446](https://github.com/g0rdonL/paseo-plugins/issues/446)) ([fb83ef0](https://github.com/g0rdonL/paseo-plugins/commit/fb83ef065548d1b40b42945148073b912b481832))
* **paseo-omp:** give the workspace OMP panel every sidebar feature ([#611](https://github.com/g0rdonL/paseo-plugins/issues/611)) ([df682d7](https://github.com/g0rdonL/paseo-plugins/commit/df682d7e6f01ea2344362412e1e4961c12ef564c))
* **paseo-omp:** handle indeterminate terminal errors ([#220](https://github.com/g0rdonL/paseo-plugins/issues/220)) ([9040d9e](https://github.com/g0rdonL/paseo-plugins/commit/9040d9ea3b42dc1e1b096b1cd877567d14543c83))
* **paseo-omp:** handle oversized pasted images ([#55](https://github.com/g0rdonL/paseo-plugins/issues/55)) ([4b6ed7d](https://github.com/g0rdonL/paseo-plugins/commit/4b6ed7d3015f1f85dcc13a9dd29061efef5f22c7))
* **paseo-omp:** harden OMP session recovery ([#132](https://github.com/g0rdonL/paseo-plugins/issues/132)) ([d89a9fe](https://github.com/g0rdonL/paseo-plugins/commit/d89a9feab367deea2b4629593fac9c6b867884a4))
* **paseo-omp:** identify local Mnemopi memory in all states ([#244](https://github.com/g0rdonL/paseo-plugins/issues/244)) (@Trevor-Mengel) ([c47517f](https://github.com/g0rdonL/paseo-plugins/commit/c47517fce00646508a3540a56b38d26e34945ef4))
* **paseo-omp:** include background workspaces in composer pills and Hub ([#353](https://github.com/g0rdonL/paseo-plugins/issues/353)) ([5136da8](https://github.com/g0rdonL/paseo-plugins/commit/5136da8b7a8d9d7aa6ca8f508579b85d7e6a443f))
* **paseo-omp:** isolate subagent replay failures ([#118](https://github.com/g0rdonL/paseo-plugins/issues/118)) ([1161560](https://github.com/g0rdonL/paseo-plugins/commit/1161560ecfad830d1141a3956e0ae0a183b6b5d6))
* **paseo-omp:** keep a canceled sign-in canceled after omp finishes ([#554](https://github.com/g0rdonL/paseo-plugins/issues/554)) ([f73b382](https://github.com/g0rdonL/paseo-plugins/commit/f73b382d165ea22a5a37de661df3ce26361d598c))
* **paseo-omp:** keep forwarded MCP tools out of OMP's reclaimed namespace ([cc73a03](https://github.com/g0rdonL/paseo-plugins/commit/cc73a03fee48e2eabf8c908a1ac4f2cc1b96ba31))
* **paseo-omp:** keep rendering assistant messages in very long turns ([#436](https://github.com/g0rdonL/paseo-plugins/issues/436)) ([@georgepullen](https://github.com/georgepullen)) ([71553dc](https://github.com/g0rdonL/paseo-plugins/commit/71553dca35c9f4cb61c1ede06aad298937948d21))
* **paseo-omp:** keep the runtime when a nonterminal agent_end exceeds the payload budget ([#422](https://github.com/g0rdonL/paseo-plugins/issues/422)) ([@georgepullen](https://github.com/georgepullen)) ([a7a922c](https://github.com/g0rdonL/paseo-plugins/commit/a7a922cce95da8ecc9b3e0c0915d98df8a653cc8)), refs [#421](https://github.com/g0rdonL/paseo-plugins/issues/421)
* **paseo-omp:** keep the transport's reason when the OMP runtime fails ([#426](https://github.com/g0rdonL/paseo-plugins/issues/426)) ([@georgepullen](https://github.com/georgepullen)) ([23a5ae6](https://github.com/g0rdonL/paseo-plugins/commit/23a5ae6df1c7198170d7539b0a14132146c5b24a))
* **paseo-omp:** label direct MCP tool calls ([#53](https://github.com/g0rdonL/paseo-plugins/issues/53)) ([e09b1fd](https://github.com/g0rdonL/paseo-plugins/commit/e09b1fd2c05cb45422e7d0633e8b638d0841b931))
* **paseo-omp:** list OMP session files in the Sessions pill ([#502](https://github.com/g0rdonL/paseo-plugins/issues/502)) ([a4b98c9](https://github.com/g0rdonL/paseo-plugins/commit/a4b98c91e653171393ad4d32111d6f9d8f9e4191))
* **paseo-omp:** make the canary image build tolerate missing workspaces ([#608](https://github.com/g0rdonL/paseo-plugins/issues/608)) ([276578d](https://github.com/g0rdonL/paseo-plugins/commit/276578d9cd420c8f16b21d3ae9e2ecb7a0500c53))
* **paseo-omp:** observe owned agent directory ([#163](https://github.com/g0rdonL/paseo-plugins/issues/163)) ([e475dc7](https://github.com/g0rdonL/paseo-plugins/commit/e475dc7a4355d56b842eb751fc9e008725b4402f))
* **paseo-omp:** pass the Paseo 0.16.0-beta.1 compatibility lane ([#572](https://github.com/g0rdonL/paseo-plugins/issues/572)) ([5b66388](https://github.com/g0rdonL/paseo-plugins/commit/5b6638827ea46bd565057607d95a8998e66e95d8)), refs [#571](https://github.com/g0rdonL/paseo-plugins/issues/571)
* **paseo-omp:** preserve buffered terminal ownership evidence ([#54](https://github.com/g0rdonL/paseo-plugins/issues/54)) ([b49400e](https://github.com/g0rdonL/paseo-plugins/commit/b49400e09d73cd67a23986f52c17bfc1f23cd297))
* **paseo-omp:** preserve large replay output ([#117](https://github.com/g0rdonL/paseo-plugins/issues/117)) ([6bdd879](https://github.com/g0rdonL/paseo-plugins/commit/6bdd879bafa99bccacc6476f030b6d10c669d1c5))
* **paseo-omp:** preserve nested subagent links ([#105](https://github.com/g0rdonL/paseo-plugins/issues/105)) ([41b3b87](https://github.com/g0rdonL/paseo-plugins/commit/41b3b8760cb88be2381f723e400f71469cb1685c))
* **paseo-omp:** preserve Plexus plugin credentials ([#27](https://github.com/g0rdonL/paseo-plugins/issues/27)) ([@mcowger](https://github.com/mcowger)) ([0674ef1](https://github.com/g0rdonL/paseo-plugins/commit/0674ef1d3d66efa37ec9d2da9a19dd57472c2cdd))
* **paseo-omp:** preserve prompt and tool stream ordering ([#148](https://github.com/g0rdonL/paseo-plugins/issues/148)) ([b667e86](https://github.com/g0rdonL/paseo-plugins/commit/b667e86af45768ab7459aec4beb8e0b4ea52e312))
* **paseo-omp:** preserve prompt scheduling error fidelity ([#67](https://github.com/g0rdonL/paseo-plugins/issues/67)) ([1c6d549](https://github.com/g0rdonL/paseo-plugins/commit/1c6d549fddca48be8fd86b4dd2c5faea526c8ac0))
* **paseo-omp:** preserve structured tool results ([#46](https://github.com/g0rdonL/paseo-plugins/issues/46)) ([9e5fe98](https://github.com/g0rdonL/paseo-plugins/commit/9e5fe989e57e100f67285257cada3242218eee58))
* **paseo-omp:** preserve transcript when image replay fails ([#112](https://github.com/g0rdonL/paseo-plugins/issues/112)) ([b982226](https://github.com/g0rdonL/paseo-plugins/commit/b9822269faadf36918781b243959b76fbcfea4f9))
* **paseo-omp:** preserve Windows process tree during cleanup ([#152](https://github.com/g0rdonL/paseo-plugins/issues/152)) ([e0a5483](https://github.com/g0rdonL/paseo-plugins/commit/e0a548323ab7e900eefddb4b33e7c3b3d6f1d582))
* **paseo-omp:** project the OMP ask tool as questions and answers ([#564](https://github.com/g0rdonL/paseo-plugins/issues/564)) ([@code0094](https://github.com/code0094)) ([a5b9400](https://github.com/g0rdonL/paseo-plugins/commit/a5b940032c8f1b6e9a8e9cacac4725598e47eb9d))
* **paseo-omp:** raise catalog budgets for large OMP registries ([#276](https://github.com/g0rdonL/paseo-plugins/issues/276)) ([61abe50](https://github.com/g0rdonL/paseo-plugins/commit/61abe5099557afb4e1e94d1dfd9cae6639aba408))
* **paseo-omp:** re-verify unverified OMP process cleanup to lift quarantine ([#241](https://github.com/g0rdonL/paseo-plugins/issues/241)) ([4e0771f](https://github.com/g0rdonL/paseo-plugins/commit/4e0771fbaefc29a0b9213698e9d66cd521baf1b3))
* **paseo-omp:** read hub process spec from spec.json and extend OMP matrix to 18.8.4 ([#320](https://github.com/g0rdonL/paseo-plugins/issues/320)) ([5b0e17b](https://github.com/g0rdonL/paseo-plugins/commit/5b0e17b808515dd60a7eb25f32db668d4866fd75))
* **paseo-omp:** reconcile incomplete terminal outcomes ([#68](https://github.com/g0rdonL/paseo-plugins/issues/68)) ([854f4e6](https://github.com/g0rdonL/paseo-plugins/commit/854f4e6daddf905c671bb39a94d06a2de0c6d51d))
* **paseo-omp:** register turn hooks on Paseo 0.14 hosts ([#565](https://github.com/g0rdonL/paseo-plugins/issues/565)) ([@code0094](https://github.com/code0094)) ([e915f0e](https://github.com/g0rdonL/paseo-plugins/commit/e915f0ed9d114fb2cbf23f88db191d3c0ba2a130))
* **paseo-omp:** reject live providerOptions patches in session.configure ([#601](https://github.com/g0rdonL/paseo-plugins/issues/601)) ([af89f94](https://github.com/g0rdonL/paseo-plugins/commit/af89f94ac06bc0b6921acfe3374cda146e7fdbd6))
* **paseo-omp:** release the catalog gate once cleanup is verified ([#563](https://github.com/g0rdonL/paseo-plugins/issues/563)) ([@code0094](https://github.com/code0094)) ([4eac20b](https://github.com/g0rdonL/paseo-plugins/commit/4eac20b323a2fd82465991dfead6b23d57a8b268))
* **paseo-omp:** rename Plugin tab to Plugin provider and hide it when the provider is off ([#537](https://github.com/g0rdonL/paseo-plugins/issues/537)) ([ddd5b1c](https://github.com/g0rdonL/paseo-plugins/commit/ddd5b1c1008a0c899433d796d9cb778238b33feb))
* **paseo-omp:** render OMP ask as one revisitable card with free-text input ([#407](https://github.com/g0rdonL/paseo-plugins/issues/407)) ([@ogzerber](https://github.com/ogzerber)) ([57c7ee9](https://github.com/g0rdonL/paseo-plugins/commit/57c7ee94158272accb00e3b55da1084b3b21eb3c))
* **paseo-omp:** render WebP images across clients ([#51](https://github.com/g0rdonL/paseo-plugins/issues/51)) ([397cb2d](https://github.com/g0rdonL/paseo-plugins/commit/397cb2d1e660e43e22312ecf9f054d77afcddc6e))
* **paseo-omp:** replay failed turns from native transcript ([#79](https://github.com/g0rdonL/paseo-plugins/issues/79)) ([4a13b77](https://github.com/g0rdonL/paseo-plugins/commit/4a13b778a9ba413b61fe0cc85878d3c333c161d2))
* **paseo-omp:** report protocol violations safely ([#119](https://github.com/g0rdonL/paseo-plugins/issues/119)) ([c63c244](https://github.com/g0rdonL/paseo-plugins/commit/c63c24423b8ef5e999688c9a8c931a6bf5a0d514))
* **paseo-omp:** require Paseo 0.9.2 provider fixes ([#177](https://github.com/g0rdonL/paseo-plugins/issues/177)) ([ddf9098](https://github.com/g0rdonL/paseo-plugins/commit/ddf9098f38397dec2105a666c295b0d919fe4092))
* **paseo-omp:** resolve sessions in large OMP session trees ([#222](https://github.com/g0rdonL/paseo-plugins/issues/222)) ([f9d75f3](https://github.com/g0rdonL/paseo-plugins/commit/f9d75f36e1c82d6425eebed6fdf986b0b9fd5433))
* **paseo-omp:** resolve Windows PATH, PATHEXT and SystemRoot case-insensitively ([#477](https://github.com/g0rdonL/paseo-plugins/issues/477)) ([fa56ab4](https://github.com/g0rdonL/paseo-plugins/commit/fa56ab41ee64febee0dc5f12131b52323d90a120))
* **paseo-omp:** resume OMP from the authorized transcript file ([#235](https://github.com/g0rdonL/paseo-plugins/issues/235)) ([7856333](https://github.com/g0rdonL/paseo-plugins/commit/7856333fae2cf946019db40017b4fe600497b57a))
* **paseo-omp:** scope providers and auxiliary state to named profiles ([#74](https://github.com/g0rdonL/paseo-plugins/issues/74)) (@Trevor-Mengel) ([b265ad3](https://github.com/g0rdonL/paseo-plugins/commit/b265ad317a47230ec76dba799197443664492729))
* **paseo-omp:** serialize persistent session registration ([#35](https://github.com/g0rdonL/paseo-plugins/issues/35)) ([03d38bc](https://github.com/g0rdonL/paseo-plugins/commit/03d38bc7e4a3d00ec54190e2b234a459bbdc55ae))
* **paseo-omp:** serve timeline images from a content-hashed cache ([#475](https://github.com/g0rdonL/paseo-plugins/issues/475)) ([bbf6fe2](https://github.com/g0rdonL/paseo-plugins/commit/bbf6fe27b14c03065d9853846b3b428a031f630d))
* **paseo-omp:** settle concurrent startup races ([#70](https://github.com/g0rdonL/paseo-plugins/issues/70)) ([9d4e6ef](https://github.com/g0rdonL/paseo-plugins/commit/9d4e6efb26041f9c88ab4ed6c02a9526520b83e9))
* **paseo-omp:** settle late child dispatches ([#34](https://github.com/g0rdonL/paseo-plugins/issues/34)) ([0746f11](https://github.com/g0rdonL/paseo-plugins/commit/0746f11fd94f15028fd624ac7a99ac8ebd88b63d))
* **paseo-omp:** show immutable approval mode ([#66](https://github.com/g0rdonL/paseo-plugins/issues/66)) ([4c586dc](https://github.com/g0rdonL/paseo-plugins/commit/4c586dc7d012127ee7570077a0d12cc0d6415bd4))
* **paseo-omp:** show runs that OMP starts without a prompt ([#437](https://github.com/g0rdonL/paseo-plugins/issues/437)) ([@georgepullen](https://github.com/georgepullen)) ([db02f9a](https://github.com/g0rdonL/paseo-plugins/commit/db02f9aa887bfb7008dca64226c426f99042b704))
* **paseo-omp:** skip failing optional MCP servers on session open ([#325](https://github.com/g0rdonL/paseo-plugins/issues/325)) ([7c47aa1](https://github.com/g0rdonL/paseo-plugins/commit/7c47aa14dfc6eda9ae550c7376a22103d1d73beb))
* **paseo-omp:** steer auto messages during active turns ([#61](https://github.com/g0rdonL/paseo-plugins/issues/61)) ([b36002b](https://github.com/g0rdonL/paseo-plugins/commit/b36002bbc5b108cd525dd9c356fbdb89d6a9f3e6))
* **paseo-omp:** steer running turns when permissions are cleared ([#351](https://github.com/g0rdonL/paseo-plugins/issues/351)) ([03ed477](https://github.com/g0rdonL/paseo-plugins/commit/03ed477cbf85295fb01b5128e8bd4a82af3f1b03))
* **paseo-omp:** stop an agent's Hub services when it closes on OMP 18.18.9+ ([#606](https://github.com/g0rdonL/paseo-plugins/issues/606)) ([c97a856](https://github.com/g0rdonL/paseo-plugins/commit/c97a8561fa17eef3b65de584c03afc2845b4fe58))
* **paseo-omp:** stop dropping sessions when the scan takes over one second ([#461](https://github.com/g0rdonL/paseo-plugins/issues/461)) ([38c8887](https://github.com/g0rdonL/paseo-plugins/commit/38c88877ac472249f878a013e09791399c62cfb8))
* **paseo-omp:** stop logging session_settled and late background tool updates as protocol violations ([#367](https://github.com/g0rdonL/paseo-plugins/issues/367)) ([2f02749](https://github.com/g0rdonL/paseo-plugins/commit/2f0274905fa81547754ec2032c3c359e74a06f53))
* **paseo-omp:** stop speculative stream redaction ([#40](https://github.com/g0rdonL/paseo-plugins/issues/40)) ([539cb61](https://github.com/g0rdonL/paseo-plugins/commit/539cb61db0b904b8130319c7887852f991c50aba))
* **paseo-omp:** support OMP 18.4 contracts ([#214](https://github.com/g0rdonL/paseo-plugins/issues/214)) ([48a635f](https://github.com/g0rdonL/paseo-plugins/commit/48a635f78b5eb614b503408488702b7e2846201e))
* **paseo-omp:** support Paseo 0.11.1 and archived history ([#296](https://github.com/g0rdonL/paseo-plugins/issues/296)) ([c89ea55](https://github.com/g0rdonL/paseo-plugins/commit/c89ea55d148c09250202506218fc940d37459ae2))
* **paseo-omp:** support Paseo 0.9 beta ([#103](https://github.com/g0rdonL/paseo-plugins/issues/103)) ([0444d52](https://github.com/g0rdonL/paseo-plugins/commit/0444d52078a52befa62bb52f44545f22ab10e8c7))
* **paseo-omp:** support unkeyed terminal events ([#89](https://github.com/g0rdonL/paseo-plugins/issues/89)) ([a00a831](https://github.com/g0rdonL/paseo-plugins/commit/a00a83158993fdf648fc10e06f1d8f8ebc62fa6a))
* **paseo-omp:** title the Overview provider card Provider ([#539](https://github.com/g0rdonL/paseo-plugins/issues/539)) ([9306a17](https://github.com/g0rdonL/paseo-plugins/commit/9306a176e6079928f16cb7f87edcae9f542f2a6a))
* **paseo-omp:** tolerate optional catalog metadata ([#115](https://github.com/g0rdonL/paseo-plugins/issues/115)) ([2dbd8f6](https://github.com/g0rdonL/paseo-plugins/commit/2dbd8f6934757c8ee5b04ec1cc0f2b1f256d2051))
* **paseo-omp:** wait for session registration ([#30](https://github.com/g0rdonL/paseo-plugins/issues/30)) ([82e901e](https://github.com/g0rdonL/paseo-plugins/commit/82e901e4bb0e66cafeb572c4bd92e0461b57a647))
* **plugins:** accept Paseo 0.13 in the plugin manifest range ([bdb9435](https://github.com/g0rdonL/paseo-plugins/commit/bdb943595515ab7f21a93c66cffeb6844bacdcdb))
* **plugins:** declare Paseo 0.12 compatibility ([7dbbe2a](https://github.com/g0rdonL/paseo-plugins/commit/7dbbe2a15aa7fb92ae846afa89a174cbed749f8e))
* **plugins:** prepare for Paseo 0.10 beta ([#186](https://github.com/g0rdonL/paseo-plugins/issues/186)) ([0294fd0](https://github.com/g0rdonL/paseo-plugins/commit/0294fd0fd7ad5101e724d4196a49ac27783b5483))
* **plugins:** ship OVERVIEW.md in published packages ([640f9a4](https://github.com/g0rdonL/paseo-plugins/commit/640f9a4d7bd6dbad226c4ee1ebaa199abfc62776))
* resolve shared browser and OMP regressions ([#200](https://github.com/g0rdonL/paseo-plugins/issues/200)) ([fbf59bb](https://github.com/g0rdonL/paseo-plugins/commit/fbf59bb98d0740ba27c4eba7856d3d9079bf4bc4))
</details>

<details><summary>paseo-dracula: 3.0.0</summary>

## [3.0.0](https://github.com/g0rdonL/paseo-plugins/compare/paseo-dracula-v2.0.2...paseo-dracula-v3.0.0) (2026-11-17)


###   BREAKING CHANGES

* **paseo-dracula,tell-agent:** paseo-dracula and tell-agent no longer support Paseo 0.9 or 0.10.
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170))

### Features

* **paseo-dracula,tell-agent:** add listing icon ([#419](https://github.com/g0rdonL/paseo-plugins/issues/419)) ([2262366](https://github.com/g0rdonL/paseo-plugins/commit/2262366d69b6520752f8988c5fdfe0d0d74d312c))
* **plugins:** declare Paseo 0.11 compatibility ([#248](https://github.com/g0rdonL/paseo-plugins/issues/248)) ([f983a8b](https://github.com/g0rdonL/paseo-plugins/commit/f983a8bf2025f009c178c15183d6cfac0b2024dd))
* **plugins:** support Paseo 0.10.1 ([#221](https://github.com/g0rdonL/paseo-plugins/issues/221)) ([9d71ea0](https://github.com/g0rdonL/paseo-plugins/commit/9d71ea09eaa9ed67429813ed3e2de2567c14c825))
* **release:** publish plugins to npm ([#80](https://github.com/g0rdonL/paseo-plugins/issues/80)) ([3c93048](https://github.com/g0rdonL/paseo-plugins/commit/3c93048cfefda97d8c2bc1631e3428fb64bdad09))
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170)) ([04acfca](https://github.com/g0rdonL/paseo-plugins/commit/04acfcabcf8140edbd3a98681a72cabef7bb74ba))


### Bug Fixes

* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
* **paseo-dracula:** support Paseo 0.9 beta ([#88](https://github.com/g0rdonL/paseo-plugins/issues/88)) ([5f4a4b2](https://github.com/g0rdonL/paseo-plugins/commit/5f4a4b2d676b8ae405edf7312dc8f493781f355c))
* **plugins:** accept Paseo 0.13 in the plugin manifest range ([bdb9435](https://github.com/g0rdonL/paseo-plugins/commit/bdb943595515ab7f21a93c66cffeb6844bacdcdb))
* **plugins:** declare Paseo 0.12 compatibility ([7dbbe2a](https://github.com/g0rdonL/paseo-plugins/commit/7dbbe2a15aa7fb92ae846afa89a174cbed749f8e))
* **plugins:** prepare for Paseo 0.10 beta ([#186](https://github.com/g0rdonL/paseo-plugins/issues/186)) ([0294fd0](https://github.com/g0rdonL/paseo-plugins/commit/0294fd0fd7ad5101e724d4196a49ac27783b5483))
* **plugins:** ship OVERVIEW.md in published packages ([640f9a4](https://github.com/g0rdonL/paseo-plugins/commit/640f9a4d7bd6dbad226c4ee1ebaa199abfc62776))
</details>

<details><summary>shared-browser: 5.0.0</summary>

## [5.0.0](https://github.com/g0rdonL/paseo-plugins/compare/shared-browser-v4.1.12...shared-browser-v5.0.0) (2026-11-17)


###   BREAKING CHANGES

* **paseo-shared-browser:** the plugin now requires Paseo 0.13 (requirements.paseo is ^0.13.0); it no longer loads on Paseo 0.12.
* **paseo-shared-browser:** requires Paseo ^0.12.0. The includeBackground option throws on older hosts.
* the affected plugins no longer load on Paseo 0.9 or 0.10. Screen and sidebar IDs, params and settings are unchanged.
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170))

### Features

* add listing icon to plugin manifests ([#418](https://github.com/g0rdonL/paseo-plugins/issues/418)) ([2e7aadd](https://github.com/g0rdonL/paseo-plugins/commit/2e7aaddac381bb2a5c596f95b1f9b7b8aee89cb2))
* **paseo-shared-browser:** add tab-scoped input and opt-in video ([#274](https://github.com/g0rdonL/paseo-plugins/issues/274)) (@RyanEwen) ([ba97d79](https://github.com/g0rdonL/paseo-plugins/commit/ba97d794d4c82f3ccd38c102e05d797874c75ddd))
* **paseo-shared-browser:** inject MCP into OMP on Paseo 0.11 and add sidebar footer row ([#258](https://github.com/g0rdonL/paseo-plugins/issues/258)) ([09593b9](https://github.com/g0rdonL/paseo-plugins/commit/09593b9afb30627b9714ced00deb0168e2781f58))
* **paseo-shared-browser:** require Paseo 0.13 and persist panel state ([#384](https://github.com/g0rdonL/paseo-plugins/issues/384)) ([9195eec](https://github.com/g0rdonL/paseo-plugins/commit/9195eecbd4ae8b932aaa6e245519663b4115336d))
* **plugins:** declare Paseo 0.11 compatibility ([#248](https://github.com/g0rdonL/paseo-plugins/issues/248)) ([f983a8b](https://github.com/g0rdonL/paseo-plugins/commit/f983a8bf2025f009c178c15183d6cfac0b2024dd))
* **plugins:** support Paseo 0.10.1 ([#221](https://github.com/g0rdonL/paseo-plugins/issues/221)) ([9d71ea0](https://github.com/g0rdonL/paseo-plugins/commit/9d71ea09eaa9ed67429813ed3e2de2567c14c825))
* **release:** publish plugins to npm ([#80](https://github.com/g0rdonL/paseo-plugins/issues/80)) ([3c93048](https://github.com/g0rdonL/paseo-plugins/commit/3c93048cfefda97d8c2bc1631e3428fb64bdad09))
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170)) ([04acfca](https://github.com/g0rdonL/paseo-plugins/commit/04acfcabcf8140edbd3a98681a72cabef7bb74ba))
* require Paseo 0.11 and drop legacy surface navigation ([#286](https://github.com/g0rdonL/paseo-plugins/issues/286)) ([a46fe9e](https://github.com/g0rdonL/paseo-plugins/commit/a46fe9ee910c2cc485043d53c67dacf49bab402b))
* **shared-browser:** adopt agent-browser runtime ([#18](https://github.com/g0rdonL/paseo-plugins/issues/18)) ([09623f3](https://github.com/g0rdonL/paseo-plugins/commit/09623f34f2b93943c19f809a865813fa37f467bd))


### Bug Fixes

* address Astra review findings ([#207](https://github.com/g0rdonL/paseo-plugins/issues/207)) ([04a2ac5](https://github.com/g0rdonL/paseo-plugins/commit/04a2ac5eeef51c0be3f6308fe39c155e237ceda9))
* **deps:** support Paseo 0.14.0 ([#429](https://github.com/g0rdonL/paseo-plugins/issues/429)) ([7d79f4c](https://github.com/g0rdonL/paseo-plugins/commit/7d79f4cec882888dd48f0674957d3cd8b97a720b))
* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0 ([#488](https://github.com/g0rdonL/paseo-plugins/issues/488)) ([7e03060](https://github.com/g0rdonL/paseo-plugins/commit/7e0306043670294badb5b6c2c5b374c9c84da457))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
* **deps:** support Paseo 0.16.0-beta.2 ([#596](https://github.com/g0rdonL/paseo-plugins/issues/596)) ([052192f](https://github.com/g0rdonL/paseo-plugins/commit/052192f57495f3da8f94887495ff1fda0c0f04ff))
* **deps:** update dependency agent-browser to v0.39.1 ([#328](https://github.com/g0rdonL/paseo-plugins/issues/328)) ([ff5a9d9](https://github.com/g0rdonL/paseo-plugins/commit/ff5a9d977e40abfbf4762f791f8ede37d1cb5d9f))
* **deps:** update dependency agent-browser to v0.39.2 ([#404](https://github.com/g0rdonL/paseo-plugins/issues/404)) ([7e75eb7](https://github.com/g0rdonL/paseo-plugins/commit/7e75eb71cd1179a6ecdd2a53cc3f1ffcc54af1d5))
* **deps:** update dependency agent-browser to v0.39.4 ([#428](https://github.com/g0rdonL/paseo-plugins/issues/428)) ([e9019d8](https://github.com/g0rdonL/paseo-plugins/commit/e9019d829b10e1d591a5c05775ff645cfcc82969))
* **deps:** update dependency agent-browser to v0.40.0 ([#441](https://github.com/g0rdonL/paseo-plugins/issues/441)) ([70ec979](https://github.com/g0rdonL/paseo-plugins/commit/70ec979f3d07b4fcf4505e2002cc678253d55ef0))
* **deps:** update dependency agent-browser to v0.41.0 ([#467](https://github.com/g0rdonL/paseo-plugins/issues/467)) ([51fe454](https://github.com/g0rdonL/paseo-plugins/commit/51fe45466f1138ee1be41e8c0f55c8b1c5780627))
* **deps:** update dependency agent-browser to v0.41.1 ([#499](https://github.com/g0rdonL/paseo-plugins/issues/499)) ([2964abf](https://github.com/g0rdonL/paseo-plugins/commit/2964abfef80355fd410e10ab7779db4da208c883))
* **deps:** update dependency agent-browser to v0.41.2 ([#542](https://github.com/g0rdonL/paseo-plugins/issues/542)) ([36d8783](https://github.com/g0rdonL/paseo-plugins/commit/36d8783ab5f98706380acd712a04583cc5ede0db))
* **deps:** update dependency agent-browser to v0.42.0 ([#610](https://github.com/g0rdonL/paseo-plugins/issues/610)) ([de723da](https://github.com/g0rdonL/paseo-plugins/commit/de723da538539cdf126aa9294670176f2dd430ba))
* **deps:** update dependency agent-browser to v0.43.0 ([#629](https://github.com/g0rdonL/paseo-plugins/issues/629)) ([e407fbd](https://github.com/g0rdonL/paseo-plugins/commit/e407fbd1c3d9fe69583ca1ca6a8fb6e310d11e94))
* **packaging:** lock npm runtime dependencies with npm-shrinkwrap.json ([#300](https://github.com/g0rdonL/paseo-plugins/issues/300)) ([1b0755c](https://github.com/g0rdonL/paseo-plugins/commit/1b0755c9097681cdc167fb26bd2d1c3cc5e72830))
* **paseo-omp,paseo-shared-browser:** run npm ci through the shell and drop staged overrides ([#445](https://github.com/g0rdonL/paseo-plugins/issues/445)) ([d727c7a](https://github.com/g0rdonL/paseo-plugins/commit/d727c7a7569104f2bcf9ad53d722788296450c65))
* **paseo-shared-browser:** bound video smoke polling by time, not RPC count ([#389](https://github.com/g0rdonL/paseo-plugins/issues/389)) ([1e54070](https://github.com/g0rdonL/paseo-plugins/commit/1e5407079e2bb993b0f2661b8b1263995ed505aa))
* **paseo-shared-browser:** bump runtime protocol so stale supervisors are not reused ([#323](https://github.com/g0rdonL/paseo-plugins/issues/323)) ([581b135](https://github.com/g0rdonL/paseo-plugins/commit/581b135f13d4c58a30bb25136115a57d1b3415c6))
* **paseo-shared-browser:** commit Android IME text inserted outside a composition ([#584](https://github.com/g0rdonL/paseo-plugins/issues/584)) ([921dc45](https://github.com/g0rdonL/paseo-plugins/commit/921dc454a9060cfdbc04798492a9feb3b0414154))
* **paseo-shared-browser:** do not hold a bridge lease after disconnect ([#558](https://github.com/g0rdonL/paseo-plugins/issues/558)) ([17c1a3a](https://github.com/g0rdonL/paseo-plugins/commit/17c1a3a22ca718d2c56169592aed135ed4f52132))
* **paseo-shared-browser:** ignore pre-settlement frames after input ([#264](https://github.com/g0rdonL/paseo-plugins/issues/264)) ([2ca1674](https://github.com/g0rdonL/paseo-plugins/commit/2ca16748862fbe220a1caf62a165240632e42f89))
* **paseo-shared-browser:** keep Electron running as Node for the MCP launcher ([#130](https://github.com/g0rdonL/paseo-plugins/issues/130)) (@PipeStitch) ([d4b06e0](https://github.com/g0rdonL/paseo-plugins/commit/d4b06e0e78630a3786fb6f071138d0b773fad915))
* **paseo-shared-browser:** keep frame generations for slow native video encodes ([#458](https://github.com/g0rdonL/paseo-plugins/issues/458)) ([afef687](https://github.com/g0rdonL/paseo-plugins/commit/afef687251797a789f7b3a3ffbe69b18c6d6d812))
* **paseo-shared-browser:** keep only a verified daemon record after a failed open ([#466](https://github.com/g0rdonL/paseo-plugins/issues/466)) ([6fea779](https://github.com/g0rdonL/paseo-plugins/commit/6fea7798b9ce0897cd8d5a83e7d1de42975b5fe8))
* **paseo-shared-browser:** keep video smoke consumer visible so frames present ([#387](https://github.com/g0rdonL/paseo-plugins/issues/387)) ([0e88f0e](https://github.com/g0rdonL/paseo-plugins/commit/0e88f0e4860e573e584e0a2d923ad1730e7bd8a0))
* **paseo-shared-browser:** map pointer input to actual frame dimensions ([#263](https://github.com/g0rdonL/paseo-plugins/issues/263)) ([7e5aa5b](https://github.com/g0rdonL/paseo-plugins/commit/7e5aa5b764edd019e055b41d7bd7eedfe5c7f65e))
* **paseo-shared-browser:** preserve tab order and confirm closes ([#280](https://github.com/g0rdonL/paseo-plugins/issues/280)) (@RyanEwen) ([ac7ca1c](https://github.com/g0rdonL/paseo-plugins/commit/ac7ca1c918785f00ded17af43cb09657b232ff56))
* **paseo-shared-browser:** preserve video input freshness and decoding ([#275](https://github.com/g0rdonL/paseo-plugins/issues/275)) (@RyanEwen) ([4a5c74e](https://github.com/g0rdonL/paseo-plugins/commit/4a5c74e943d485a3872fcf8466ef86f79daea1f4))
* **paseo-shared-browser:** regenerate npm-shrinkwrap for agent-browser 0.38.2 ([#314](https://github.com/g0rdonL/paseo-plugins/issues/314)) ([54f64d8](https://github.com/g0rdonL/paseo-plugins/commit/54f64d8941147ab35f5587192dd72ab5e3be5cb0))
* **paseo-shared-browser:** resync viewport when fallback frame size disagrees ([#266](https://github.com/g0rdonL/paseo-plugins/issues/266)) ([842155f](https://github.com/g0rdonL/paseo-plugins/commit/842155ff7a3d80d61525a0f0f8afb979a65b79fa))
* **paseo-shared-browser:** show the composer pill in background workspaces ([#352](https://github.com/g0rdonL/paseo-plugins/issues/352)) ([dc1cfda](https://github.com/g0rdonL/paseo-plugins/commit/dc1cfdaa7af6ffc0a8a5e22c53e869df7f5a37d6))
* **paseo-shared-browser:** support macOS and Windows runtimes ([#121](https://github.com/g0rdonL/paseo-plugins/issues/121)) ([ef26e5c](https://github.com/g0rdonL/paseo-plugins/commit/ef26e5c6c7021bace43f19f5304df342ec8867e1))
* **plugins:** accept Paseo 0.13 in the plugin manifest range ([bdb9435](https://github.com/g0rdonL/paseo-plugins/commit/bdb943595515ab7f21a93c66cffeb6844bacdcdb))
* **plugins:** declare Paseo 0.12 compatibility ([7dbbe2a](https://github.com/g0rdonL/paseo-plugins/commit/7dbbe2a15aa7fb92ae846afa89a174cbed749f8e))
* **plugins:** prepare for Paseo 0.10 beta ([#186](https://github.com/g0rdonL/paseo-plugins/issues/186)) ([0294fd0](https://github.com/g0rdonL/paseo-plugins/commit/0294fd0fd7ad5101e724d4196a49ac27783b5483))
* **plugins:** ship OVERVIEW.md in published packages ([640f9a4](https://github.com/g0rdonL/paseo-plugins/commit/640f9a4d7bd6dbad226c4ee1ebaa199abfc62776))
* resolve shared browser and OMP regressions ([#200](https://github.com/g0rdonL/paseo-plugins/issues/200)) ([fbf59bb](https://github.com/g0rdonL/paseo-plugins/commit/fbf59bb98d0740ba27c4eba7856d3d9079bf4bc4))
* **shared-browser:** add encoded video toggle, keep held gestures alive, recover expired tab polling ([#614](https://github.com/g0rdonL/paseo-plugins/issues/614)) ([e9c012b](https://github.com/g0rdonL/paseo-plugins/commit/e9c012bfa19fee70c4fb36c83befbc7a5a1f6a23))
* **shared-browser:** follow owned agent directory ([#164](https://github.com/g0rdonL/paseo-plugins/issues/164)) ([9892e6e](https://github.com/g0rdonL/paseo-plugins/commit/9892e6e28b71cf0b1db6d0f6048bba122eb0587d))
* **shared-browser:** skip MCP injection for OMP ([#21](https://github.com/g0rdonL/paseo-plugins/issues/21)) ([ee2db08](https://github.com/g0rdonL/paseo-plugins/commit/ee2db08243640600c5592debe72f680446fa26d0))
* **shared-browser:** support Paseo 0.9 beta ([#86](https://github.com/g0rdonL/paseo-plugins/issues/86)) ([3af209f](https://github.com/g0rdonL/paseo-plugins/commit/3af209f3a8fa347ba7dc05c300061a682d809f88))
* **shared-browser:** support system Chromium on Linux ARM64 ([#58](https://github.com/g0rdonL/paseo-plugins/issues/58)) ([f9c3dcb](https://github.com/g0rdonL/paseo-plugins/commit/f9c3dcb1031840c7cd0aed4a70f984d9d9bd24c1))
</details>

<details><summary>paseo-gas-city: 3.0.0</summary>

## [3.0.0](https://github.com/g0rdonL/paseo-plugins/compare/paseo-gas-city-v2.1.3...paseo-gas-city-v3.0.0) (2026-11-17)


###   BREAKING CHANGES

* the affected plugins no longer load on Paseo 0.9 or 0.10. Screen and sidebar IDs, params and settings are unchanged.
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170))

### Features

* add listing icon to plugin manifests ([#418](https://github.com/g0rdonL/paseo-plugins/issues/418)) ([2e7aadd](https://github.com/g0rdonL/paseo-plugins/commit/2e7aaddac381bb2a5c596f95b1f9b7b8aee89cb2))
* **gas-city:** add operator control-plane plugin ([#15](https://github.com/g0rdonL/paseo-plugins/issues/15)) ([42b17ce](https://github.com/g0rdonL/paseo-plugins/commit/42b17ce9e894f8c39c02be2cdc288cac78fb0124))
* **gas-city:** sidebar health row, city popover and per-city screens on Paseo 0.11 ([#252](https://github.com/g0rdonL/paseo-plugins/issues/252)) ([f87fc12](https://github.com/g0rdonL/paseo-plugins/commit/f87fc12ffbb39e41c2ea4185cf706f3be99f1092))
* **plugins:** declare Paseo 0.11 compatibility ([#248](https://github.com/g0rdonL/paseo-plugins/issues/248)) ([f983a8b](https://github.com/g0rdonL/paseo-plugins/commit/f983a8bf2025f009c178c15183d6cfac0b2024dd))
* **plugins:** support Paseo 0.10.1 ([#221](https://github.com/g0rdonL/paseo-plugins/issues/221)) ([9d71ea0](https://github.com/g0rdonL/paseo-plugins/commit/9d71ea09eaa9ed67429813ed3e2de2567c14c825))
* **release:** publish plugins to npm ([#80](https://github.com/g0rdonL/paseo-plugins/issues/80)) ([3c93048](https://github.com/g0rdonL/paseo-plugins/commit/3c93048cfefda97d8c2bc1631e3428fb64bdad09))
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170)) ([04acfca](https://github.com/g0rdonL/paseo-plugins/commit/04acfcabcf8140edbd3a98681a72cabef7bb74ba))
* require Paseo 0.11 and drop legacy surface navigation ([#286](https://github.com/g0rdonL/paseo-plugins/issues/286)) ([a46fe9e](https://github.com/g0rdonL/paseo-plugins/commit/a46fe9ee910c2cc485043d53c67dacf49bab402b))


### Bug Fixes

* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
* **gas-city:** support Paseo 0.9 beta settings ([#102](https://github.com/g0rdonL/paseo-plugins/issues/102)) ([dd4ccda](https://github.com/g0rdonL/paseo-plugins/commit/dd4ccda0d85e4160c9ad39d5a9045fb690ed5510))
* **gas-city:** support Paseo 0.9 beta settings ([#91](https://github.com/g0rdonL/paseo-plugins/issues/91)) ([15c9a97](https://github.com/g0rdonL/paseo-plugins/commit/15c9a970ce5fccd7a09ed4284b8aa2d37c43b464))
* **paseo-gas-city:** hold a /sling intent until the running dispatch settles ([#555](https://github.com/g0rdonL/paseo-plugins/issues/555)) ([3aac432](https://github.com/g0rdonL/paseo-plugins/commit/3aac43204b9e22142221355fa37a5585e842db4a))
* **plugins:** accept Paseo 0.13 in the plugin manifest range ([bdb9435](https://github.com/g0rdonL/paseo-plugins/commit/bdb943595515ab7f21a93c66cffeb6844bacdcdb))
* **plugins:** declare Paseo 0.12 compatibility ([7dbbe2a](https://github.com/g0rdonL/paseo-plugins/commit/7dbbe2a15aa7fb92ae846afa89a174cbed749f8e))
* **plugins:** prepare for Paseo 0.10 beta ([#186](https://github.com/g0rdonL/paseo-plugins/issues/186)) ([0294fd0](https://github.com/g0rdonL/paseo-plugins/commit/0294fd0fd7ad5101e724d4196a49ac27783b5483))
* **plugins:** ship OVERVIEW.md in published packages ([640f9a4](https://github.com/g0rdonL/paseo-plugins/commit/640f9a4d7bd6dbad226c4ee1ebaa199abfc62776))
</details>

<details><summary>paseo-context-mode: 5.0.0</summary>

## [5.0.0](https://github.com/g0rdonL/paseo-plugins/compare/paseo-context-mode-v4.0.6...paseo-context-mode-v5.0.0) (2026-11-17)


###   BREAKING CHANGES

* **context-mode:** bundles Context Mode 2.1.4 and requires Node.js 24.15 or later. Cursor, Pi and OMP agents no longer get an injected server because Context Mode 2 cannot serve them over MCP. Only Context Mode 2 databases are read; 1.x data is left untouched and not shown. Agents created by an older plugin version must be recreated to pick up the new server entry.
* **context-mode:** requires Paseo ^0.12.0. The includeBackground option throws on older hosts.
* the affected plugins no longer load on Paseo 0.9 or 0.10. Screen and sidebar IDs, params and settings are unchanged.
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170))

### Features

* add listing icon to plugin manifests ([#418](https://github.com/g0rdonL/paseo-plugins/issues/418)) ([2e7aadd](https://github.com/g0rdonL/paseo-plugins/commit/2e7aaddac381bb2a5c596f95b1f9b7b8aee89cb2))
* **context-mode:** add provider-aware integration ([#136](https://github.com/g0rdonL/paseo-plugins/issues/136)) ([304db0a](https://github.com/g0rdonL/paseo-plugins/commit/304db0a36627d62224cd16f1003e838f82427a2e))
* **context-mode:** Paseo 0.11 screen, scoped Knowledge pill and sidebar health row ([#255](https://github.com/g0rdonL/paseo-plugins/issues/255)) ([3607735](https://github.com/g0rdonL/paseo-plugins/commit/36077351f942405451995d31e7b853c5100b59f7))
* **context-mode:** run on Context Mode 2.1.4 ([#544](https://github.com/g0rdonL/paseo-plugins/issues/544)) ([91781c6](https://github.com/g0rdonL/paseo-plugins/commit/91781c6b3525322bafaa0a342f0764d6097420ad))
* **plugins:** declare Paseo 0.11 compatibility ([#248](https://github.com/g0rdonL/paseo-plugins/issues/248)) ([f983a8b](https://github.com/g0rdonL/paseo-plugins/commit/f983a8bf2025f009c178c15183d6cfac0b2024dd))
* **plugins:** support Paseo 0.10.1 ([#221](https://github.com/g0rdonL/paseo-plugins/issues/221)) ([9d71ea0](https://github.com/g0rdonL/paseo-plugins/commit/9d71ea09eaa9ed67429813ed3e2de2567c14c825))
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170)) ([04acfca](https://github.com/g0rdonL/paseo-plugins/commit/04acfcabcf8140edbd3a98681a72cabef7bb74ba))
* require Paseo 0.11 and drop legacy surface navigation ([#286](https://github.com/g0rdonL/paseo-plugins/issues/286)) ([a46fe9e](https://github.com/g0rdonL/paseo-plugins/commit/a46fe9ee910c2cc485043d53c67dacf49bab402b))


### Bug Fixes

* **context-mode:** cover configured providers in Savings and Knowledge ([#311](https://github.com/g0rdonL/paseo-plugins/issues/311)) ([bcb9ded](https://github.com/g0rdonL/paseo-plugins/commit/bcb9dedf31ecf74acb1cb6d1f0f9e1dca48a23ef))
* **context-mode:** derive PaseoApi type from host plugin client ([#288](https://github.com/g0rdonL/paseo-plugins/issues/288)) ([5cb9797](https://github.com/g0rdonL/paseo-plugins/commit/5cb9797df720f341deb8a0a8542ef617f89dc102))
* **context-mode:** evict only the cache entry that failed ([#550](https://github.com/g0rdonL/paseo-plugins/issues/550)) ([fc261cf](https://github.com/g0rdonL/paseo-plugins/commit/fc261cf50435254414096b5aa17977f771b3fa46))
* **context-mode:** inject into providers derived via extends ([#306](https://github.com/g0rdonL/paseo-plugins/issues/306)) ([459f12a](https://github.com/g0rdonL/paseo-plugins/commit/459f12a6ff181e67dfd178b2d1e27cad05c4413e))
* **context-mode:** replace the D1 host update command with plugin upgrade advice ([#630](https://github.com/g0rdonL/paseo-plugins/issues/630)) ([00818ed](https://github.com/g0rdonL/paseo-plugins/commit/00818edd685673c62e06809d63342feb0f8588d5))
* **context-mode:** resolve the bundled runtime from the plugin directory ([#452](https://github.com/g0rdonL/paseo-plugins/issues/452)) ([9529e18](https://github.com/g0rdonL/paseo-plugins/commit/9529e182f539e5ce7f3597ed277d1ecd04a24721))
* **context-mode:** run panel probes against a plugin-owned storage root ([#334](https://github.com/g0rdonL/paseo-plugins/issues/334)) ([344001e](https://github.com/g0rdonL/paseo-plugins/commit/344001e424d58aac79e2fa7f869ef465ca8070be))
* **context-mode:** show the composer pill in background workspaces ([#349](https://github.com/g0rdonL/paseo-plugins/issues/349)) ([605b573](https://github.com/g0rdonL/paseo-plugins/commit/605b573fff8d6b15a6033bcfd4e464dcdb7b8a97))
* **context-mode:** treat agent or workspace from another host as unscoped ([#318](https://github.com/g0rdonL/paseo-plugins/issues/318)) ([0b17694](https://github.com/g0rdonL/paseo-plugins/commit/0b17694a87cc2eb5ad631d65e2e8f05561d90503))
* **deps:** support Paseo 0.14.0 ([#429](https://github.com/g0rdonL/paseo-plugins/issues/429)) ([7d79f4c](https://github.com/g0rdonL/paseo-plugins/commit/7d79f4cec882888dd48f0674957d3cd8b97a720b))
* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0 ([#488](https://github.com/g0rdonL/paseo-plugins/issues/488)) ([7e03060](https://github.com/g0rdonL/paseo-plugins/commit/7e0306043670294badb5b6c2c5b374c9c84da457))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
* **deps:** update dependency context-mode to v2.1.10 ([#621](https://github.com/g0rdonL/paseo-plugins/issues/621)) ([bb9d91f](https://github.com/g0rdonL/paseo-plugins/commit/bb9d91ffe97b8fb22ca86f4cbd3dc003eeae29c2))
* **deps:** update dependency context-mode to v2.1.5 ([#567](https://github.com/g0rdonL/paseo-plugins/issues/567)) ([e541117](https://github.com/g0rdonL/paseo-plugins/commit/e54111792d24d65bf529d06799af1dafd1cad86b))
* **deps:** update dependency context-mode to v2.1.6 ([#589](https://github.com/g0rdonL/paseo-plugins/issues/589)) ([6e369b1](https://github.com/g0rdonL/paseo-plugins/commit/6e369b10518e13fdafd4e25d79c6ee3f287b8c8d))
* **deps:** update dependency context-mode to v2.1.7 ([#593](https://github.com/g0rdonL/paseo-plugins/issues/593)) ([3f033e9](https://github.com/g0rdonL/paseo-plugins/commit/3f033e90d04e548faad89847b06ce817d293096c))
* **packaging:** lock npm runtime dependencies with npm-shrinkwrap.json ([#300](https://github.com/g0rdonL/paseo-plugins/issues/300)) ([1b0755c](https://github.com/g0rdonL/paseo-plugins/commit/1b0755c9097681cdc167fb26bd2d1c3cc5e72830))
* **plugins:** accept Paseo 0.13 in the plugin manifest range ([bdb9435](https://github.com/g0rdonL/paseo-plugins/commit/bdb943595515ab7f21a93c66cffeb6844bacdcdb))
* **plugins:** declare Paseo 0.12 compatibility ([7dbbe2a](https://github.com/g0rdonL/paseo-plugins/commit/7dbbe2a15aa7fb92ae846afa89a174cbed749f8e))
* **plugins:** prepare for Paseo 0.10 beta ([#186](https://github.com/g0rdonL/paseo-plugins/issues/186)) ([0294fd0](https://github.com/g0rdonL/paseo-plugins/commit/0294fd0fd7ad5101e724d4196a49ac27783b5483))
* **plugins:** ship OVERVIEW.md in published packages ([640f9a4](https://github.com/g0rdonL/paseo-plugins/commit/640f9a4d7bd6dbad226c4ee1ebaa199abfc62776))
* **ui:** raise context-mode eyebrow contrast and fix radar empty-queue copy ([#290](https://github.com/g0rdonL/paseo-plugins/issues/290)) ([ed16e30](https://github.com/g0rdonL/paseo-plugins/commit/ed16e30efe09aef0c4ebdee9b6d69d25e0e3cb2e))
</details>

<details><summary>connected-hosts: 0.3.0</summary>

## [0.3.0](https://github.com/g0rdonL/paseo-plugins/compare/connected-hosts-v0.2.3...connected-hosts-v0.3.0) (2026-11-17)


### Features

* add listing icon to plugin manifests ([#418](https://github.com/g0rdonL/paseo-plugins/issues/418)) ([2e7aadd](https://github.com/g0rdonL/paseo-plugins/commit/2e7aaddac381bb2a5c596f95b1f9b7b8aee89cb2))
* **connected-hosts:** manage connected hosts from the UI ([#394](https://github.com/g0rdonL/paseo-plugins/issues/394)) ([5f093fe](https://github.com/g0rdonL/paseo-plugins/commit/5f093fe358397cc7fef8ecf5d38a2c95eefbb1c2))


### Bug Fixes

* **connected-hosts:** stop importing types from @getpaseo/client in shipped client code ([#396](https://github.com/g0rdonL/paseo-plugins/issues/396)) ([22f21bd](https://github.com/g0rdonL/paseo-plugins/commit/22f21bd20767da0de0f22189ec1992f855de90a6))
* **connected-hosts:** track busy hosts per row ([#545](https://github.com/g0rdonL/paseo-plugins/issues/545)) ([dd59e29](https://github.com/g0rdonL/paseo-plugins/commit/dd59e291ada014ffb8c08d9fa17f3134810554ec))
* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
</details>

<details><summary>pr-radar: 4.0.0</summary>

## [4.0.0](https://github.com/g0rdonL/paseo-plugins/compare/pr-radar-v3.2.3...pr-radar-v4.0.0) (2026-11-17)


###   BREAKING CHANGES

* **pr-radar:** requires Paseo ^0.12.0. The includeBackground option throws on older hosts.
* the affected plugins no longer load on Paseo 0.9 or 0.10. Screen and sidebar IDs, params and settings are unchanged.
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170))

### Features

* add listing icon to plugin manifests ([#418](https://github.com/g0rdonL/paseo-plugins/issues/418)) ([2e7aadd](https://github.com/g0rdonL/paseo-plugins/commit/2e7aaddac381bb2a5c596f95b1f9b7b8aee89cb2))
* **plugins:** declare Paseo 0.11 compatibility ([#248](https://github.com/g0rdonL/paseo-plugins/issues/248)) ([f983a8b](https://github.com/g0rdonL/paseo-plugins/commit/f983a8bf2025f009c178c15183d6cfac0b2024dd))
* **plugins:** support Paseo 0.10.1 ([#221](https://github.com/g0rdonL/paseo-plugins/issues/221)) ([9d71ea0](https://github.com/g0rdonL/paseo-plugins/commit/9d71ea09eaa9ed67429813ed3e2de2567c14c825))
* **pr-radar:** add copy-link button to PR cards ([#369](https://github.com/g0rdonL/paseo-plugins/issues/369)) ([@g0rdon](https://github.com/g0rdon)L) ([090dfd2](https://github.com/g0rdonL/paseo-plugins/commit/090dfd2a7dc529b68830519e8ab9b04d960cc7ea))
* **pr-radar:** add sort options to the radar ([#374](https://github.com/g0rdonL/paseo-plugins/issues/374)) ([@g0rdon](https://github.com/g0rdon)L) ([188859b](https://github.com/g0rdonL/paseo-plugins/commit/188859b71b0384e565966ca2fcf4c0deed5d1d25))
* **pr-radar:** collapse flip-flopping PR changes into their net change ([#373](https://github.com/g0rdonL/paseo-plugins/issues/373)) ([@g0rdon](https://github.com/g0rdon)L) ([d0ce35d](https://github.com/g0rdonL/paseo-plugins/commit/d0ce35d63abdfb68639807974e98c7f456e66b66))
* **pr-radar:** keep filter chips on one horizontally scrolling line ([#371](https://github.com/g0rdonL/paseo-plugins/issues/371)) ([@g0rdon](https://github.com/g0rdon)L) ([1b6f357](https://github.com/g0rdonL/paseo-plugins/commit/1b6f357863077dad2245a15efe4302bd9b83b6d9))
* **pr-radar:** needs-you sidebar row, popover and linkable screen on Paseo 0.11 ([#253](https://github.com/g0rdonL/paseo-plugins/issues/253)) ([aab9f00](https://github.com/g0rdonL/paseo-plugins/commit/aab9f00d736100881afcf8aed7b01bfef3c1d307))
* **pr-radar:** refresh GitHub data in the background, answer from memory ([#375](https://github.com/g0rdonL/paseo-plugins/issues/375)) ([@g0rdon](https://github.com/g0rdon)L) ([f212e49](https://github.com/g0rdonL/paseo-plugins/commit/f212e49ce2d619af7480481c013fce1740f30060))
* **pr-radar:** use the compact card layout in narrow panes ([#370](https://github.com/g0rdonL/paseo-plugins/issues/370)) ([@g0rdon](https://github.com/g0rdon)L) ([169276f](https://github.com/g0rdonL/paseo-plugins/commit/169276f596a2a923e899fa0d894f75fe974db75e))
* **release:** publish plugins to npm ([#80](https://github.com/g0rdonL/paseo-plugins/issues/80)) ([3c93048](https://github.com/g0rdonL/paseo-plugins/commit/3c93048cfefda97d8c2bc1631e3428fb64bdad09))
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170)) ([04acfca](https://github.com/g0rdonL/paseo-plugins/commit/04acfcabcf8140edbd3a98681a72cabef7bb74ba))
* require Paseo 0.11 and drop legacy surface navigation ([#286](https://github.com/g0rdonL/paseo-plugins/issues/286)) ([a46fe9e](https://github.com/g0rdonL/paseo-plugins/commit/a46fe9ee910c2cc485043d53c67dacf49bab402b))


### Bug Fixes

* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
* **plugins:** accept Paseo 0.13 in the plugin manifest range ([bdb9435](https://github.com/g0rdonL/paseo-plugins/commit/bdb943595515ab7f21a93c66cffeb6844bacdcdb))
* **plugins:** declare Paseo 0.12 compatibility ([7dbbe2a](https://github.com/g0rdonL/paseo-plugins/commit/7dbbe2a15aa7fb92ae846afa89a174cbed749f8e))
* **plugins:** prepare for Paseo 0.10 beta ([#186](https://github.com/g0rdonL/paseo-plugins/issues/186)) ([0294fd0](https://github.com/g0rdonL/paseo-plugins/commit/0294fd0fd7ad5101e724d4196a49ac27783b5483))
* **plugins:** ship OVERVIEW.md in published packages ([640f9a4](https://github.com/g0rdonL/paseo-plugins/commit/640f9a4d7bd6dbad226c4ee1ebaa199abfc62776))
* **pr-radar:** don't label a just-opened PR as external ([@g0rdon](https://github.com/g0rdon)L) ([5a00c76](https://github.com/g0rdonL/paseo-plugins/commit/5a00c76977b5ea672d66a3ddc8e6b554e48773cf))
* **pr-radar:** fix version constraint for paseo in JSON ([#104](https://github.com/g0rdonL/paseo-plugins/issues/104)) ([13f076d](https://github.com/g0rdonL/paseo-plugins/commit/13f076d6235c33b543193cbe90e7ab0d887a996c))
* **pr-radar:** honor PASEO_HOME for inbox state ([#283](https://github.com/g0rdonL/paseo-plugins/issues/283)) ([debe292](https://github.com/g0rdonL/paseo-plugins/commit/debe2927653212455e5f08d91028b83826867fd9))
* **pr-radar:** include background workspaces and page agents stably ([#347](https://github.com/g0rdonL/paseo-plugins/issues/347)) ([8d8897b](https://github.com/g0rdonL/paseo-plugins/commit/8d8897ba6de2029bdb96eeb603db6214e41f72ae))
* **pr-radar:** keep helper agents off PR rows ([#603](https://github.com/g0rdonL/paseo-plugins/issues/603)) ([cbbf7f6](https://github.com/g0rdonL/paseo-plugins/commit/cbbf7f6eee6398ea98d415694f50eaa1792fbc3e))
* **pr-radar:** limit concurrent GitHub searches to reduce rate-limit bursts ([#372](https://github.com/g0rdonL/paseo-plugins/issues/372)) ([@g0rdon](https://github.com/g0rdon)L) ([c57a8ed](https://github.com/g0rdonL/paseo-plugins/commit/c57a8edda6659acb5d179fd9664e2185aebdcb89))
* **pr-radar:** observe owned directories ([#161](https://github.com/g0rdonL/paseo-plugins/issues/161)) ([fb52c34](https://github.com/g0rdonL/paseo-plugins/commit/fb52c34258ab0098126328307c8f82d8a99b32ac))
* **pr-radar:** pass a profile's provider options when starting an agent ([#576](https://github.com/g0rdonL/paseo-plugins/issues/576)) ([1707853](https://github.com/g0rdonL/paseo-plugins/commit/17078535f1972a84d438571c0e28a8cf2fa2b446))
* **pr-radar:** support Paseo 0.9 beta ([#101](https://github.com/g0rdonL/paseo-plugins/issues/101)) ([99cca96](https://github.com/g0rdonL/paseo-plugins/commit/99cca96e0869e113bd3b0df69ad46b01617ba50d))
* **ui:** raise context-mode eyebrow contrast and fix radar empty-queue copy ([#290](https://github.com/g0rdonL/paseo-plugins/issues/290)) ([ed16e30](https://github.com/g0rdonL/paseo-plugins/commit/ed16e30efe09aef0c4ebdee9b6d69d25e0e3cb2e))
</details>

<details><summary>queens: 5.0.0</summary>

## [5.0.0](https://github.com/g0rdonL/paseo-plugins/compare/queens-v4.1.4...queens-v5.0.0) (2026-11-17)


###   BREAKING CHANGES

* **queens:** requires Paseo ^0.12.0. The includeBackground option throws on older hosts.
* the affected plugins no longer load on Paseo 0.9 or 0.10. Screen and sidebar IDs, params and settings are unchanged.
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170))

### Features

* add listing icon to plugin manifests ([#418](https://github.com/g0rdonL/paseo-plugins/issues/418)) ([2e7aadd](https://github.com/g0rdonL/paseo-plugins/commit/2e7aaddac381bb2a5c596f95b1f9b7b8aee89cb2))
* **plugins:** declare Paseo 0.11 compatibility ([#248](https://github.com/g0rdonL/paseo-plugins/issues/248)) ([f983a8b](https://github.com/g0rdonL/paseo-plugins/commit/f983a8bf2025f009c178c15183d6cfac0b2024dd))
* **plugins:** support Paseo 0.10.1 ([#221](https://github.com/g0rdonL/paseo-plugins/issues/221)) ([9d71ea0](https://github.com/g0rdonL/paseo-plugins/commit/9d71ea09eaa9ed67429813ed3e2de2567c14c825))
* **queens:** add Queens puzzle plugin ([#141](https://github.com/g0rdonL/paseo-plugins/issues/141)) ([57698c3](https://github.com/g0rdonL/paseo-plugins/commit/57698c35caf5ffb33ed4073f6cc52a8eb2b79a28))
* **queens:** open puzzles as linkable screens with sidebar progress ([#257](https://github.com/g0rdonL/paseo-plugins/issues/257)) ([43a8332](https://github.com/g0rdonL/paseo-plugins/commit/43a8332c34facc44cce984924f01e9db740352bb))
* require Paseo ^0.9.0 for all plugins ([#170](https://github.com/g0rdonL/paseo-plugins/issues/170)) ([04acfca](https://github.com/g0rdonL/paseo-plugins/commit/04acfcabcf8140edbd3a98681a72cabef7bb74ba))
* require Paseo 0.11 and drop legacy surface navigation ([#286](https://github.com/g0rdonL/paseo-plugins/issues/286)) ([a46fe9e](https://github.com/g0rdonL/paseo-plugins/commit/a46fe9ee910c2cc485043d53c67dacf49bab402b))


### Bug Fixes

* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
* **plugins:** accept Paseo 0.13 in the plugin manifest range ([bdb9435](https://github.com/g0rdonL/paseo-plugins/commit/bdb943595515ab7f21a93c66cffeb6844bacdcdb))
* **plugins:** declare Paseo 0.12 compatibility ([7dbbe2a](https://github.com/g0rdonL/paseo-plugins/commit/7dbbe2a15aa7fb92ae846afa89a174cbed749f8e))
* **plugins:** prepare for Paseo 0.10 beta ([#186](https://github.com/g0rdonL/paseo-plugins/issues/186)) ([0294fd0](https://github.com/g0rdonL/paseo-plugins/commit/0294fd0fd7ad5101e724d4196a49ac27783b5483))
* **plugins:** ship OVERVIEW.md in published packages ([640f9a4](https://github.com/g0rdonL/paseo-plugins/commit/640f9a4d7bd6dbad226c4ee1ebaa199abfc62776))
* **queens:** include background workspaces ([#350](https://github.com/g0rdonL/paseo-plugins/issues/350)) ([af6be35](https://github.com/g0rdonL/paseo-plugins/commit/af6be35fd495d0437f8fa623daca2cdb8639d8d1))
* **queens:** keep the popover timer on a steady cadence ([#557](https://github.com/g0rdonL/paseo-plugins/issues/557)) ([e6cf113](https://github.com/g0rdonL/paseo-plugins/commit/e6cf113374374d7a697bb86ab1ddc7b4b27f071d))
* **queens:** leave helper agents out of the running-agent count ([#599](https://github.com/g0rdonL/paseo-plugins/issues/599)) ([97c7479](https://github.com/g0rdonL/paseo-plugins/commit/97c7479bcf01df66e74c470edf8426d757d9604b))
* **queens:** observe owned agent directories ([#165](https://github.com/g0rdonL/paseo-plugins/issues/165)) ([4c3cd02](https://github.com/g0rdonL/paseo-plugins/commit/4c3cd028277a54332cd19372e7aa9f813c0c5e6b))
* **queens:** preserve queens during drags ([#147](https://github.com/g0rdonL/paseo-plugins/issues/147)) ([9fbc2e0](https://github.com/g0rdonL/paseo-plugins/commit/9fbc2e093cfcb6071ed219e3e4d4d9e4af8add48))
* **queens:** re-acquire the shared controller after another instance recovers ([#548](https://github.com/g0rdonL/paseo-plugins/issues/548)) ([3b7e83f](https://github.com/g0rdonL/paseo-plugins/commit/3b7e83fe3767f403afa11fa36f12e802cf5f54c7))
* **queens:** restore composer puzzle navigation ([#145](https://github.com/g0rdonL/paseo-plugins/issues/145)) ([379e371](https://github.com/g0rdonL/paseo-plugins/commit/379e371882d114d6a514f22cae4287aee230f7b9))
* **queens:** skip no-op writes so an unchanged revision cannot strand the save queue ([#546](https://github.com/g0rdonL/paseo-plugins/issues/546)) ([38da636](https://github.com/g0rdonL/paseo-plugins/commit/38da636217b32afbe4ba792b8a5a9c3310c57d5b))
</details>

<details><summary>sandbox: 0.4.0</summary>

## [0.4.0](https://github.com/g0rdonL/paseo-plugins/compare/sandbox-v0.3.2...sandbox-v0.4.0) (2026-11-17)


### Features

* add listing icon to plugin manifests ([#418](https://github.com/g0rdonL/paseo-plugins/issues/418)) ([2e7aadd](https://github.com/g0rdonL/paseo-plugins/commit/2e7aaddac381bb2a5c596f95b1f9b7b8aee89cb2))
* **sandbox:** run project workspaces and agents in Docker sandboxes ([#395](https://github.com/g0rdonL/paseo-plugins/issues/395)) ([af77e50](https://github.com/g0rdonL/paseo-plugins/commit/af77e50ee3fbe1ac2ae20d8b70b1584e025ee461))
* **sandbox:** share the host's Claude, Codex, OpenCode and GitHub logins ([#400](https://github.com/g0rdonL/paseo-plugins/issues/400)) ([732d7b8](https://github.com/g0rdonL/paseo-plugins/commit/732d7b8febd531291afd3ffdb3ceca01bd6afacd))
* **sandbox:** ship OMP in the runtime image and share the host's OMP login ([#402](https://github.com/g0rdonL/paseo-plugins/issues/402)) ([25affdb](https://github.com/g0rdonL/paseo-plugins/commit/25affdb5ca33206c8cf0477d2588c3c8ef60fe71))


### Bug Fixes

* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
</details>

<details><summary>top: 0.1.0</summary>

## [0.1.0](https://github.com/g0rdonL/paseo-plugins/compare/top-v1.1.2...top-v0.1.0) (2026-11-17)


###   BREAKING CHANGES

* **top:** requires Paseo ^0.12.0. The includeBackground option throws on older hosts.

### Features

* add listing icon to plugin manifests ([#418](https://github.com/g0rdonL/paseo-plugins/issues/418)) ([2e7aadd](https://github.com/g0rdonL/paseo-plugins/commit/2e7aaddac381bb2a5c596f95b1f9b7b8aee89cb2))
* **top:** add host resource monitor plugin ([#324](https://github.com/g0rdonL/paseo-plugins/issues/324)) ([c9cfba4](https://github.com/g0rdonL/paseo-plugins/commit/c9cfba45a207ebec3f11ba212db6428e235a8ed9))
* **top:** list per-session load on macOS and Windows ([#330](https://github.com/g0rdonL/paseo-plugins/issues/330)) ([504b590](https://github.com/g0rdonL/paseo-plugins/commit/504b5907a3b44d72c0a15757a9a9f6e7ca03dd29))


### Bug Fixes

* **deps:** support Paseo 0.14.0-beta.1 ([0f019e0](https://github.com/g0rdonL/paseo-plugins/commit/0f019e054992660f589c14894c4382d51325dc31))
* **deps:** support Paseo 0.15.0-beta.1 ([#479](https://github.com/g0rdonL/paseo-plugins/issues/479)) ([89f4559](https://github.com/g0rdonL/paseo-plugins/commit/89f45597a6f634c856def38ed6a5a76782083a8b))
* **deps:** support Paseo 0.16 ([#574](https://github.com/g0rdonL/paseo-plugins/issues/574)) ([e53096c](https://github.com/g0rdonL/paseo-plugins/commit/e53096cea4c11ed81de3757c9f9710fa0042b723))
* **plugins:** accept Paseo 0.13 in the plugin manifest range ([bdb9435](https://github.com/g0rdonL/paseo-plugins/commit/bdb943595515ab7f21a93c66cffeb6844bacdcdb))
* **plugins:** declare Paseo 0.12 compatibility ([7dbbe2a](https://github.com/g0rdonL/paseo-plugins/commit/7dbbe2a15aa7fb92ae846afa89a174cbed749f8e))
* **top:** attribute agents in background workspaces ([#345](https://github.com/g0rdonL/paseo-plugins/issues/345)) ([fee66d6](https://github.com/g0rdonL/paseo-plugins/commit/fee66d64cf46cd3a07351d9308ff017e9d62d38b))
* **top:** derive PaseoApi type from plugin SDK so npm installs build ([#358](https://github.com/g0rdonL/paseo-plugins/issues/358)) ([477b85d](https://github.com/g0rdonL/paseo-plugins/commit/477b85d478d1e1fdc7a26795ae121b0312ee6462))
</details>

---
This PR was generated with [Release Please](https://github.com/googleapis/release-please). See [documentation](https://github.com/googleapis/release-please#release-please).