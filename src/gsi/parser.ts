import {
  Ability,
  Building,
  Draft,
  Hero,
  Item,
  ItemContainer,
  KillList,
  Map,
  MapObserver,
  PickBan,
  Player,
  PlayerObserver,
  WearableItem,
} from "./types"

const getAttr = (obj: any, attr: string, def: any = null) => (obj[attr] === undefined ? def : obj[attr])

export const checkKey = (rawObject: any, key: string) =>
  rawObject && key in rawObject && Object.keys(rawObject[key]).length !== 0

export const parseBuildings = (rawBuildings: any) => {
  const building: Record<string, Building> = {}
  for (const [buildingName, buildingValue] of Object.entries(rawBuildings)) {
    building[buildingName] = {
      health: (buildingValue as any).health,
      maxHealth: (buildingValue as any).max_health,
    } as Building
  }
  return building
}

export const parsePlayer = (rawPlayer: any, observerMode: boolean): Player | PlayerObserver => {
  const player: Player = {
    steamId: getAttr(rawPlayer, "steamid"),
    accountId: getAttr(rawPlayer, "accountid"),
    name: getAttr(rawPlayer, "name"),
    activity: getAttr(rawPlayer, "activity"),
    kills: getAttr(rawPlayer, "kills"),
    deaths: getAttr(rawPlayer, "deaths"),
    assists: getAttr(rawPlayer, "assists"),
    lastHits: getAttr(rawPlayer, "last_hits"),
    denies: getAttr(rawPlayer, "denies"),
    killStreak: getAttr(rawPlayer, "kill_streak"),
    commandsIssued: getAttr(rawPlayer, "commands_issued"),
    killList: Object.entries(getAttr(rawPlayer, "kill_list", [])).map((killObj) => {
      const [victimId, killCount] = killObj
      const victimSlot = Number(victimId.split("_").slice(-1))
      return {
        killCount,
        victimSlot,
      } as KillList
    }),
    teamName: getAttr(rawPlayer, "team_name"),
    playerSlot: getAttr(rawPlayer, "player_slot"),
    teamSlot: getAttr(rawPlayer, "team_slot"),
    gold: getAttr(rawPlayer, "gold"),
    goldReliable: getAttr(rawPlayer, "gold_reliable"),
    goldUnreliable: getAttr(rawPlayer, "gold_unreliable"),
    goldFromHeroKills: getAttr(rawPlayer, "gold_from_hero_kills"),
    goldFromCreepKills: getAttr(rawPlayer, "gold_from_creep_kills"),
    goldFromIncome: getAttr(rawPlayer, "gold_from_income"),
    goldFromShared: getAttr(rawPlayer, "gold_from_shared"),
    gpm: getAttr(rawPlayer, "gpm"),
    xpm: getAttr(rawPlayer, "xpm"),
  }
  if (observerMode) {
    return {
      ...player,
      netWorth: getAttr(rawPlayer, "net_worth"),
      heroDmg: getAttr(rawPlayer, "hero_damage"),
      heroHealing: getAttr(rawPlayer, "hero_healing"),
      towerDamage: getAttr(rawPlayer, "tower_damage"),
      wardsPurchased: getAttr(rawPlayer, "wards_purchased"),
      wardsPlaced: getAttr(rawPlayer, "wards_placed"),
      wardsDestroyed: getAttr(rawPlayer, "wards_destroyed"),
      runesActivated: getAttr(rawPlayer, "runes_activated"),
      campsStacked: getAttr(rawPlayer, "camps_stacked"),
      supportGoldSpent: getAttr(rawPlayer, "support_gold_spent"),
      consumableGoldSpent: getAttr(rawPlayer, "consumable_gold_spent"),
      itemGoldSpent: getAttr(rawPlayer, "item_gold_spent"),
      goldLostToDeath: getAttr(rawPlayer, "gold_lost_to_death"),
      goldSpentOnBuybacks: getAttr(rawPlayer, "gold_spent_on_buybacks"),
    } as PlayerObserver
  } else {
    return player as Player
  }
}

