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
import moment from "moment";

const _timeSliderWidget = Symbol("_timeSliderWidget");
const _initialTimeExtent = Symbol("_initialTimeExtent");

export default class TimeSliderWidgetFactory {

    activate() {
        this._getView().then((view) => {
            // check for viewTimeExtent property; if undefined don't set new view's timeExtent
            if (this._properties.viewTimeExtent) {
                view.timeExtent = this._getViewTimeExtent();
            }
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

    /**
     * Function used to access fullTimeExtent properties and call _getTimeExtent
     *
     * @returns A timeExtent as an object with start and end moment
     */
    _getFullTimeExtent() {
        const properties = this._properties;
        const fullTimeExtent = properties.fullTimeExtent;

        return this._getTimeExtent(fullTimeExtent);
    }

    /**
     * Function used to access viewTimeExtent properties and call _getTimeExtent()
     *
     * @returns A timeExtent as an object with start and end moment
     */
    _getViewTimeExtent() {
        const properties = this._properties;
        const viewTimeExtent = properties.viewTimeExtent;

        return this._getTimeExtent(viewTimeExtent);
    }

    /**
     * Function used to pass start and end component of timeExtent seperatly to _constructMoment()
     *
     * @param {Object} referenceTimeExtent Object representing timeExtent; Contains start and end property
     * @returns timeExtent Object containing two moments, constructed using _constructMoment()
     */
    _getTimeExtent(referenceTimeExtent) {

        const start = this._constructMoment(referenceTimeExtent.start);
        const end = this._constructMoment(referenceTimeExtent.end);

        return {
            start: start,
            end: end
        }
    }

    /**
     * Function used to construct a moment from properties defined in manifest.json/app.json
     * @param {Object} referenceMoment Moment properties extracted from referenceTimeExtent
     * @returns Moment constructed according to parameters
     */
    _constructMoment(referenceMoment){
        let resultMoment
        let MomentObj

        if (Array.isArray(referenceMoment)) {
            // Case: Property is an array and leading element is a string
            if(typeof referenceMoment[0] === 'string'){
                // Try parsing leading string in array to moment
                try {
                    MomentObj = moment(referenceMoment[0]).utc();
                } catch { // Catch by using current time as moment
                    MomentObj = moment.utc()
                    console.warn("String is not a valid moment, using current time.")
                }
                // Remove leading element of array to allow looping over methods
                referenceMoment.shift();
                referenceMoment.forEach((m) => {
                    MomentObj[m.method].apply(MomentObj, m.args);
                });
                resultMoment = MomentObj.toDate();
            // Case: Property is an array but no leading string is found
            } else {
                const MomentObj = moment.utc();
                referenceMoment.forEach((m) => {
                    MomentObj[m.method].apply(MomentObj, m.args);
                });
                resultMoment = MomentObj.toDate();
            }
        // Case: Property is either "now", undefined or null
        } else if (referenceMoment == "now" || referenceMoment == null || referenceMoment == undefined) {
            resultMoment = moment.utc();
        // Case: Property is a string but not "now"
        } else if (typeof referenceMoment === 'string' && referenceMoment != "now") {
            try {
                resultMoment = moment(referenceMoment).toDate();
            }
            catch {
                resultMoment = moment.utc();
                console.warn("String is not a valid moment, using current time.");
            }
        }

        return resultMoment
    }

    _getStops() {
        const properties = this._properties;
        const stopsProperties = properties.stops;
        let stops = null;
        if (stopsProperties) {
            if (stopsProperties.dates) {
                stops = {};
                try {
                    stops.dates = stopsProperties.map((dateString) => moment(dateString).toDate());
                } catch {
                    stops = {};
                    const defaultStopCount = 10;
                    stops.count = stopsProperties.count || defaultStopCount;
                    console.warn("No valid stop definition given in dates. Using 10 stops")
                }
            } else if (stopsProperties.moment) {
                stops = {};
                const dates = [];
                let momentObj = moment().utc();
                stopsProperties.moment.forEach((timeStop) => {
                    if (!timeStop) {
                        // do nothing
                    } else if (typeof timeStop === 'string') {
                        try {
                            momentObj = moment(timeStop);
                        }
                        catch {
                            stops = {};
                            const defaultStopCount = 10;
                            stops.count = stopsProperties.count || defaultStopCount;
                            console.warn("No valid stop definition given in string. Using 10 stops");
                        }
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
                        try {
                            start = moment(stopsProperties.timeExtent.start);
                        } catch {
                            console.warn("Time extent in stopsProperties has no valid start component.");
                        }
                    }
                    if (stopsProperties.timeExtent.end) {
                        try {
                            end = moment(stopsProperties.timeExtent.end);
                        } catch {
                            console.warn("Time extent in stopsProperties has no valid end component.");
                        }
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

    _getValues() {
        const properties = this._properties;
        if (properties.values) {
            return properties.values.map((dateString) => this._getDate(dateString));
        } else {
            return null;
        }
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
                mapWidgetModel.watch("view", ({ value: view }) => {
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
