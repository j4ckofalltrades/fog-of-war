import { EventEmitter } from "events"
import * as http from "http"
import {
  Buildings,
  GameStateEvent,
  Hero,
  ItemContainer,
  ObserverGameStateEvent,
  Player,
  PlayerGameStateEvent,
  Provider,
  WearableItem,
} from "./types"
import {
  checkKey,
  parseAbilities,
  parseBuildings,
  parseDraft,
  parseHero,
  parseItems,
  parseMap,
  parsePlayer,
  parseWearable,
} from "./parser"

function* observerStateGenerator(teamPlayerObj: unknown) {
  for (const [, rawPlayers] of Object.entries(teamPlayerObj as object)) {
    for (const [playerCode, rawObj] of Object.entries(rawPlayers as object)) {
      const slot = Number(playerCode.split("player").slice(-1))
      // Check slot before yield
      yield [slot, rawObj]
    }
  }
}

/**
 * Handles game state events from the DotA 2 game client and exposes functions to listen to specific in-game events.
 * The game client reports either player or observer events depending on if the current user is playing or observing
 * a game. The player game state event payload will be a subset of the observable game state, mostly including global
 * map and current play state.
 */
export class GameStateServer {
  public events: EventEmitter
  public server: http.Server

  private readonly debug: boolean
  private readonly url: string

  /**
   * Game state server constructor.
   *
   * @param url (Optional) Path where game state event data from the client is received, defaults to "/".
   * @param debug (Optional) Whether to log more information, defaults to `false`.
   */
  constructor(url: string = "/", debug = false) {
    if (!url.startsWith("/")) {
      throw Error(`Invalid serve url '${url}'! Must be starting from '/'.`)
    }
    this.debug = debug
    this.events = new EventEmitter()
    this.url = url
    this.server = http.createServer((req, res) => this.handleRequest(req, res))
  }

  /**
   * Starts the game state integration server on the specified host and port. This should match the game state
   * integration configuration in the DotA 2 game client.
   *
   * @param port (Optional) Port number, defaults to 9001.
   * @param host (Optional) Host name, defaults to "127.0.0.1".
   */
  public listen(port: number = 9001, host: string = "127.0.0.1") {
    if (this.debug) {
      console.log(`Starting serving at http://${host}:${port}${this.url}`)
    }
    this.server.listen(port, host)
  }

  public close() {
    this.server.close()
  }

  /**
   * Register a handler for {@link PlayerGameStateEvent}.
   *
   * @param listener Listener function that processes {@link PlayerGameStateEvent} data.
   */
  public onPlayerGameStateEvent(listener: (event: PlayerGameStateEvent) => void) {
    this.events.on("dota2-player-state", listener)
  }

  /**
   * Register a handler for {@link ObserverGameStateEvent}.
   *
   * @param listener Listener function that processes {@link ObserverGameStateEvent} data.
   */
  public onObserverGameStateEvent(listener: (event: ObserverGameStateEvent) => void) {
    this.events.on("dota2-observer-state", listener)
  }

