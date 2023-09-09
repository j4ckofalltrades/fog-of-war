# Fog of War

A DotA 2 game state integration library written in TypeScript.

Tested on [7.34c](https://www.dota2.com/patches/7.34c).

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
import { GameStateServer, PlayerGameState, } from "fog-of-war"

const debug = true
const server = new GameStateServer("/gsi", debug)

server.onPlayingState((state: PlayerGameState) => {
  console.log('Received player game state');
  if (event.state.player) {
    console.log(event.state.player.gold);
  }
})

server.listen(1337)
```
