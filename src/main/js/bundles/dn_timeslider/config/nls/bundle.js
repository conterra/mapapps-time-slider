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
    root: {
        bundleName: "TimeSlider-Config",
        bundleDescription: "This bundle provides the configuration components for the time slider bundle.",
        menu: {title: "Time Slider"},
        widget: {
            description: "Configuration of the time slider widget",
            mapModelNodeId: {title: "Mapmodel Node IDs", tooltip: "IDs of layers as defined in MapModel"},
            startTime: {title: "Starting date", tooltip: "Starting date for time slider"},
            endTime: {title: "Ending date", tooltip: "Ending date for time slider"},
            timeIntervalLength: {title: "Length", tooltip: "Length of one time interval (i.e. every second month)"},
            timeIntervalUnit: {
                title: "Unit",
                tooltip: "Unit of the time interval",
                units: {
                    seconds: "Seconds",
                    minutes: "Minutes",
                    hours: "Hours",
                    days: "Days",
                    weeks: "Weeks",
                    months: "Month",
                    years: "Years",
                    decades: "Decades",
                    centuries: "Centuries"
                }
            },
            labelSelector: {title: "Format", tooltip: "Format for time slider"},
            labelDatePattern: {title: "Date pattern", tooltip: "Date pattern for time slider"},
            labelTimePattern: {title: "Time pattern", tooltip: "Time pattern for time slider"},
            loop: {title: "Loop", tooltip: "Start again when end is reached"},
            playOnStartup: {title: "Play on start", tooltip: "Automatically start playing"},
            cumulative: {title: "Cumulative", tooltip: "Cumulative"},
            thumbCount: {title: "Selector type", tooltip: "Type of selector (1 for single, 2 for range)"},
            thumbMovingRate: {title: "Moving rate", tooltip: "Moving rate of animation [ms]."},
            excludeDataAtLeadingThumb: {title: "Exclude first data", tooltip: "Exclude data at leading thumb"},
            excludeDataAtTrailingThumb: {title: "Exclude last data", tooltip: "Exclude data at trailing thumb"}
        }
    }, de: !0
});