export type Team = "dire" | "radiant"

export type GameStateEvent = "dota2-game-state" | "dota2-player-state" | "dota2-observer-state"

/**
 * Supported ids for Radiant buildings e.g. towers, barracks, and ancient.
 */
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

/**
 * Supported ids for Dire buildings e.g. towers, barracks, and ancient.
 */
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

/**
 * Known game states e.g. in progress or game has ended.
 */
export type MapGameState =
  | "DOTA_GAMERULES_STATE_INIT"
  | "DOTA_GAMERULES_STATE_HERO_SELECTION"
  | "DOTA_GAMERULES_STATE_STRATEGY_TIME"
  | "DOTA_GAMERULES_STATE_TEAM_SHOWCASE"
  | "DOTA_GAMERULES_STATE_PRE_GAME"
  | "DOTA_GAMERULES_STATE_GAME_IN_PROGRESS"
  | "DOTA_GAMERULES_STATE_POST_GAME"

/**
 * Player game state reported by the game client.
 *
 * @property state Current player game state.
 * @property changes Changes from the previous known player game state.
 */
export interface PlayerGameStateEvent {
  state: PlayerGameState
  changes: PlayerGameState
}

/**
 * Observer game state reported by the game client.
 *
 * @property state Observer game state.
 * @property changes Changes from the previous known observer game state.
 */
export interface ObserverGameStateEvent {
  state: ObserverGameState
  changes: ObserverGameState
}

/**
 * Base game state available for both player and observers.
 *
 * @property buildings Building game state.
 * @property provider Game state integration provider information.
 */
export interface BaseGameState {
  buildings: Buildings | null
  provider: Provider | null
}

/**
 * Player game state.
 *
 * @property map Map game state for the current player.
 * @property player Player game state for the current player.
 * @property hero Hero game state for the current player.
 * @property abilities Hero abilities for the current player.
 * @property items Items for the current player.
 * @property wearables Cosmetics for the current player.
 * @property draft Draft state (this will be null).
 */
export interface PlayerGameState extends BaseGameState {
  map: Map | null
  player: Player | null
  hero: Hero | null
  abilities: Ability[] | null
  items: ItemContainer | null
  wearables: WearableItem[] | null
  draft: Draft | null
}

/**
 * Observer game state.
 *
 * @property map Map game state.
 * @property player Player game state.
 * @property hero Hero game state.
 * @property abilities Hero abilities game state.
 * @property items Items game state.
 * @property wearables Cosmetics for all the players.
 * @property draft Draft state.
 */
export interface ObserverGameState extends BaseGameState {
  map: MapObserver | null
  player: PlayerObserver[] | null
  hero: Hero[] | null
  abilities: Ability[][] | null
  items: ItemContainer[] | null
  wearables: WearableItem[][] | null
  draft: Draft | null
}

/**
 * Building HP data for Radiant and Dire teams.
 *
 * @property radiant Mapping of building HP data for the Radiant team.
 * @property dire Mapping of building HP data for the Dire team.
 */
export interface Buildings {
  radiant: Record<RadiantBuilding, Building>
  dire: Record<DireBuilding, Building>
}

export interface Building {
  health: number
  maxHealth: number
}

/**
 * Game state integration provider.
 *
 * @property name Game name (DotA 2).
 * @property appid DotA 2 Steam app id (570).
 * @property version DotA 2 version.
 * @property timestamp Current time in seconds.
 */
export interface Provider {
  name: string
  appid: number
  version: number
  timestamp: number
}

/**
 * DotA 2 map state for the current game.
 *
 * @property name Current map state.
 * @property matchId Current DotA 2 match id.
 * @property gameTime Current timestamp.
 * @property clockTime Current game time.
 * @property dayTime If it is day time.
 * @property nightStalkerNight If NightStalker ultimate is currently active.
 * @property radiantScore Total number of kills for the Radiant team.
 * @property direScore Total number of kills for the Dire team.
 * @property gameState Current game state, see {@link MapGameState} for possible values.
 * @property paused If the current game is paused.
 * @property winTeam Radiant or Dire if the game is over, "none" if the game is still in progress.
 * @property customGameName Custom game name.
 */
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
  winTeam: Team | "none"
  customGameName: string
}

/**
 * Map game state only available for observers.
 *
 * @property radiantWardPurchaseCooldown When observer and sentry wards replenish for the Radiant team.
 * @property direWardPurchaseCooldown When observer and sentry wards replenish for the Dire team.
 * @property roshanState If Roshan is alive or not.
 * @property roshanStateEndSeconds When the current Roshan state will end.
 */
export interface MapObserver extends Map {
  radiantWardPurchaseCooldown: number
  direWardPurchaseCooldown: number
  roshanState: string
  roshanStateEndSeconds: number
}

