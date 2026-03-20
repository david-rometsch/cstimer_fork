## Strategie: cstimer Scramble-System verstehen

### Das Problem

cstimer ist ein gewachsenes JS-Projekt ohne Typen – du wirst dich durch viele Schichten kämpfen. Ohne Strategie verlierst du dich.

### Dos

**1. Top-down starten, nicht bottom-up** Zuerst verstehen _wie_ ein ZBLL-Scramble aufgerufen wird, bevor du schaust _wie_ er generiert wird.

- In der UI den Scramble-Typ wählen → Network/Console beobachten → Einstiegspunkt finden

**2. Mit Claude Code gezielt fragen** Nicht "erkläre mir das Projekt", sondern:

- _"Wo wird ZBLL als Scramble-Typ registriert?"_
- _"Welche Funktion generiert den Scramble-String für ZBLL?"_
- _"Was ist der Unterschied zwischen ZBLL und COLLL in der Codebasis?"_

**3. Eine Datei als Anker nehmen** Finde die Datei wo Scramble-Typen _registriert_ werden (wahrscheinlich ein großes Config-Objekt). Das ist dein Ausgangspunkt für alles.

**4. Einen bestehenden ähnlichen Typ kopieren** COLLL als Template nehmen → minimal anpassen → testen. Nie von Null anfangen.

**5. Diff-driven development** `git diff` zeigt dir exakt was nötig ist, wenn du COLLL → dein Typ änderst.

---

### Don'ts

- ❌ **Nicht das ganze Repo lesen** – cstimer hat tausende Zeilen, das ist Zeitverschwendung
- ❌ **Nicht den Scramble-Algorithmus zuerst verstehen** – erst die Struktur, dann die Logik
- ❌ **Nicht ohne laufende Instanz arbeiten** – du brauchst sofortiges visuelles Feedback
- ❌ **Nicht Claude Code bitten, das Projekt zu "erklären"** – zu vage, zu viel Output

---

### Konkreter Einstiegsplan

```
1. git clone + lokal zum Laufen bringen
2. Claude Code: "Find where scramble types like ZBLL are registered"
3. Claude Code: "Trace how a ZBLL scramble is generated end-to-end"
4. Diff zwischen ZBLL und COLLL verstehen
5. Eigenen Typ als Kopie von COLLL erstellen
```

Der kritische Pfad ist **Registrierung → Generator-Funktion → Fallback/Algorithmus**. Alles andere ist Rauschen.

### Kritischer Pfad (konkret) 
UI-Dropdown "ZBLL" → irgendein Key/ID (z.B. "zbll" oder eine Zahl) → Lookup in Scramble-Registry (ein Objekt/Map) → Generator-Funktion wird aufgerufen → gibt String zurück (z.B. "R U R' U'...") ``` **Claude Code Befehl dafür:** ``` "Find the string 'zbll' or 'ZBLL' in the codebase, show me where it's registered as a scramble type, and trace what function is called to generate the scramble"

```
# Clone mit voller History
git clone https://github.com/cs-timer/cstimer
cd cstimer
```

```
# Falls nur flache History (1 Commit)
git fetch --unshallow
```

```
Hat das Repo eine brauchbare History?
git log --oneline | head -20
```

```
# Wann wurde COLLL/ZBLL eingeführt?
git log --all -S "colll" --oneline
git log --all -S "zbll" --oneline
```

```
# Exakt welche Zeilen = ein neuer Scramble-Typ
git show <commit-hash>
```

### git diff syntax. 
```sh
@@ -271,6 +271,22 @@  // Zeilennummern: alt, neu

--- Datei-Header: alte Version (name und pfad)
+++ Datei-Header: neue Version

+   // neu hinzugefügte Zeile
-   // gelöschte Zeile
    // unveränderte Zeile (Kontext)
```

### wrapping des pll-maps mit getAnyScramble. 
- function getPLLScramble(type, length, cases) {
- var idx = cases;
- var pllcase = pll_map[idx];
- return getAnyScramble(pllcase[0], 0x000000000000, pllcase[1], 0x00000000, [[], [Ux1], [Ux2], [Ux3]], [[], [Ux1], [Ux2], [Ux3]]); das ist im pll first commit - auch sehr aufschlussreich pllcase[0] und pllcase[1] stammen aus dem gezeigetn map und andere definitionen sind einfach alles 00000..., weil edges und corners alle orientiert! getPLLScramble ist ein wrapper fuer anyscramble.

## einstieg claude code mit vorwissen
Du weißt bereits viel – das ist ein Vorteil. Aber Claude Code braucht Kontext. Bester Ansatz:

**Einmal top-down als Kontext-Setup:**

> "Ich will einen neuen Scramble-Typ '3bld-corner' hinzufügen. Ich weiss bereits: getAnyScramble ist der Core, PLL ist mein Template, ich brauche ep=0xba9876543210, eo=0, co=0, cp=mein 3-Cycle. Zeig mir alle Stellen wo ich Änderungen machen muss."

Dann detail-orientiert weiterarbeiten. Claude Code kennt danach den Scope und du verlierst dein Wissen nicht.