  private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    res.setHeader("Content-Type", "text/html")
    if (req.url === this.url) {
      switch (req.method) {
        case "HEAD": {
          res.writeHead(200)
          break
        }
        case "POST": {
          const [code, body] = await this.parseRequest(req)
          res.writeHead(code)
          res.write(body)
          break
        }
        default: {
          // Method not allowed
          res.writeHead(405)
          break
        }
      }
    } else {
      res.writeHead(404)
    }
    res.end("\n")
    if (this.debug) {
      console.log("[%s] %s %s %s", new Date(), req.method, req.url, res.statusCode)
    }
  }

  private async parseRequest(req: http.IncomingMessage): Promise<[number, string]> {
    const chunks = []
    for await (const chunk of req) {
      chunks.push(chunk)
    }
    const content = chunks.join()
    try {
      const rawState = JSON.parse(content)
      this.events.emit("dota2-game-state", rawState)
      this.feedState(rawState)
      return [200, ""]
    } catch (e) {
      if (this.debug) {
        console.trace(e)
      }
      return [500, `Invalid JSON in request body: '${e}'.\n`]
    }
  }

  private isObserverMode(rawState: any): boolean {
    return rawState["player"] !== undefined && rawState["player"]["team2"] !== undefined
  }

  private emitGameStateEvent(dota2Event: GameStateEvent, args: any): boolean {
    return this.events.emit(dota2Event, args)
  }

  private feedState(rawState: any): void {
    const observerMode = this.isObserverMode(rawState)
    const state = this.parseState(rawState, observerMode)
    const { previously } = rawState
    const changes = this.parseState(previously, observerMode)

    if (observerMode) {
      this.emitGameStateEvent("dota2-observer-state", { state, changes })
    } else {
      this.emitGameStateEvent("dota2-player-state", { state, changes })
    }
  }

  private parseState(rawState: any, observerMode: boolean) {
    let buildings = null
    if (checkKey(rawState, "buildings")) {
      const direBuildings = rawState["buildings"]["dire"]
      const radiantBuildings = rawState["buildings"]["radiant"]
      buildings = {
        ["dire"]: direBuildings !== undefined ? parseBuildings(direBuildings) : null,
        ["radiant"]: radiantBuildings !== undefined ? parseBuildings(radiantBuildings) : null,
      } as Buildings
    }

    let provider = null
    if (checkKey(rawState, "provider")) {
      provider = rawState["provider"] as Provider
    }

    let map = null
    if (checkKey(rawState, "map")) {
      map = parseMap(rawState["map"], observerMode)
    }

    let player = null
    if (checkKey(rawState, "player")) {
      const rawPlayerSection = rawState["player"]

      if (observerMode) {
        player = Array<Player>(10)
        for (const [slot, rawPlayer] of observerStateGenerator(rawPlayerSection)) {
          player[slot] = parsePlayer(rawPlayer, observerMode)
        }
      } else {
        player = parsePlayer(rawPlayerSection, observerMode)
      }
    }

    let hero = null
    if (checkKey(rawState, "hero")) {
      const rawHeroSection = rawState["hero"]
      if (observerMode) {
        hero = Array<Hero>(10)
        for (const [slot, rawHero] of observerStateGenerator(rawHeroSection)) {
          hero[slot] = parseHero(rawHero)
        }
      } else {
        hero = parseHero(rawHeroSection)
      }
    }

    let abilities = null
    if (checkKey(rawState, "abilities")) {
      const rawAbilitiesSection = rawState["abilities"]
      if (observerMode) {
        abilities = Array<any>(10)
        for (const [slot, rawAbilities] of observerStateGenerator(rawAbilitiesSection)) {
          abilities[slot] = parseAbilities(rawAbilities)
        }
      } else {
        abilities = parseAbilities(rawAbilitiesSection)
      }
    }

    let items = null
    if (checkKey(rawState, "items")) {
      const rawItemsSection = rawState["items"]
      if (observerMode) {
        items = Array<ItemContainer>(10)
        for (const [slot, rawItems] of observerStateGenerator(rawItemsSection)) {
          items[slot] = parseItems(rawItems)
        }
      } else {
        items = parseItems(rawItemsSection)
      }
    }

    let draft = null
    if (checkKey(rawState, "draft")) {
      draft = parseDraft(rawState["draft"])
    }

    let wearables = null
    if (checkKey(rawState, "wearables")) {
      const rawWearableSection = rawState["wearables"]
      if (observerMode) {
        wearables = Array<WearableItem[]>(10)
        for (const [slot, rawWearable] of observerStateGenerator(rawWearableSection)) {
          wearables[slot] = parseWearable(rawWearable)
        }
      } else {
        wearables = parseWearable(rawWearableSection)
      }
    }

    return {
      buildings,
      provider,
      map,
      player,
      hero,
      abilities,
      items,
      draft,
      wearables,
    }
  }
}
