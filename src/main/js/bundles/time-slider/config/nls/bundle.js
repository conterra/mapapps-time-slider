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
            serviceId: {title: "Service ID", tooltip: "ID of service as defined in MapModel"},
            layerId: {title: "Layer ID", tooltip: "ID of layer as defined in MapModel"},
            startTime: {title: "Starting date", tooltip: "Starting date for time slider"},
            endTime: {title: "Ending date", tooltip: "Ending date for time slider"},
            stops: {title: "Stops", tooltip: "Stops depending on the unit, i.e. every second month"},
            unit: {
                title: "Unit",
                tooltip: "Unit of time slider",
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
            loop: {title: "Loop", tooltip: "Start again when end is reached"},
            playing: {title: "Playing", tooltip: "Automatically start playing"},
            timeStops: {
                title: "Time stops",
                tooltip: "Time stops of slider. If left empty time stops will be calculated from start to end date with given stop number."
            },
            thumbMovingRate: {title: "Moving rate", tooltip: "Moving rate of animation [ms]."},
            cumulative: {title: "Cumulative", tooltip: "Cumulative"},
            thumbCount: {title: "Selector type", tooltip: "Type of selector (1 for single, 2 for range)"},
            datePattern: {title: "Date pattern", tooltip: "Date pattern for time slider"},
            excludeDataAtLeadingThumb: {title: "Exclude first data", tooltip: "Exclude data at leading thumb"},
            excludeDataAtTrailingThumb: {title: "Exclude last data", tooltip: "Exclude data at trailing thumb"}
        }
    }, de: !0
});