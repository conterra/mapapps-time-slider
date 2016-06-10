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
        serviceId: {title: "Dienste-Id", tooltip: "Id des Dienstes (wie im MapModel)"},
        layerId: {title: "Layer ID", tooltip: "Id des layer (wie im MapModel)"},
        startTime: {title: "Startdatum", tooltip: "Startdatum des Time Sliders"},
        endTime: {title: "Enddatum", tooltip: "Enddatum des Time Sliders"},
        stops: {title: "Unterbrechungen", tooltip: "Unterbrechungen alle x [Einheit], bspw. alle 3 Monate"},
        unit: {
            title: "Einheit",
            tooltip: "Einheit des Time Sliders",
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
        loop: {title: "Wiederholen", tooltip: "Wiederholt die Wiedergabe"},
        playOnStartup: {title: "Abspielen", tooltip: "Beginnt das Abspielen automatisch"},
        timeStops: {
            title: "Skala",
            tooltip: "Skala des Time Sliders. Wenn nicht definiert, wird die Skala automatisch aus dem Start- und Enddatum sowie der Unterbrechungsanzahl berechnet."
        },
        thumbMovingRate: {title: "Animationsgeschwindigkeit", tooltip: "Geschwindigkeit der Animation [ms]."},
        cumulative: {title: "Kumulativ", tooltip: "Kumulativ"},
        thumbCount: {title: "Abschnitte", tooltip: "Anzahl der Abschnitte (1 f\u00fcr einfach, 2 f\u00fcr Bereich)."},
        datePattern: {title: "Datumsformat", tooltip: "Datumsformat der Skalenanzeige"},
        excludeDataAtLeadingThumb: {title: "Ersten Datensatz ignorieren", tooltip: "Ignoriert den ersten Datensatz"},
        excludeDataAtTrailingThumb: {title: "Letzten Datensatz ignorieren", tooltip: "Ignoriert den letzten Datensatz"}
    }
});