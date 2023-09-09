export type Team = "dire" | "radiant"

export type GameStateEvent = "dota2-game-state" | "dota2-player-state" | "dota2-observer-state"

export type RadiantBuilding =
  | "dota_goodguys_tower1_top"
  | "dota_goodguys_tower2_top"
  | "dota_goodguys_tower3_top"
  | "dota_goodguys_tower1_mid"
  | "dota_goodguys_tower2_mid"
  | "dota_goodguys_tower3_mid"
  | "dota_goodguys_tower1_bot"
  | "dota_goodguys_tower2_bot"
  | "dota_goodguys_tower3_bot"
  | "dota_goodguys_tower4_top"
  | "dota_goodguys_tower4_bot"
  | "good_rax_melee_top"
  | "good_rax_range_top"
  | "good_rax_melee_mid"
  | "good_rax_range_mid"
  | "good_rax_melee_bot"
  | "good_rax_range_bot"
  | "dota_goodguys_fort"

export type DireBuilding =
  | "dota_badguys_tower1_top"
  | "dota_badguys_tower2_top"
  | "dota_badguys_tower3_top"
  | "dota_badguys_tower1_mid"
  | "dota_badguys_tower2_mid"
  | "dota_badguys_tower3_mid"
  | "dota_badguys_tower1_bot"
  | "dota_badguys_tower2_bot"
  | "dota_badguys_tower3_bot"
  | "dota_badguys_tower4_top"
  | "dota_badguys_tower4_bot"
  | "bad_rax_melee_top"
  | "bad_rax_range_top"
  | "bad_rax_melee_mid"
  | "bad_rax_range_mid"
  | "bad_rax_melee_bot"
  | "bad_rax_range_bot"
  | "dota_badguys_fort"

export type MapGameState =
  | "DOTA_GAMERULES_STATE_INIT"
  | "DOTA_GAMERULES_STATE_HERO_SELECTION"
  | "DOTA_GAMERULES_STATE_STRATEGY_TIME"
  | "DOTA_GAMERULES_STATE_TEAM_SHOWCASE"
  | "DOTA_GAMERULES_STATE_PRE_GAME"
  | "DOTA_GAMERULES_STATE_GAME_IN_PROGRESS"
  | "DOTA_GAMERULES_STATE_POST_GAME"

export interface PlayerGameStateEvent {
  state: PlayerGameState
  changes: PlayerGameState
}

export interface ObserverGameStateEvent {
  state: ObserverGameState
  changes: ObserverGameState
}

export interface BaseGameState {
  buildings: Buildings | null
  provider: Provider | null
}

export interface PlayerGameState extends BaseGameState {
  map: Map | null
  player: Player | null
  hero: Hero | null
  abilities: Ability[] | null
  items: ItemContainer | null
  wearables: WearableItem[] | null
  draft: Draft | null
}

export interface ObserverGameState extends BaseGameState {
  map: MapObserver | null
  player: PlayerObserver[] | null
  hero: Hero[] | null
  abilities: Ability[][] | null
  items: ItemContainer[] | null
  wearables: WearableItem[][] | null
  draft: Draft | null
}

export interface Buildings {
  radiant: Record<RadiantBuilding, Building>
  dire: Record<DireBuilding, Building>
}

export interface Building {
  health: number
  maxHealth: number
}

export interface Provider {
  name: string
  appid: number
  version: number
  timestamp: number
}

export interface Map {
  name: string
  matchId: number
  gameTime: number
  clockTime: number
  dayTime: boolean
  nightStalkerNight: boolean
  radiantScore: number
  direScore: number
  gameState: MapGameState
  paused: boolean
  winTeam: Team
  customGameName: string
}

export interface MapObserver extends Map {
  radiantWardPurchaseCooldown: number
  direWardPurchaseCooldown: number
  roshanState: string
  roshanStateEndSeconds: number
}

export interface Player {
  steamId: string
  accountId: string
  name: string
  activity: string
  kills: number
  deaths: number
  assists: number
  lastHits: number
  denies: number
  killStreak: number
  commandsIssued: number
  killList: KillList[]
  teamName: Team
  playerSlot: number
  teamSlot: number
  gold: number
  goldReliable: number
  goldUnreliable: number
  goldFromHeroKills: number
  goldFromCreepKills: number
  goldFromIncome: number
  goldFromShared: number
  gpm: number
  xpm: number
}

export interface PlayerObserver extends Player {
  netWorth: number
  heroDmg: number
  heroHealing: number
  towerDamage: number
  wardsPurchased: number
  wardsPlaced: number
  wardsDestroyed: number
  runesActivated: number
  campsStacked: number
  supportGoldSpent: number
  consumableGoldSpent: number
  itemGoldSpent: number
  goldLostToDeath: number
  goldSpentOnBuybacks: number
}

export interface KillList {
  victimSlot: number
  killCount: number
}

export interface Hero {
  xPos: number
  yPos: number
  id: number
  name: string
  level: number
  xp: number
  alive: boolean
  respawnSeconds: number
  buybackCost: number
  buybackCooldown: number
  health: number
  maxHealth: number
  healthPercent: number
  mana: number
  maxMana: number
  manaPercent: number
  silenced: boolean
  stunned: boolean
  disarmed: boolean
  magicImmune: boolean
  hexed: boolean
  muted: boolean
  break: boolean
  aghanimsScepter: boolean
  aghanimsShard: boolean
  smoked: boolean
  hasDebuff: boolean
  selectedUnit: boolean
  talents: boolean[] // Each talent in slot of array
  attributesLevel: number
}

export interface Ability {
  name: string
  level: number
  canCast: boolean
  passive: boolean
  abilityActive: boolean
  cooldown: number
  ultimate: boolean
}

export interface ItemContainer {
  slot: Array<Item | null>
  stash: Array<Item | null>
}

export interface Item {
  name: string
  purchaser: number
  itemLevel: number
  containsRune?: boolean
  canCast?: boolean
  cooldown?: number
  passive: boolean
  charges?: number
}

export interface Draft {
  activeTeam: number
  pick: boolean
  activeTeamTimeRemaining: number
  radiantBonusTime: number
  direBonusTime: number
  pickBans: PickBan[]
}

export interface PickBan {
  pick: { id: number; class: string } | null
  ban: { id: number; class: string } | null
}

export interface WearableItem {
  wearable: number
  style?: number
}
