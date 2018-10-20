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

Aktuell wird der PHP REST Service von Maurits van der Schee geutzt, der auf jedem PHP-Server leicht installiert werden kann. Vilen Dank dafür!

https://github.com/mevdschee/php-crud-api/tree/v1

https://github.com/mevdschee/php-api-auth/tree/v1

Aktuell ist die Authetifizierung und Autorisierung abgeschlossen.
Es fehlt noch die Veröffentlichung des angepassten PHP Codes und des Datanbakschemas für das Backend und ein Testdatenbestand.

Das Datenbankschema soll noch angepasst werden, so dass weniger Tabellen nötig sind und es nicht wie bisher vorwiegend auf Datenbank-Views zurückgreift.

Alternativ überlege ich einen Adapter für Amazons Product Advertising API zu implementiere, da der Artikelbestand, der sich in Kundenbesitz befindet, nicht veröffntlicht werden darf.


# Entwicklung

Ich entwickele dieses Projekt mit Visual Studio Code. Die Projektkonfiguration ist mit versioniert. Test, Demo, Build und Hosting kann mit der Polymer CLI erfolgen.

Das PHP Backend und der Shop sind so gestaltet, dass sie mit einem einfachen Hostigpaket bei fast jedem Provider gehostet werden kann, das MySQL und PHP ab 5.6 unterstützt.

Das Buildergebnis bewerte ich mit dem Google Chrome Lighthous Pluin, das Aufschluss über die Performance, Usability usw. gibt (https://developers.google.com/web/tools/lighthouse/).

# Offne Punkte

- Bezahlung (Bisher nur für registrierte B2B Kunden über Rechnung)
- E-Mail Bestätigungen
- Wunschliste
- Dokumentation der REST Schnitttelle
- Veröffentlichung des Backend Codes
- Testdaten
- Unterstützung der Amazon Product Advertising API (https://docs.aws.amazon.com/de_de/AWSECommerceService/latest/DG/Welcome.html)
- Internationalisierung
- Attraktiveres Design Template des Demoshops


# Tipps zur Entwicklung

Dieses Projekt erfordert die Polymer CLI und NodeJS. Die Installation ist hier beschrieben: https://www.polymer-project.org/3.0/docs/tools/polymer-cli

Bevor das Projekt das erste mal benutzt wird, muss es mit `polymer install` initialisiert werden. Dadurch werden alle in `package.json` angegebenen Abhängigkeiten heruntergeladen und bereitgestellt. Das dauert beim erstan Mal eine Weile.

Für die Entwicklung kann die App nach Ausführung des Befehls `polymer serve` unter der URL http://127.0.0.1:8081 in Chrome aufgerufen werden. Änderungen sind nach einem Refresh im Browser sofort sichtbar.

Es wird angestrebt, die App son unabhängig wie möglich vom Server zu betreiben, um auch bei langsamem Netzwetzwerk eine gute User Experiance zu haben. Dazu wird die `Workbox` eingesetzt, die in der Datei `service-worker.js` konfiguriert ist. Die Workbox ist erst nach dem Build (s.u.) aktiv. 

Eine völlige Offlinefähigkeit des Shops ist nicht möglich, da die Ergebnisse aller möglichen REST Anfragen vorab gecached werden müssten. Außerdem dürfte der Warenbestand mit allen Bildern den Cache-Speicher der meisten Browser sprengen.

## Demo

Jede Webkomponente sollte mindestens ein Minimal-Demo enthalten, welches eine beispielhafte Nutzung der Komponente zeigt.
Dieses Demo befindet sich standardmäßig in [/demo/index.html](.\demo\index.html). Eine Demo sollte in dieser Datei einzeln mit einem `<demo-snippet> </demo-snippet>` umgeben sein.
Demos sollten unabhängig vom REST Service sein.

Die Demo-Seite kann nach Ausführung des Befehls `polymer serve` unter der URL http://127.0.0.1:8081/demo aufgerufen werden.

## Automatisierte Tests

Tests müssen mindestens zu den Core-Funktionalitäten, bestenfalls für alle Features und Fälle geschrieben werden. Dadurch wird eine stabile Code-Basis für die zukünftige Entwicklung garantiert.

### Entwicklung von Tests

Für jedes selbst geschriebene JavaScript-Modul, das in der Webkomponente genutzt wird, muss eine eigene html Datei im test-Ordner hinzugefügt werden. Außerdem muss diese Datei in der [test/index.html](.\test\index.html) in die Liste der zu ladenden Tests eingefügt werden.
Tests können mit `polymer test` für alle installierten Browser automatisiert durchgeführt werden oder nach der Ausführung von `polymer serve` unter der URL http://127.0.0.1:8081/test im verwendeten Browser gestartet werden.


## API-Dokumentation

Die Dokumentation wird mit dem Befehl `polymer analyze > analysis.json` erzeugt oder aktualisiert. Nach der Ausführung von `polymer serve` kann sie unter der URL http://localhost:8081/docs.html angesehen werden.

Eigene Komponenten sollten im Javascript code dokumentiert werden, um die generierte Dokumentation Aussagekräftig zu machen.

## Build-Prozess

Hierzu wird die Polymer CLI benutzt. Der Befehl dazu ist `polymer build`. Das Projekt ist in der Datei `polymer.json` so konfiguriert, dass das `es6-bundled `Profil ausgegeben wird. Es läuft in allen aktuellen Browsern mit guter Performance.

Das Verzeihnis `/build/es6-bundled` kann auf einem beliebigen Webserver deployed werden. Es kann auch der Polymer Server verwendet werden, indem im Verzeichnis `/build/es6-bundled` der Befehl `polymer serve` aufgerufen wird.
