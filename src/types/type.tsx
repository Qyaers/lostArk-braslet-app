export type SkillsInfo  = Array<string>;
export type TripodInfo = number[][];

export interface ColorMap {
[hex: string]: string
}

export interface RuneInfo {
    color: string,
    rune: string,
}

export interface JewelInfo {
    skillName: string,
    gemsLvl: [number, number],  // [damageLevel, cooldownLevel]
    levelsStats: [number, number, number],  // [damageValue, cooldownValue,supEffect]
}

export interface EngrInfo {
    engrName: string,
    engrColor: string,
    engrLvl: number,
}

export interface SkinsInfo {
    skinPosition: string,
    skinGrade: string,
    skinStatName: string,
    skinStatValue: number,
}

export interface SkinsSlotsNames {
    slot1: string
    slot3: string
    slot6: string
    slot7: string
}

export interface SkinSlot {
    slot: string;
    img: string | undefined;
}

export interface StoneInfo {
    engrName: string,
    engrLvl: number
}