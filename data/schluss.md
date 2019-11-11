# motivation
- js typsystem ist eher nich so gut
- statische typsysteme lösen das
- ziel:t ranspiler für flow nach ts
- grund: annahme, dass ts geiler sei

# analyse
- fuer zwei projekte umgesetzt
- es gibt schon was, aber ist kacke (cherny und kikura)
- vier ziele
    - erkennung weiterer typ- und programmfehler: ERREICHT
        - viele neue gefunden
        - aber die meisten sind nicht wirklich programmfehler, sondern ts !== flow
        - jetzt mehr libdefs
        - paar kleinere aber gefunden, typisierung jetzt nicer (behaupte ich)
    - externe libs: ERREICHT
        - insgesamt gibt's viel mehr bei ts
        - im vorliegenden fall aber nur kleiner vorteil bei ts
    - performance: TEILWEISE ERREICHT
        - parallelisierung von flow is halt scho geil
        - evtl wirds besser
    - transparenz / zukunft: ERREICHT
        - roadmap usw (planungssicherheit)
        - klare kommunikation
        - bugs werden schneller angegangen
- fünf techn. anforderungen
    - äquivalenz / vollständigkeit der transpilierung ERREICHT MIT EINSCHRÄNKUNGEN
        - anhand fixture tests
        - volllständigkeit jawoll
        - äquivalenz jawoll mit beschriebenen einschränkungen
        - kikura / barabash: verkackens oft bei testfällen
    - beibehaltung semantik VERMUTLICH ERREICHT
    - es10, es10+, flow, ts, jsx syntax ERREICHT
        - kikura / barabash: verkackens manchmal
    - verarbeitung ganzer projekte ERREICHT
        - nur barabash
    - beibehaltung formatierung GRÖßTENTEILS ERREICHT
        - besser als barabash
    
# umsetzung
kommandozeilenprogramm
    runner
    plugin
        besucher
        konvertor
        optimierer
            react typimporte
            klassendekoraten
    formatierer
        
viele fixture tests für alles mögliche
basis-, hilfstypen, typedeklarationen

# auswertung
- migration an sich war möglich wa
- viele neue fehler
