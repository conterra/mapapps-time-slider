define({ root:
/*
 * COPYRIGHT 2010-2011 con terra GmbH Germany
 */
({
    apptitle : "Traffic",
    map : {
        glasspane : {
            settlements : {
                tel : "Telephone",
                link : "Open Homepage",
                url : {
                    esri : "http://www.esri.de/",
                    ct : "http://www.conterra.de/index_en.asp",
                    geocom : "http://geocom.ch/en/start",
                    geocom2 : "http://geocom-informatik.de/en/start"
                }
            }
        },
        operational : {
            streets : {
                title:"Streets",
                description: "Over 90\u0025 of passenger services and over 65\u0025 of freight traffics are proceeded via streets in Germany.",
                children : {
                    streets01 : "Motorways",
                    primary01 : "Major Highways",
                    secondary01 : "Linking Roads",
                    tertiary01 : "District Roads",
                    residential01 : "Residential Roads"
                }
            },
            airtraffic : {
                title : "Airtraffic",
                description : "Airtraffic is an import part of modern transportation infrastructure. The annual growth was about 5\u0025 in the last years.",
                children : {
                    airtraffic01 : "Helipads",
                    airtraffic03 : "Major Aerodromes",
                    airtraffic04 : "Aerodromes",
                    airtraffic06 : "Terminals",
                    airtraffic08 : "Runways",
                    airtraffic10 : "Taxiways",
                    airtraffic12 : "Terminal Areas",
                    airtraffic14 : "Aerodrome and Apron Areas",
                    airtraffic15 : "Aerodrome Areas",
                    airtraffic16 : "Apron Areas"
                }
            },
            railway : {
                title:"Railway",
                description : "German Railway history began with the opening of the steam-hauled Bavarian Ludwig Railway between Nuremberg and Fuerth on 7 December 1835. Today there are about 35.000 km of railways in Germany.",
                children : {
                    railways1 : "Rail",
                    railways2 : "Light Rail",
                    railways3 : "Tram",
                    railways4 : "Preserved",
                    railways5 : "Subway"
                }
            }
        },
        base: {
            "topo": {
                title : "Topo",
                description:"A topographic world map"
            },
            "aerial":{
                title : "Aerial",
                description:"Aerial views of the whole world"
            },
            "streets":{
                title : "Streets",
                description:"A detailed world street map"
            },
            "minimal": {
                title : "Minimal",
                description:"A simple, white map"
            },
            "google": {
                title : "Google",
                description:"Google map"
            }
        }
    },
    agssearch : {
        airports : {
            title : "Airports",
            description : "Search for Airports",
            placeHolder : "Airport..."
        },
        helipads : {
            title : "Helipads",
            description : "Search for Helipads",
            placeHolder : "Helipad..."
        },
        largeAirports : {
            title : "Large airports",
            description : "Search for large airports",
            placeHolder : "Large airport..."
        },
        airportRunways : {
            title : "Airport runways",
            description : "Search for airport runways",
            placeHolder : "Airport runway..."
        },
        airportAreas : {
            title : "Airport areas",
            description : "Search for airport areas",
            placeHolder : "Airport area..."
        }
    },
    selection: {
        infoservice : {
            title : "Infoservice items"
        },
        airports : {
            title : "Airports"
        },
        airportsAndHelipads : {
            title : "Airports and helipads"
        }
    }
})
,
"de":true
});