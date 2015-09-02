define(
/*
 * COPYRIGHT 2010-2011 con terra GmbH Germany
 */
({
    apptitle : "Verkehr",
    map : {
        glasspane : {
            settlements : {
                tel : "Telefon",
                link : "Homepage aufrufen",
                url : {
                    esri : "http://www.esri.de/",
                    ct : "http://www.conterra.de/de",
                    geocom : "http://www.geocom.ch",
                    geocom2 : "http://www.geocom-informatik.de"
                }
            }
        },
        operational : {
            streets : {
                title:"Stra\u00DFenverkehr",
                description: "In Deutschland finden \u00FCber 90\u0025 des Personenverkehrs und \u00FCber 65\u0025 des G\u00FCterverkehrs \u00FCber Stra\u00DFen statt.",
                children : {
                    streets01 : "Autobahnen",
                    primary01 : "Bundesstra\u00DFen",
                    secondary01 : "Verbindungsstra\u00DFen",
                    tertiary01 : "Kreisstra\u00DFen",
                    residential01 : "Siedlungsstra\u00DFen"
                }
            },
            airtraffic : {
                title : "Luftverkehr",
                description : "Der Luftverkehr bildet heute einen wichtigen Teil der modernen Verkehrsinfrastruktur. In den letzten Jahren wuchs der Luftverkehr um j\u00E4hrlich 5\u0025",
                children : {
                    airtraffic01 : "Hubschrauberlandepl\u00E4tze",
                    airtraffic03 : "Gro\u00DFflugh\u00E4fen",
                    airtraffic04 : "Flugh\u00E4fen",
                    airtraffic06 : "Terminals",
                    airtraffic08 : "Start-/Landebahnen",
                    airtraffic10 : "Rollwege",
                    airtraffic12 : "Terminal Bereiche",
                    airtraffic14 : "Flughafen und Vorfeld Bereiche",
                    airtraffic15 : "Flughafen Bereiche",
                    airtraffic16 : "Vorfeld Bereiche"
                }
            },
            railway : {
                title:"Schienenverkehr",
                description : "Die erste maschinell angetriebene Eisenbahn in Deutschland nahm 1835 ihren Betrieb auf. Heute gibt es ein Schienennetz von ca. 35.000 km in Deutschland.",
                children : {
                    railways1 : "Schienenfernverkehr",
                    railways2 : "Stadtbahn",
                    railways3 : "Stra\u00DFenbahn",
                    railways4 : "Museumsbahn",
                    railways5 : "U-Bahn"
                }
            }
        },
        base: {
            "topo":{
                title : "Topo",
                description:"Eine topographische Weltkarte"
            },
            "aerial":{
                title : "Luftbild",
                description:"Luftbildaufnahmen der gesamten Welt"
            },
            "streets":{
                title : "Stra\u00DFen",
                description:"Eine detaillierte Stra\u00DFenkarte"
            },
            "minimal": {
                title : "Minimal",
                description:"Eine schlichte, helle Hintergrundkarte"
            },
            "google": {
                title : "Google",
                description:"Google Karte"
            }
        }
    },
    agssearch : {
        airports : {
            title : "Flugh\u00E4fen",
            description : "Suche nach Flugh\u00E4fen",
            placeHolder : "Flughafen..."
        },
        helipads : {
            title : "Hubschrauberlandepl\u00E4tze",
            description : "Suche nach Hubschrauberlandepl\u00E4tzen",
            placeHolder : "Hubschrauberlandeplatz..."
        },
        largeAirports : {
            title : "Gro\u00DFflugh\u00E4fen",
            description : "Suche nach Gro\u00DFflugh\u00E4fen",
            placeHolder : "Gro\u00DFflughafen..."
        },
        airportRunways : {
            title : "Flughafenlandepl\u00E4tze",
            description : "Suche nach Flughafenlandepl\u00E4tzen",
            placeHolder : "Flughafenlandeplatz..."
        },
        airportAreas : {
            title : "Flughafenbereiche",
            description : "Suche nach Flughafenbereichen",
            placeHolder : "Flughafenbereich..."
        }
    },
    selection: {
        infoservice : {
            title : "Infoservice"
        },
        airports : {
            title : "Flugh\u00E4fen"
        },
        airportsAndHelipads : {
            title : "Flugh\u00E4fen und Hubschrauberlandepl\u00E4tze"
        }
    }
})

);