import { skinsStatsRegex } from "../regex/regex"
import type { SkinsInfo, SkinsSlotsNames, SkinSlot } from "../types/type";

const skinsSlots: SkinsSlotsNames = {
    slot1: "Weapon",
    slot3: "Helmet",
    slot6: "Body armor",
    slot7: "Armory Pents"
};

export function parseSkinsStats(jsonData:Document|string): SkinsInfo[]{
    jsonData = String(jsonData);
    const slotsWithSkins: SkinSlot[] = [...new DOMParser()
    .parseFromString(jsonData, 'text/html')!
    .querySelector('div[class^="profile-avatar__slot"]')!
    .querySelectorAll('div[class="slot1"], div[class="slot3"], div[class="slot6"], div[class="slot7"]')]
    .map((slot: Element) => ({
        slot: skinsSlots[slot.className as keyof SkinsSlotsNames] as string,
        img: slot.querySelector('img')!.src
    }));

    const skinsInfo:SkinsInfo[] = [];
    let counter = 0;

    for(const match of jsonData.matchAll(skinsStatsRegex)){
        if(counter==4) break;
        skinsInfo.push({
            skinPosition: slotsWithSkins[counter].slot,
            skinGrade: parseInt(match[2])==1?"Эпический":"Легендарный",
            skinStatName: match[1],
            skinStatValue: parseInt(match[2]),
        });
        counter++;
    }
    if(skinsInfo.length == 3)
        skinsInfo[2].skinGrade = "Эпический";
    return skinsInfo;
}