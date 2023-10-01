<div align="center">
  <a href="https://github.com/j4ckofalltrades/fog-of-war">
    <img src="https://res.cloudinary.com/j4ckofalltrades/image/upload/v1696140746/foss/icons8-dota-2-192_qquwjw.svg" alt="Logo" />
  </a>
  <h1 style="margin-top: 0px;">Fog of War</h1>
</div>

[![npm](https://img.shields.io/npm/v/fog-of-war)](https://npmjs.com/package/fog-of-war)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/j4ckofalltrades/steam-webapi-ts/typescript)

[![npm](https://nodei.co/npm/fog-of-war.png?compact=true)](https://npmjs.com/package/fog-of-war)

A DotA 2 game state integration library (tested on version [7.34c](https://www.dota2.com/patches/7.34c)) written in TypeScript .

For a list of available functions, check out the [docs](https://j4ckofalltrades.github.io/fog-of-war).

Icon by [Icons8](https://icons8.com).

## Installation

`$ npm install fog-of-war`

## Setup

To configure the DotA 2 client to report game state, you need to add a config file in the
`steamapps\common\dota 2 beta\game\dota\cfg\gamestate_integration\` directory.

The filename must follow the pattern `gamestate_integration_*.cfg`, for example `gamestate_integration_dota2-gsi.cfg`.

```
"dota2-gsi Configuration"
{
    "uri"               "http://localhost:1337/gsi"
    "timeout"           "5.0"
    "buffer"            "0.1"
    "throttle"          "0.1"
    "heartbeat"         "30.0"
    "data"
    {
        "buildings"     "1"
        "provider"      "1"
        "map"           "1"
        "player"        "1"
        "hero"          "1"
        "abilities"     "1"
        "items"         "1"
        "draft"         "1"
        "wearables"     "1"
    }
}
```

##  Usage

```typescript
import { GameStateServer, ObserverGameStateEvent, PlayerGameStateEvent, } from "fog-of-war"

const debug = true
const server = new GameStateServer("/gsi", debug)

server.onPlayerGameStateEvent((event: PlayerGameStateEvent) => {
  console.log('Received player game state');
  if (event.state.player) {
    console.log(event.state.player.gold);
  }
})

server.onObserverGameStateEvent((event: ObserverGameStateEvent) => {
  console.log('Received observer game state');
  if (event.state.player) {
    console.log(event.state.player[0].gold);
  }
})

server.listen(1337)
```
