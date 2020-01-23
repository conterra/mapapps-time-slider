/*
 * Copyright (C) 2019 con terra GmbH (info@conterra.de)
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
import TimeSlider from "esri/widgets/TimeSlider";
import moment from "esri/moment";

const _timeSliderWidget = Symbol("_timeSliderWidget");
const _initialTimeExtent = Symbol("_initialTimeExtent");

export default class TimeSliderWidgetFactory {

    activate() {
        this._getView().then((view) => {
            this[_initialTimeExtent] = view.timeExtent;
        });
    }

    deactivate() {
        this._resetTimeExtent();
        this._destroyWidget();
    }

    onToolActivated() {
        this._getView().then((view) => {
            view.timeExtent = this[_timeSliderWidget].timeExtent;
            if (this._properties.playOnStartup) {
                this[_timeSliderWidget].play();
            }
        });
    }

    onToolDeactivated() {
        this[_timeSliderWidget].stop();
        this._resetTimeExtent();
    }

    getWidget() {
        const timeSliderProperties = this.getTimeSliderProperties();
        return this[_timeSliderWidget] = new TimeSlider(timeSliderProperties);
    }

    _destroyWidget() {
        this[_timeSliderWidget].destroy();
        this[_timeSliderWidget] = undefined;
    }

    getTimeSliderProperties() {
        const properties = this._properties;
        const timeSliderProperties = {
            fullTimeExtent: this._getFullTimeExtent(),
            mode: properties.mode,
            loop: properties.loop,
            playRate: properties.playRate,
            timeVisible: properties.timeVisible
        };
        const stops = this._getStops();
        if (stops) {
            timeSliderProperties.stops = stops;
        }
        const values = this._getValues();
        if (values) {
            timeSliderProperties.values = values;
        }
        return timeSliderProperties;
    }

    _getFullTimeExtent() {
        const properties = this._properties;
        const fullTimeExtent = properties.fullTimeExtent;
        let start = moment();
        let end = moment().add(1, 'year');
        if (fullTimeExtent.start) {
            start = this._getDate(fullTimeExtent.start);
        }
        if (fullTimeExtent.end) {
            end = this._getDate(fullTimeExtent.end);
        }
        return {
            start: start,
            end: end
        }
    }

    _getValues() {
        const properties = this._properties;
        if (properties.values) {
            return properties.values.map((dateString) => this._getDate(dateString));
        } else {
            return null;
        }
    }

    _getStops() {
        const properties = this._properties;
        const stopsProperties = properties.stops;
        let stops = null;
        if (stopsProperties) {
            if (stopsProperties.dates) {
                stops = {};
                stops.dates = stopsProperties.map((dateString) => moment(dateString).toDate());
            } else if (stopsProperties.moment) {
                stops = {};
                const dates = [];
                let momentObj = moment();
                stopsProperties.moment.forEach((timeStop) => {
                    if (!timeStop) {
                        // do nothing
                    } else if (typeof timeStop === 'string') {
                        momentObj = moment(timeStop);
                    } else if (Array.isArray(timeStop)) {
                        timeStop.forEach((time) => {
                            momentObj[time.method].apply(momentObj, time.args);
                        });
                    } else {
                        momentObj[timeStop.method].apply(momentObj, timeStop.args);
                    }
                    dates.push(momentObj.toDate());
                });
                stops.dates = dates;
            } else {
                if (stopsProperties.count) {
                    stops = {};
                    const defaultStopCount = 10;
                    stops.count = stopsProperties.count || defaultStopCount;
                } else if (stopsProperties.interval) {
                    stops = {};
                    stops.interval = {
                        value: stopsProperties.interval.value || 1,
                        unit: stopsProperties.interval.unit || "years"
                    }
                }
                if (stopsProperties.timeExtent && stops) {
                    let start = null;
                    let end = null;
                    if (stopsProperties.timeExtent.start) {
                        start = moment(stopsProperties.timeExtent.start);
                    }
                    if (stopsProperties.timeExtent.end) {
                        end = moment(stopsProperties.timeExtent.end);
                    }
                    if (start && end) {
                        stops.timeExtent = {
                            start: start.toDate(),
                            end: end.toDate()
                        }
                    }
                }
            }
        }
        return stops;
    }

    _getDate(config) {
        return moment(config).toDate();
    }

    _getView() {
        const mapWidgetModel = this._mapWidgetModel;
        return new Promise((resolve, reject) => {
            if (mapWidgetModel.view) {
                resolve(mapWidgetModel.view);
            } else {
                mapWidgetModel.watch("view", ({value: view}) => {
                    resolve(view);
                });
            }
        });
    }

    _resetTimeExtent() {
        this._getView().then((view) => {
            view.timeExtent = this[_initialTimeExtent];
        })
    }
}
