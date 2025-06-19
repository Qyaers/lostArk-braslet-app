import { stoneStatsRegex } from "../regex/regex";
import type { StoneInfo } from "../types/type";

export function parseStone(jsonData:Document|string):StoneInfo[]{
    const data = JSON.stringify(jsonData)
    const stoneStats:StoneInfo[] = []
    for(const match of data.matchAll(stoneStatsRegex)){
        console.log(match);
        
        stoneStats.push({
            engrName: match[1],
            engrLvl: parseInt(match[2])
        });
    }
    return stoneStats;
}