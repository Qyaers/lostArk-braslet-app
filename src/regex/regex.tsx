export const tripodRegex = /selectedTripodTier&quot;:\[(\d+),(\d+),(\d+)\]/g;
export const skillNameRegex = /<span class=\\"profile-skill__title\\">([^<]+)<\/span>\\r/g;
export const runesNameRegex = /\{&quot;type&quot;:&quot;NameTagBox&quot;.*?COLOR=&#39;(#[0-9A-F]{6})&#39;.*?&gt;(?:Руна\s)?([А-Яа-яЁё\w\s'&;,#-]+?)(?:&lt;|<\/FONT|$)/gi;

export const gemSkillRegex = /<span\s+class=\\"slot\\"[^>]*data-gemkey=\\"(gem\d{2})\\"[^>]*>[\s\S]*?<strong\s+class=\\"skill_tit\\">([^<]+)<\/strong>/g;
export const gemLevelRegex = /<span\s+id=\\"(gem\d{2})\\"[^>]*>[\s\S]*?<span\s+class=\\"jewel_level\\">Ур\.\s*(\d+)/g;
export const gemEffectRegex = /<FONT\s+COLOR='#[0-9A-Fa-f]{6}'>([^<]+)<\/FONT>:\s*(урон повышается|время восстановления сокращается|эффект поддержки повышается)\s*на\s*(\d+\.\d+)%<\/p>|<p\s+class=\\"add_effect\\">[^<]*<BR>([^<]+)\s*на\s*(\d+\.\d+)%<\/p>/g;

export const engravingRegex = /<span><font color='(#[0-9A-Fa-f]{6})'>([А-Яа-яЁё\w\s'&;,#-]+?)<\/font>.+?x <FONT COLOR='#[0-9A-Fa-f]{6}'>(\d{0,4})<\/FONT><\/span>\\r\\n/g;

export const skinsStatsRegex = /(Ловкость|Сила|Интеллект) \+(\d{1,2})\.00%/gi;

export const stoneStatsRegex = /<span><font color='#[0-9A-Fa-f]{6}'>([А-Яа-яЁё\w\s'&;,#-]+?)<\/font>\s*<em class='emoticon_ability_stone_blue'.*?<\/em>\s*<FONT COLOR='#[0-9A-Fa-f]{6}'>(\d)<\/FONT>/gmi;