export const parseHero = (rawHero: any): Hero => {
  const hero: Hero = {
    xPos: getAttr(rawHero, "xpos"),
    yPos: getAttr(rawHero, "ypos"),
    id: getAttr(rawHero, "id"),
    name: getAttr(rawHero, "name"),
    level: getAttr(rawHero, "level"),
    xp: getAttr(rawHero, "xp"),
    alive: getAttr(rawHero, "alive"),
    respawnSeconds: getAttr(rawHero, "respawn_seconds"),
    buybackCost: getAttr(rawHero, "buyback_cost"),
    buybackCooldown: getAttr(rawHero, "buyback_cooldown"),
    health: getAttr(rawHero, "health"),
    maxHealth: getAttr(rawHero, "max_health"),
    healthPercent: getAttr(rawHero, "health_percent"),
    mana: getAttr(rawHero, "mana"),
    maxMana: getAttr(rawHero, "max_mana"),
    manaPercent: getAttr(rawHero, "mana_percent"),
    silenced: getAttr(rawHero, "silenced"),
    stunned: getAttr(rawHero, "stunned"),
    disarmed: getAttr(rawHero, "disarmed"),
    magicImmune: getAttr(rawHero, "magicimmune"),
    hexed: getAttr(rawHero, "hexed"),
    muted: getAttr(rawHero, "muted"),
    break: getAttr(rawHero, "break"),
    aghanimsScepter: getAttr(rawHero, "aghanims_scepter"),
    aghanimsShard: getAttr(rawHero, "aghanims_shard"),
    smoked: getAttr(rawHero, "smoked"),
    hasDebuff: getAttr(rawHero, "has_debuff"),
    selectedUnit: getAttr(rawHero, "selected_unit"),
    talents: [],
    attributesLevel: getAttr(rawHero, "attributes_level"),
  }
  Object.keys(rawHero)
    .filter((prop) => prop.startsWith("talent_"))
    .forEach((talentName) => {
      const talentSlot = Number(talentName.split("_").slice(-1)) - 1
      hero.talents[talentSlot] = rawHero[talentName]
    })
  return hero
}

export const parseMap = (rawMap: any, observerMode: boolean): Map | MapObserver => {
  const map: Map = {
    name: getAttr(rawMap, "name"),
    matchId: getAttr(rawMap, "matchid"),
    gameTime: getAttr(rawMap, "game_time"),
    clockTime: getAttr(rawMap, "clock_time"),
    dayTime: getAttr(rawMap, "daytime"),
    nightStalkerNight: getAttr(rawMap, "nightstalker_night"),
    radiantScore: getAttr(rawMap, "radiant_score"),
    direScore: getAttr(rawMap, "dire_score"),
    gameState: getAttr(rawMap, "game_state"),
    paused: getAttr(rawMap, "paused"),
    winTeam: getAttr(rawMap, "win_team"),
    customGameName: getAttr(rawMap, "customgamename"),
  }
  if (observerMode) {
    return {
      ...map,
      radiantWardPurchaseCooldown: getAttr(rawMap, "radiant_ward_purchase_cooldown"),
      direWardPurchaseCooldown: getAttr(rawMap, "dire_ward_purchase_cooldown"),
      roshanState: getAttr(rawMap, "roshan_state"),
      roshanStateEndSeconds: getAttr(rawMap, "roshan_state_end_seconds"),
    } as MapObserver
  } else {
    return map as Map
  }
}

