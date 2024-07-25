///
/// Copyright (C) 2024 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { InjectedReference } from "apprt-core/InjectedReference";
import TimeSlider from "esri/widgets/TimeSlider";
import moment from "moment";

import { MapWidgetModel } from "map-widget/api";
import { TimesliderProperties } from "../../types/TimesliderProperties";
import TimeExtent from "esri/TimeExtent";

export default class TimeSliderWidgetController {

    private _properties: InjectedReference<Record<string, any>>;
    private timeSliderWidget: any = undefined;
    private initialTimeExtent: any = undefined;
    private labelFormatFunction: any = undefined;
    private timeExtentWatcher: any = undefined;
    private _mapWidgetModel: InjectedReference<MapWidgetModel>;

    public activate(): void {
        const properties = this._properties;
        this.getView().then((view: __esri.View) => {
            if (this._properties.viewTimeExtent) {
                view.timeExtent = this.getTimeExtentFromConfig(properties, "viewTimeExtent");
            }
            this.initialTimeExtent = view.timeExtent;
        });
    }

    public setLabelFormatFunction(labelFormatFunction: __esri.DateLabelFormatter): void {
        this.labelFormatFunction = labelFormatFunction;
    }

    public deactivate(): void {
        this.resetTimeExtent();
        this.destroyWidget();
    }

    public onToolActivated(): void {
        this.getView().then((view: __esri.View) => {
            // Whenever the TimeSlider is opened, we want to (re)set it to the configured time extent.
            this.timeSliderWidget.timeExtent = this.getTimeExtentFromConfig(this._properties, "timeExtent");

            view.timeExtent = this.timeSliderWidget.timeExtent;
            this.changeAllLayerTimeExtents(view.timeExtent);
            if (this._properties.playOnStartup) {
                this.timeSliderWidget.play();
            }
            this.timeExtentWatcher = this.timeSliderWidget.watch("timeExtent", (value: __esri.TimeExtent) => {
                this.changeAllLayerTimeExtents(value);
            });
        });
    }

    public onToolDeactivated(): void {
        this.timeSliderWidget.stop();
        this.timeExtentWatcher.remove();
        this.resetAllLayerTimeExtents();
        this.resetTimeExtent();
    }

    public getWidget(properties?: InjectedReference<Record<string, any>>): TimeSlider {
        const timeSliderProperties = this.getTimeSliderProperties(properties || this._properties);
        return this.timeSliderWidget = new TimeSlider(timeSliderProperties);
    }

    private destroyWidget(): void {
        this.timeSliderWidget.destroy();
        this.timeSliderWidget = undefined;
    }

    public getTimeSliderProperties(properties: InjectedReference<Record<string, any>>): TimesliderProperties {
        const timeSliderProperties: TimesliderProperties = {
            timeExtent: this.getTimeExtentFromConfig(properties, "timeExtent"),
            fullTimeExtent: this.getTimeExtentFromConfig(properties, "fullTimeExtent"),
            viewTimeExtent: this.getTimeExtentFromConfig(properties, "viewTimeExtent"),
            labelFormatFunction: properties?.labelFormatFunction,
            stops: properties.stops,
            mode: properties.mode,
            loop: properties.loop,
            playRate: properties.playRate,
            playOnStartup: properties.playOnStartup,
            timeVisible: properties.timeVisible
        };
        const stops = this.getStops(properties);
        if (stops) {
            timeSliderProperties.stops = stops;
        }

        if (this.labelFormatFunction) {
            timeSliderProperties.labelFormatFunction = this.labelFormatFunction;
        }

        return timeSliderProperties;
    }

    private getTimeExtentFromConfig(properties: InjectedReference<Record<string, any>>,
        attribute: string): __esri.TimeExtent {
        const timeExtent = properties[attribute];
        if (timeExtent) {
            return this.getTimeExtent(timeExtent);
        } else {
            return undefined;
        }
    }

    private getTimeExtent(referenceTimeExtent: __esri.TimeExtent): __esri.TimeExtent {
        if (moment.isDate(referenceTimeExtent.start) && moment.isDate(referenceTimeExtent.end)) {
            return referenceTimeExtent;
        } else {
            return new TimeExtent({
                start: this.constructDate(referenceTimeExtent.start),
                end: this.constructDate(referenceTimeExtent.end)
            });
        }
    }

    private constructDate(dateRepresentation: string | Date): Date {
        if (!dateRepresentation) {
            return;
        }

        if (dateRepresentation === "now") {
            return moment().toDate();
        }

        let momentObj = moment.utc();
        if (Array.isArray(dateRepresentation)) {
            dateRepresentation.forEach((date, index) => {
                if (typeof date === 'string' && index === 0) {
                    momentObj = moment(date).utc();
                    if (momentObj && !momentObj.isValid()) {
                        momentObj = moment().utc();
                        console.warn("Invalid timeExtent definition. Use current time.");
                    }
                } else {
                    try {
                        momentObj[date.method](...date.args);
                    } catch {
                        console.warn("Invalid moment definition in timeExtent definition. Use current time.");
                    }
                }
            });
        }
        else if (typeof dateRepresentation === 'string') {
            momentObj = moment(dateRepresentation).utc();
            if (momentObj && !momentObj.isValid()) {
                momentObj = moment.utc();
                console.warn("Invalid timeExtent definition. Use current time.");
            }
        }

        return momentObj.toDate();
    }