/**
 * Player game state.
 *
 * @property steamId Steam account ID.
 * @property accountId DotA 2 account ID.
 * @property name Player name.
 * @property activity Current activity state.
 * @property kills Number of player kills.
 * @property deaths Number of player deaths.
 * @property killStreak Current number of consecutive player kills.
 * @property commandsIssued Number of player commands issued in-game.
 * @property killList Mapping of times an opposing player has been killed.
 * @property teamName Which team the player is on.
 * @property playerSlot Which player slot the player belongs to (0-4 for Radiant), (5-9 for Dire).
 * @property teamSlot Which team the player belongs to.
 * @property gold Total gold.
 * @property goldReliable Reliable gold.
 * @property goldUnreliable Unreliable gold.
 * @property goldFromHeroKills Gold earned from hero kills.
 * @property goldFromCreepKills Gold earned from creep kills.
 * @property goldFromIncome Gold from income (hero and creep kills).
 * @property goldFromShared Gold from shared sources e.g. tower, kill assists, etc.
 * @property gpm Gold earned per minute.
 * @property xpm XP per minute.
 */
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

/**
 * Player state only available to observers.
 *
 * @property netWorth Current net worth.
 * @property heroDmg Total hero damage dealt.
 * @property heroHealing Total hero healing.
 * @property towerDamage Total tower damage dealt.
 * @property wardsPurchased Total observer and sentry wards purchased.
 * @property wardsDestroyed Total observer and sentry wards destroyed.
 * @property runesActivated Total runes picked up and activated.
 * @property campsStacked Total creep camps stacked.
 * @property supportGoldSpent Total gold spent on support items e.g. wards, smokes etc.
 * @property consumableGoldSpent Total gold spent on consumables e.g. tangos, clarity potions, etc.
 * @property itemGoldSpent Total gold spent on items.
 * @property goldLostToDeath Total gold lost on deaths.
 * @property goldSpentOnBuybacks Total gold spent on buybacks.
 */
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

/**
 * Hero game state.
 *
 * @property xPos Current x position on the map.
 * @property yPos Current x position on the map.
 * @property id Hero id.
 * @property name Hero name.
 * @property xp Current xp.
 * @property alive If the hero is currently alive.
 * @property respawnSeconds Number of seconds before the hero respawns, 0 if the hero is alive.
 * @property buybackCost Total gold needed for buyback.
 * @property buybackCooldown Number of seconds before buyback is enabled again.
 * @property health Current health.
 * @property maxHealth Max health.
 * @property healthPercent Percentage of current health against max health.
 * @property mana Current mana.
 * @property maxMana Max mana.
 * @property manaPercent Percentage of current mana against max mana.
 * @property silenced If the hero is silenced.
 * @property stunned If the hero is stunned.
 * @property disarmed If the hero is disarmed.
 * @property magicImmune If the hero is magicImmune.
 * @property hexed If the hero is hexed.
 * @property muted If the hero is muted.
 * @property break If the hero has break applied.
 * @property aghanimsScepter If the hero has the Aghnanims scepter upgrade.
 * @property aghanimsShard If the hero has the Aghnanims shard upgrade.
 * @property smoked If the hero is smoked.
 * @property hasDebuff If the hero has a debuff applied.
 * @property selectedUnit If the hero is selected is not.
 * @property talents Talent tree expressed as an array.
 * @property attributesLevel How many times attribute upgrade has been applied.
 */
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

/**
 * Hero ability.
 *
 * @property name Ability name.
 * @property level Ability level.
 * @property canCast If the ability can be cast.
 * @property passive If the ability is passive.
 * @property abilityActive If the ability is active.
 * @property cooldown Number of the seconds before the ability can be used again.
 * @property ultimate If the ability is the hero's ultimate.
 */
export interface Ability {
  name: string
  level: number
  canCast: boolean
  passive: boolean
  abilityActive: boolean
  cooldown: number
  ultimate: boolean
}

/**
 * Items state.
 *
 * @property slot Items in the player's inventory.
 * @property stash Items in the player's stash.
 */
export interface ItemContainer {
  slot: Array<Item | null>
  stash: Array<Item | null>
}

/**
 * Item state.
 *
 * @property name Item name.
 * @property purchaser Player who purchased the item.
 * @property itemLevel item level.
 * @property containsRune (Optional) Only relevant for empty bottle.
 * @property canCast (Optional) Only relevant for items with an 'active' effect, also affected by cooldown or if the
 *           current hero is muted.
 * @property cooldown (Optional) Only relevant for items with an 'active' effect.
 * @property passive If the item does not have an 'active' effect.
 * @property charges (Optional) If the item has a set number of charges (may replenish or not).
 */
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

/**
 * Draft state.
 *
 * @property activeTeam The team whose turn it is to pick or ban a hero.
 * @property pick If the action for the current phase is to pick a hero.
 * @property activeTeamTimeRemaining Number of seconds the current team has to pick or ban a hero.
 * @property radiantBonusTime Total number of (bonus) seconds for Radiant to pick or ban a hero.
 * @property dire Total number of (bonus) seconds for Dire to pick or ban a hero.
 * @property pickBans Mapping of hero id and names for picks and bans.
 */
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

/**
 * Wearable state.
 *
 * @property wearable ID of in-game cosmetic.
 * @property style (Optional) If the cosmetic has an alternative style.
 */
export interface WearableItem {
  wearable: number
  style?: number
}
