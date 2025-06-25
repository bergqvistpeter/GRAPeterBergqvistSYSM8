Kort bakgrund, detta är en slutuppgift i vår Gränsnittskurs med Hassan Hussin.
Då jag missade delar av kursen på grund av sjukdom har mycket av informationen och lärandet skett via youtube, google och ChatGPT/Copilot.

Starten av projektet blev att en grundlig plan etablerades:
1. Leta inspiration och ideér.
2. Grundligt fundera vilka delar som skulle behövas i denna applikation för att nå upp till kursmålen.
3. Göra en Figma wireframe för appen, Desktop blev det då jag först valde att fokusera på G.
4. Lägga struktur för projektet, vad kommer jag behöva.
5. Skapa db.json med kompletta rätter.
6. Skapa API.
7. Göra kraven för G och skapa funktionaliteten.
8. Utöka med VG-kraven.
9. Fixa till CSS för att det ska se bra ut och fungera både på mobil och Desktop.
10. Skriva rapport(ta anteckningar löpande).

Eftersom mina kunskaper i Figma var begränsade(Var sjuk under genomgång och därefter) började jag att rita på papper en grundplan, därefter med
hjälp av Youtube så gjorde jag mina 5 sidor till applikationen för Desktop. Valde att inte göra för mobil då jag var osäker på om jag skulle klara av
att koda detta.
När jag skulle göra struktur så valde jag att googla och fråga ChatGPT hur strukturerar man upp ett projekt i denna storleken. Efter att ha läst igenom en hel del svar och funderat kring vad som skulle fungera för mig så valde jag den struktur jag nu har. Att på ett tydligt sätt dela upp i olika folders med API, Components, Context, Hooks, Pages och Routes. Bilder och db.json lades i Public mappen. Jag skapade de filer som jag trodde jag skulle behöva under projektets gång, och det var bara ett fåtal som jag fick komplettera med senare. Components har jag de saker som återanvänds, så som Header, Navbar, Footer, Filter och Card för rätterna.
API så har jag till maträtter, favoriter, ordrar och användare. I min Context mapp håller jag koll på min Shopping Cart, Användare och Favoriter.
Hooks skapades sent i projektet när jag höll på att fixa med CSS och få det att fungera. Här skulle jag lägga mer tid om jag skulle vilja vidareutveckla.

Jag började med db.json eftersom det är grunden för hela sidan. Utan den blir inget visuellt. Eftersom jag lagt en plan innan så var det ganska enkelt att få med de saker som jag ville ha på rätterna. Så som bilder, beskrivning, om de var vegetariska eller om drickan var alkoholhaltig. Även en OrderCount för att enkelt kunna få fram de populäraste rätterna.

API:erna som jag började göra var de som jag hade funderat ut på förhand, dock fick jag problem med en av dem att sortera i backenden, vilket då ledde till att jag valde att sortera i frontenden istället. Eftersom databasen inte var så stor så tyckte jag att den lösningen var okej. 

Godkänd delen gick ganska fort, planeringen hade gjort att jag fick ihop okej struktur på. På Betalningssidan har jag valt att man kan välja mellan Kort och Swish. När man trycker på knappen sen så ska man komma till nästa sida, antingen för swish eller att mata in sina kortuppgifter, men den delen tänker jag ska ha en annan säkerhet och ska vara kopplad till bank. Därför kommer man direkt till OrderConfirmation.

När jag skulle göra VG delen så mötte jag lite mer svårigheter, även om jag kände mig mer bekväm med koden och hade mer förståelse hur det fungerade.
Det största problemet som jag upplevde var att få till ett filter på ett snyggt sätt i mobilvy. CSS:en och jag har absolut inte varit kompisar och jag har fått använda både CoPilot och CHatGPT mycket för att lokalisera fel och få fram saker som kan hjälpa mig med de problem jag haft. Då jag redan var inne i projektet och kände att jag ville få det klart, valde jag att göra enkla skisser på mobilapplikationen för hand och inte I figma. Dessa kan man kalla low-fidelity av wireframes medan de första jag gjorde till Desktop är High-fidelity. 

Redan innan mobilversionen hade jag gjort några förändringar i Layouten. Detta efter en diskussin med min fru och en av hennes gamla arbetskamrater.
Jag hade flyttat navbaren och lagt den längst ner på sidan i Desktopversionen. Jag tyckte att det blev tydligt, samt att den då är lik mobilversioner, då det är smidigt att ha den längst ner på dessa. 

Jag använder mig av Alerts i projektet, men skulle ändra till modals om jag skulle utveckla appen vidare. Detta för att inte blockera användaren innan den klickat ok på knappen som kommer i Alerten. 

Det jag tar med mig från detta projektet är att planering och förarbete är grunden för en smidig utveckling. Om man kan se försöka visuallisera vad man behöver för olika delar innan man börjar och hur de ska hänga ihop. Vad varje del ska göra så blir det smidigare. Jag har också lärt mig att all information finns tillgänglig, att man kan leta, fråga och testa för att få fram ett resultat. Det jag saknade nu när jag satt med projektet är att kunna fråga klasskamrater och möjligheten till handledning. Ensam är inte stark utan tillsammans är kunskapen, och möjligheten att se lösningar på olika sätt mycket större och bättre.

Applikationen som jag byggt känner jag är good enough, men med möjlighet till förbättring. Planen hjälpte mig att se helheten och hålla fokus, och den faktiska tiden som jag lagt på projektet är kortare än vad jag trodde den skulle vara. 


