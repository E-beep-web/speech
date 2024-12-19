const languages = [
    ['English',        ['en-AU', 'Australia'],
    ['en-CA', 'Canada'],
    ['en-IN', 'India'],
    ['en-NZ', 'New Zealand'],
    ['en-ZA', 'South Africa'],
    ['en-GB', 'United Kingdom'],
    ['en-US', 'United States']],
    ['Español',       ['es-ES', 'España'],
                      ['es-MX', 'México']],
    ['Français',      ['fr-FR', 'France'],
                      ['fr-CA', 'Canada']],
    ['Deutsch',       ['de-DE', 'Deutschland']],
    ['Italiano',      ['it-IT', 'Italia']],
    ['日本語',         ['ja-JP', '日本']],
    ['한국어',         ['ko-KR', '대한민국']],
    ['中文',          ['zh-CN', '中国大陆'],
                      ['zh-TW', '台湾']],
['Afrikaans',       ['af-ZA']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Deutsch',         ['de-DE']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Français',        ['fr-FR']],
 ['Galego',          ['gl-ES']],
 ['Hrvatski',        ['hr_HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['Magyar',          ['hu-HU']],
 ['Nederlands',      ['nl-NL']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Türkçe',          ['tr-TR']],
 ['български',       ['bg-BG']],
 ['Pусский',         ['ru-RU']],
 ['Српски',          ['sr-RS']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['Lingua latīna',   ['la']]
];

const select_language = document.querySelector('#select_language');
const select_dialect = document.querySelector('#select_dialect');


for (let i = 0; i < languages.length; i++) {
    select_language.options[i] = new Option(languages[i][0], i);
}


function updateCountry() {
    for (let i = select_dialect.options.length - 1; i >= 0; i--) {
        select_dialect.remove(i);
    }
    
    const languageIndex = select_language.selectedIndex;
    const dialects = languages[languageIndex];
    
    for (let i = 1; i < dialects.length; i++) {
        select_dialect.options.add(new Option(dialects[i][1], dialects[i][0]));
    }
    
    select_dialect.style.visibility = dialects.length === 1 ? 'hidden' : 'visible';
    updateLanguage();
}


select_language.selectedIndex = 0;
updateCountry();
select_dialect.selectedIndex = 0;