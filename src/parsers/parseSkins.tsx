import {} from "../regex/regex"
import type {} from "../types/type"

//TODO Make parser for skins stats that grands us % of base stat of character.

// Skins
// can find them by substring \"Element_001\": \"Ловкость +2.00% where besidce "Ловкость" can be one of [Ловкость,Сила, Интелект].

export function parseSkinsStats(jsonData:object): number{
    const data = JSON.stringify(jsonData);
    
    //TODO complete parser with logic -> first 3/4 data if second match have 2% and his color is purple then body have 2% 3rd skips(become 0) and 4 is equal 3(we taking % from 3rd match)
    // colors pick up frop tag fontcolor and color schem 

    return 0;
}