export const parseAbilities = (rawAbilities: any): Ability[] => {
  const abilities = Array<Ability>()
  for (const [abilityCode, rawAbilityUncasted] of Object.entries(rawAbilities)) {
    const abilitySlot = Number(abilityCode.slice(-1))
    const rawAbility = rawAbilityUncasted as any
    abilities[abilitySlot] = {
      name: getAttr(rawAbility, "name"),
      level: getAttr(rawAbility, "level"),
      canCast: getAttr(rawAbility, "can_cast"),
      passive: getAttr(rawAbility, "passive"),
      abilityActive: getAttr(rawAbility, "ability_active"),
      cooldown: getAttr(rawAbility, "cooldown"),
      ultimate: getAttr(rawAbility, "ultimate"),
    } as Ability
  }
  return abilities
}

export const parseItem = (rawItem: any): Item | null => {
  if (rawItem["name"] === "empty") {
    return null
  } else {
    const item: Item = {
      name: rawItem["name"],
      purchaser: rawItem["purchaser"],
      passive: rawItem["passive"],
      itemLevel: rawItem["item_level"],
    }
    const itemProps = ["can_cast", "cooldown", "charges"]
    itemProps.forEach((prop) => {
      if (prop in rawItem) {
        ;(item as any)[prop] = rawItem[prop]
      }
    })
    return item
  }
}

export const parseItems = (rawItems: any): ItemContainer => {
  const items: ItemContainer = {
    slot: Array<Item>(),
    stash: Array<Item>(),
  }
  for (const [itemCode, rawItem] of Object.entries(rawItems)) {
    const itemSlot = Number(itemCode.split(/slot|stash/).slice(-1))
    if (itemCode.startsWith("slot")) {
      items.slot[itemSlot] = parseItem(rawItem)
    } else if (itemCode.startsWith("stash")) {
      items.stash[itemSlot] = parseItem(rawItem)
    }
  }
  return items
}

export const parseDraft = (rawDraft: any): Draft => {
  const picksPre = Array<any>(10)
  const teams = ["team2", "team3"]
  teams.forEach((team) => {
    if (team in rawDraft) {
      for (const [propName, propValue] of Object.entries(rawDraft[team])) {
        const propMatch = propName.match(/(pick|ban)([0-9])_(id|class)/)
        // Very bad code, actually.
        if (propMatch !== null) {
          const [, pickType, rawSlot, valueType] = propMatch
          const slot = team === "team2" ? Number(rawSlot) : Number(rawSlot) + 5
          if (picksPre[slot] === undefined) {
            picksPre[slot] = {
              [pickType]: {},
            }
          } else if (picksPre[slot][pickType] === undefined) {
            picksPre[slot][pickType] = {}
          }
          picksPre[Number(slot)][pickType][valueType] = propValue
        }
      }
    }
  })
  return {
    activeTeam: getAttr(rawDraft, "activeteam"),
    pick: getAttr(rawDraft, "pick"),
    activeTeamTimeRemaining: getAttr(rawDraft, "activeteam_time_remaining"),
    radiantBonusTime: getAttr(rawDraft, "radiant_bonus_time"),
    direBonusTime: getAttr(rawDraft, "dire_bonus_time"),
    pickBans: picksPre as PickBan[],
  } as Draft
}

export const parseWearable = (rawWearable: any): WearableItem[] => {
  const wearables = []
  const styles: any[] = []
  for (const [wearableName, wearableValue] of Object.entries(rawWearable)) {
    const wearableMatch = wearableName.match(/(wearable|style)([0-9]*)/)
    if (wearableMatch !== null) {
      const [, wearableType, wearableSlot] = wearableMatch
      const slot = Number(wearableSlot)
      if (wearableType === "wearable") {
        wearables[slot] = wearableValue
      } else {
        styles[slot] = wearableValue
      }
    }
  }
  const iWearableList = Array<WearableItem>()
  wearables.forEach((wearable, index) => {
    const item = {
      wearable,
    } as WearableItem
    if (styles[index] !== undefined) {
      item.style = styles[index]
    }
    iWearableList.push(item)
  })
  return iWearableList as WearableItem[]
}