    private getStops(properties: InjectedReference<Record<string, any>>): __esri.StopsByDates |
    __esri.StopsByCount | __esri.StopsByInterval | undefined {
        const stopsProperties = properties.stops;
        const defaultStopCount = 10;
        let stops = null;

        if (!stopsProperties) {
            return;
        }

        if (stopsProperties && !Object.keys(stopsProperties).length){
            stops = {};
            stops.count = defaultStopCount;
        }

        if (stopsProperties.dates) {
            stops = {};
            const dates = [];
            let momentObj: moment;
            stopsProperties.dates.forEach((dateString: string) => {
                momentObj = moment(dateString).utc();
                if (momentObj?.isValid()) {
                    dates.push(momentObj.toDate());
                }
                else {
                    console.warn("Invalid date stop definition. Skip value.");
                }
            });
            stops.dates = dates;
        }
        else if (stopsProperties.count) {
            stops = {};
            stops.count = stopsProperties.count || defaultStopCount;
        }
        else if (stopsProperties.interval) {
            stops = {};
            stops.interval = {
                value: stopsProperties.interval.value || 1,
                unit: stopsProperties.interval.unit || "years"
            };
        }
        else if (stopsProperties.moment) {
            stops = {};
            const dates = [];
            let momentObj = moment().utc();

            stopsProperties.moment.forEach((timeStop: string | Array<string> | moment) => {
                if (typeof timeStop === 'string') {
                    momentObj = moment(timeStop).utc();
                    if (momentObj?.isValid()) {
                        dates.push(momentObj.toDate());
                    } else {
                        momentObj = moment.utc();
                        console.warn("Invalid stop definition at start of the array. Use current time.");
                    }
                }
                else if (Array.isArray(timeStop)) {
                    timeStop.forEach((time) => {
                        try {
                            momentObj[time.method](...time.args);
                            if (momentObj?.isValid()) {
                                dates.push(momentObj.toDate());
                            }
                        } catch {
                            console.warn("Invalid stop definition in moment array. Skip array entry.");
                        }
                    });
                }
                else {
                    try {
                        momentObj[timeStop.method](...timeStop.args);
                        if (momentObj?.isValid()) {
                            dates.push(momentObj.toDate());
                        }
                    } catch {
                        console.warn("Invalid stop definition in moment array. Skip array entry.");
                    }
                }
            });
            stops.dates = dates;
        }
        else {
            if (stopsProperties.timeExtent && stops) {
                let start = null;
                let end = null;
                if (stopsProperties.timeExtent.start) {
                    start = moment(stopsProperties.timeExtent.start);
                    if (!start?.isValid()) {
                        start = moment.utc();
                        console.warn("No valid configuration for stop timeExtent start. Using current time.");
                    }
                }
                if (stopsProperties.timeExtent.end) {
                    end = moment(stopsProperties.timeExtent.end);
                    if (end && end.isValid() === false) {
                        end = moment.utc();
                        console.warn("No valid configuration for stop timeExtent end. Using current time.");
                    }
                }
                if (start && end) {
                    stops.timeExtent = {
                        start: start.toDate(),
                        end: end.toDate()
                    };
                }
            }
        }

        return stops;
    }

    private changeAllLayerTimeExtents(timeExtent: __esri.TimeExtent) {
        const mapWidgetModel = this._mapWidgetModel;
        const map = mapWidgetModel.map;
        const layers = map.layers;
        const flattenLayers = this.getFlattenLayers(layers);
        flattenLayers.forEach((layer) => {
            if (layer.useViewTime) {
                if (layer.timeExtent && !layer._initialTimeExtent) {
                    layer._initialTimeExtent = layer.timeExtent;
                }
                layer.timeExtent = timeExtent;
            }
        });
    }

    private resetAllLayerTimeExtents() {
        const mapWidgetModel = this._mapWidgetModel;
        const map = mapWidgetModel.map;
        const layers = map.layers;
        const flattenLayers = this.getFlattenLayers(layers);
        flattenLayers.forEach((layer) => {
            layer.timeExtent = layer._initialTimeExtent;
        });
    }

    private getFlattenLayers(layers: __esri.Collection<__esri.Layer>) {
        return layers.flatten(item => item.layers || item.sublayers);
    }

    private getView(): Promise<__esri.View> {
        const mapWidgetModel = this._mapWidgetModel;
        return new Promise((resolve) => {
            if (mapWidgetModel.view) {
                resolve(mapWidgetModel.view);
            } else {
                const watcher = mapWidgetModel.watch("view", ({value: view}) => {
                    watcher.remove();
                    resolve(view);
                });
            }
        });
    }

    private resetTimeExtent(): void {
        this.getView().then((view: __esri.View) => {
            view.timeExtent = this.initialTimeExtent;
        });
    }
}
