# Fairshop

Alle gängigen Shop Systeme sind in PHP geschrieben. Dabei bietet PHP in Performance, Sicherheit, Entwicklungsgeschwindigkeit
und Usability nicht die besten Möglichkeiten. Das Polymer Framework in Verbindung mit REST Services kann
viel mehr. Erfahrungen aus der Entwicklung unterschiedlichster Shop-Lösungen in PHP und Erfahrungen in der Polymer
Entwicklung nutzen wir zur Entwicklung einer Open Source Shop Lösung.
Auch Google bietet bereits einen einfachen Referenz-Shop in Polymer 3.0 an. Es ist erstaunlich, mit wie wenig Aufwand eine vollwertige Shop Lösung mit Frontend, Admin-Oberfläche und Backend entwickelt werden kann. Fairshop bündelt die Aktivitäten, hieraus ein modulares offenes Schopsystem zu entwickeln.

# Alternative Namensvorschläge

- Fair kaufen
- Fairkauf
- Fair sell

# Backend

https://github.com/mevdschee/php-crud-api


# Entwicklung

Zum Anzeigen dieser Seite unter VS-Code kann die Tastenkombination `Strg + K V` (erst `Strg + K` drücken, loslassen und dann `V` drücken) genutzt werden.
Alternativ: Rechtsklick auf die Datei -> Vorschau öffnen.

# Offne Punkte

- Überschrift über Produktliste dynamisch anpassen: "Produkte von Herstellername" oder Kategoriename oder Suchergebnisse
- Zoom Funktion für Produktbilder
- Anmeldung/Authentifizierung
- Bezahlung
- Warenkorb
- Wunschliste
- Dokumentation der REST Schnitttelle

# Manuelle Anpassungen

Dieses Template ist zur Standartisierung der Webcomponent-Entwicklung gedacht. Bevor man die Entwicklung beginnt muss man ein paar Dinge händisch anpassen.

## package.json Anpassen

Hierbei müssen alle Felder mit dem Platzhalter [[...]] mit dem jeweiligen Inhalt versehen werden.
Im docs script (`polymer analyze src/fairshop-app.js > analysis.json`) müssen alle JavaScript-Dateien, die in der Dokumentation angezeigt werden sollen, mit Leerzeichen getrennt aufgelistet werden. Hat man bspw. zusätzlich noch ein Mixin `MyMixin.js`, lautet das Skript: `polymer analyze src/fairshop-app.js src/MyMixin.js > analysis.json`

## Installation von VS-Code Tools

Zur Entwicklung von Webkomponenten mit Polymer wird VS-Code als IDE empfohlen, da es dafür von Google unterstützes Tooling gibt.
Sollte eine andere IDE genutzt werden, sollten äquivalente Tools manuell installiert werden.

### Automatische Installation

Die Datei [install_extensions.ps1](./install_extensions.ps1) ist ein, in VS-Code ausführbares, Skript. Zuerst muss die Konsole mit der Tastenkombination `Strg + Ö` geöffnet werden.
Ausgeführt wird das Skript nun mit folgendem Befehl: `.\install_extensions.ps1`. Damit die Tools genutzt werden können, muss VS-Code nach der Installation neu gestartet werden.

### Manuelle Installation

Sollte eine andere IDE genutzt werden oder die skriptgesteuerte Installation fehlschlagen, muss man Erweiterungen/Plugins für folgende Funktionen finden:

* Prettier Formatter (Einheitlicher Code-Style für alle JavaScript Projekte)
* SonarJS Linter (Nutzt die Regeln von SonarJS zum Erkennen von potentiellen Fehlerquellen und schlechtem Programmierstil)
* Beliebiges JSDoc Tool (Optional zur einfacheren Erstellung von JSDoc-Kommentaren mit Autovervollständigung, Tags, etc.)
* Beliebiges TODO Highlighting Tool (Optional zum Hervorheben und gesammeltem Anzeigen von JS Kommentaren die mit `//TODO` oder `//TODO:` beginnen)
* Syntax-Highlightr für in JavaScript integrierten HTML-Code mit Autofill/Intellisense (Optional zum Erleichtern vom template schreiben)

