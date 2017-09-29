/*
 * Copyright (C) 2015 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define({
    bundleName: "TimeSlider-Konfiguration",
    bundleDescription: "Dieses Bundle stellt die Konfigurationskomponenten f\u00fcr das TimeSliderBundle zur Verf\u00fcgung.",
    menu: {title: "Time Slider"},
    widget: {
        description: "Konfiguration des Time Sliders.",
        mapModelNodeId: {title: "Mapmodel Knoten IDs", tooltip: "ID der Layer im MapModel"},
        startTime: {title: "Startdatum", tooltip: "Startdatum des Time Sliders"},
        endTime: {title: "Enddatum", tooltip: "Enddatum des Time Sliders"},
        timeIntervalLength: {title: "L\u00e4nge", tooltip: "L\u00e4nge eines Zeitintervalls (bspw. 3 Monate)"},
        timeIntervalUnit: {
            title: "Einheit",
            tooltip: "Einheit des Zeitintervalls",
            units: {
                seconds: "Sekunden",
                minutes: "Minuten",
                hours: "Stunden",
                days: "Tage",
                weeks: "Wochen",
                months: "Monate",
                years: "Jahre",
                decades: "Dekaden",
                centuries: "Jahrhunderte"
            }
        },
        labelSelector: {title: "Format", tooltip: "Format der Skalenanzeige"},
        labelDatePattern: {title: "Datumsformat", tooltip: "Datumsformat der Skalenanzeige"},
        labelTimePattern: {title: "Zeitformat", tooltip: "Zeitformat der Skalenanzeige"},
        loop: {title: "Wiederholen", tooltip: "Wiederholt die Wiedergabe"},
        playOnStartup: {title: "Abspielen", tooltip: "Beginnt das Abspielen automatisch"},
        cumulative: {title: "Kumulativ", tooltip: "Kumulativ"},
        thumbCount: {title: "Abschnitte", tooltip: "Anzahl der Abschnitte (1 f\u00fcr einfach, 2 f\u00fcr Bereich)."},
        thumbMovingRate: {title: "Animationsgeschwindigkeit", tooltip: "Geschwindigkeit der Animation [ms]."},
        excludeDataAtLeadingThumb: {title: "Ersten Datensatz ignorieren", tooltip: "Ignoriert den ersten Datensatz"},
        excludeDataAtTrailingThumb: {title: "Letzten Datensatz ignorieren", tooltip: "Ignoriert den letzten Datensatz"}
    }
});