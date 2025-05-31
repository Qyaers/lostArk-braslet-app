import { useState, type ChangeEvent } from 'react';
import { fetchData } from './Api';

function App() {
  const tripodRegex = /selectedTripodTier&quot;:\[(\d+),(\d+),(\d+)\]/g;
  const skillNameRegex = /<span class=\\"profile-skill__title\\">([^<]+)<\/span>\\r/g;
  const runesNameRegex = /\{&quot;type&quot;:&quot;NameTagBox&quot;.*?COLOR=&#39;(#[0-9A-F]{6})&#39;.*?&gt;(?:Руна\s)?([А-Яа-яЁё\w\s'&;,#-]+?)(?:&lt;|<\/FONT|$)/gi;


  const [isLoading, setIsLoading] = useState(false);
  const [text,setText] = useState("");
  
  const [data,setData] = useState(null);

  const [tripods,setTripods] = useState(null);
  const [skills,setSkills] = useState(null);
  const [runes,setRunes] = useState(null);

  function handlerInputText(e:ChangeEvent<HTMLInputElement>):void{
    setText(e.target.value);
  }
  // TODO добавить то что ниже в коменте как допишу парсер вынести логику в отдельный компонент. Либо придумать как разбить это все на модули, чтобы вся логика не хранилась в одном файле.
  // TODO вытащить ещё несколько параметров из данных: Транса + Камни + Арк 123 + Гравы + Бижа(все + брас) + Внешки + Высшая закалка

  async function handlerClick(){
    setIsLoading(true);
    try {
      const newData = await getData();
      if(newData){
        getSkillsTripod(newData);
        getSkillsName(newData);
        getRunes(newData)
      }
    } finally {
      setIsLoading(false);
    }
  }

  function getData(){
    if(text.length>=2){
      const response = fetchData(text);
      setData(response);
      return response;
    }
    return null;
  }

  function getSkillsTripod(jsonData:object){
    const text = JSON.stringify(jsonData);
    const tripods = [];
    let match;

    while ((match = tripodRegex.exec(text)) !== null && tripods.length < 8) {
      const numbers = [
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10)
      ];
      tripods.push(numbers);
    }
    setTripods(tripods);
  }

  function getSkillsName(jsonData:object) {
    const text = JSON.stringify(jsonData);
    const skills:string[] = [];
    let match;
    
    while ((match = skillNameRegex.exec(text)) !== null && skills.length < 8) {
      const skillName = match[1].trim();
      skills.push(skillName);
    }

    setSkills(skills);
  }
// TODO вынести типы отдельно в файл и подключить его
  interface RuneColorMap {
    [hex: string]: string;
  }
  interface RuneInfo {
      color: string;
      rune: string;
  }

  function getRunes(jsonData: object): void {
    const text = JSON.stringify(jsonData);

    const runeColorMap: RuneColorMap = {
      '#F99200': 'Легендарный',
      '#CE43FC': 'Эпический',
      '#00B0FA': 'Редкий',
      '#8DF901': 'Необычный',
    };

    const matchesIterator = text.matchAll(runesNameRegex);
    const results: RuneInfo[] = [];
    // Создаем итератор и берем только первые 8 элементов
    
    for (let i = 0; i < 8; i++) {
      const match = matchesIterator.next();
      if (match.done) break;
      const rawRuneName = match.value[2];
      const decodedRuneName = rawRuneName
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/^Руна\s/, '')
          .trim();
      results.push({
          color: runeColorMap[match.value[1].toUpperCase()],
          rune: decodedRuneName
      });
    }

    setRunes(results);
  }

// TODO сделать парсер камней по логике ниже
// в начале получаем все 11 камней
// затем скиллы и если они попадают дважды то в массиве будет 2 элемента 1 дд второй кд skillName: [cd,d] (Длань Авесты: [8,8])
// в противном дд

  return (
    <div>
      <div>
        <h1>Данные с сайта:</h1>
        <input type="text" value={text} onChange={handlerInputText}/>
        <button onClick={handlerClick} disabled={isLoading}>
          {isLoading ? "Загрузка..." : "Получить данные по нику"}
        </button>
      </div>
      <div>
        Полученная информация:
        {tripods?<pre>tripods = {JSON.stringify(tripods, null, 2)}</pre>:""}
        {skills?<pre>skills = {JSON.stringify(skills, null, 2)}</pre>:""}
        {runes?<pre>runes = {JSON.stringify(runes, null, 2)}</pre>:""}

        Вывод данных в разных форматах для тестов и поиска информации со страницы:
        {/* <p>{data?<pre>{JSON.stringify(data, null, 2)}</pre>:""}</p> */}
        {data?<pre>{data}</pre>:""}
      </div>
    </div>
  );
}

export default App;