export type SkillsInfo  = Array<string>;
export type TripodInfo = number[][];


export interface RuneColorMap {
[hex: string]: string;
}
export interface RuneInfo {
    color: string;
    rune: string;
}
export interface JewelInfo {
    skillName: string;
    gemsLvl: [number, number];  // [damageLevel, cooldownLevel]
    levelsStats: [number, number, number];  // [damageValue, cooldownValue]
}