# Tipps zur Entwicklung

## Demo

Jede Webkomponente sollte mindestens eine Minimal-Demo enthalten, welche eine Beispielhafte Nutzung der Komponente vorführt.
Diese Demo befindet sich standardmäßig in [/demo/index.html](.\demo\index.html). Eine Demo sollte in dieser Datei einzeln mit einem `<demo-snippet> </demo-snippet>` umgeben sein.
Achtung: Innerhalb der Demo kann man kein Databinding nutzen, außer man nutzt das `<dom-bind>` helper element von polymer ([dom-bind](https://www.polymer-project.org/2.0/docs/devguide/templates#dom-bind)).

Die Demo-Seite kann über den Befehl `npm run demo` aufgerufen werden.

## Automatisierte Tests

Tests müssen mindestens zu den Core-Funktionalitäten, bestenfalls für alle Features und Fälle geschrieben werden. Dadurch wird eine stabile Code-Basis für die zukünftige Entwicklung garantiert.

### Entwicklung von Tests

Für jedes selbst geschriebene JavaScript-Modul, das in der Webkomponente genutzt wird, muss eine eigene html Datei im test-Ordner hinzugefügt werden. Außerdem muss diese Datei in der [test/index.html](.\test\index.html) in die Liste der zu ladenden Tests eingefügt werden.
Hat man beispielsweise ein Mixin namens `MyMixin.js`, muss man eine Datei `test/MyMixin.html` erstellen und [test/index.html](.\test\index.html) wie folgt anpassen:

```
window.WCT.loadSuites([
  'fairshop-app.html?dom=shadow',
  'fairshop-app.html?wc-shadydom=true&wc-ce=true',
  'MyMixin.js'
]);
```

Beachtet hierbei, dass die Tests sowohl mit Polyfills als auch ohne ausgeführt werden müssen. Das erfolgt durch den suffix `?dom=shadow` und `wc-shadydom=true&wc-ce=true` welches nur Konfigurationen für den [web-component-tester](https://github.com/Polymer/web-component-tester) sind.

Tests werden in BDD-Syntax (Behaviour-Driven-Development) mit Mocha, Chai und Sinon verfasst (siehe [web-component-tester](https://github.com/Polymer/web-component-tester) für Details).

### Ausführung von Tests

Es gibt zwei Möglichkeiten um Tests auszuführen.

1.  `polymer test`
    Lässt Selenium-Tests automatisch in allen definierten Browsern laufen. Die Konfiguration dazu ist in der [wct.conf.json](.\wct.conf.json)-Datei.
2.  `polymer serve`
    Öffnet ein Chrome-Browser und navigiert zu [test](.\test\index.html). Hier werden die tests mit Mocha ausgeführt und deren Ergebnis visuell repräsentiert. Unter Windows sollte MOMENTAN diese Möglichkeit benutzt werden (Bugs und Performance-Probleme machen Selenium-tests unbrauchbar)

## API-Dokumentation

Zur Dokumentation nutzen wir [JSDoc](http://usejsdoc.org/). Mit dem Befehl `npm run docs` werden alle in der package.json im jeweiligen Skript genannten JavaScript-Dateien geparsed und eine Datei namens analysis.json generiert. Diese wird in der [index.html](.\index.html) von der [iron-component-page](https://github.com/PolymerElements/iron-component-page) genutzt, um eine Dokumentationsseite anzuzeigen.


## Build-Prozess

Hierzu wird webpack genutzt um ein UMD-Bundle zu bauen. Der Befehl dazu ist `npm run build`. Die Konfiguration ist in [webpack.config.js](.\webpack.config.js) zu finden.

**WICHTIG:**

Dieser Schritt sollte nur zu Testzwecken vom Entwickler ausgeführt werden. Am Ende wird der Jenkins-Build-Prozess ein finales UMD-Bundle erzeugen und die Version in git entsprechend Taggen, damit jeder weiß, welche Version genau benutzt wird/werden soll.
Bitte benutzt eure lokal gebautes UMD-Bundle **NICHT** in einem anderen Projekt. Nehmt immer das, was auf dem Bitbucket-Repository liegt.
