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

export default class TimeSliderWidgetFactory {

    #timeSliderWidget = undefined;
    #initialTimeExtent = undefined;

    activate() {
        this._getView().then((view) => {
            // check for viewTimeExtent property; if undefined don't set new view's timeExtent
            if (this._properties.viewTimeExtent) {
                view.timeExtent = this._getViewTimeExtent();
            }
            this.#initialTimeExtent = view.timeExtent;
        });
    }

    deactivate() {
        this._resetTimeExtent();
        this._destroyWidget();
    }

    /**
     * Gets called when the tool gets activated
     */
    onToolActivated() {
        this._getView().then((view) => {
            view.timeExtent = this.#timeSliderWidget.timeExtent;
            if (this._properties.playOnStartup) {
                this.#timeSliderWidget.play();
            }
        });
    }

    /**
     * Gets called when the tool gets deactivated
     */
    onToolDeactivated() {
        this.#timeSliderWidget.stop();
        this._resetTimeExtent();
    }

    /**
     * Returns the TimeSliderWidget
     *
     * @returns {TimeSlider}
     */
    getWidget() {
        const timeSliderProperties = this.getTimeSliderProperties();
        return this.#timeSliderWidget = new TimeSlider(timeSliderProperties);
    }

    /**
     * Destroys the widget
     *
     * @private
     */
    _destroyWidget() {
        this.#timeSliderWidget.destroy();
        this.#timeSliderWidget = undefined;
    }

    /**
     * Generated the TimeSlider configuration
     *
     * @returns {*} TimeSlider configuration
     */
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
     * @returns {{start, end}} An object with start and end date
     * @private
     */
    _getFullTimeExtent() {
        const properties = this._properties;
        const fullTimeExtent = properties.fullTimeExtent;

        return this._getTimeExtent(fullTimeExtent);
    }

    /**
     * Function used to access viewTimeExtent properties and call _getTimeExtent()
     *
     * @returns {{start, end}} An object with start and end date
     * @private
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
     * @returns {{start, end}} Object containing two dates, constructed using _constructMoment()
     * @private
     */
    _getTimeExtent(referenceTimeExtent) {
        const start = this._constructDate(referenceTimeExtent.start);
        const end = this._constructDate(referenceTimeExtent.end);

        return {
            start: start,
            end: end
        }
    }

    /**
     * Function used to construct a moment from properties defined in manifest.json/app.json
     * @param {Object} referenceMoment Moment properties extracted from referenceTimeExtent
     * @returns Moment constructed according to parameters
     * @private
     */
    _constructDate(referenceMoment) {
        let momentObj = moment.utc();
        // Case: Property is either "now", undefined or null
        if (referenceMoment === "now" || !referenceMoment) {
            // do nothing because moment object has already the current date
        } else if (Array.isArray(referenceMoment)) {
            referenceMoment.forEach((m, i) => {
                // Case: Property is an array and leading element is a string
                if (typeof m === 'string' && i === 0) {
                    momentObj = moment(m).utc();
                    if (momentObj && !momentObj.isValid()) {
                        momentObj = moment().utc();
                        console.warn("Invalid timeExtent definition. Use current time.")
                    }
                } else {
                    try {
                        momentObj[m.method].apply(momentObj, m.args);
                    } catch {
                        console.warn("Invalid moment definition in timeExtent definition. Use current time.")
                    }
                }
            });
        }
        // Case: Property is a string but not "now"
        else if (typeof referenceMoment === 'string' && referenceMoment !== "now") {
            momentObj = moment(referenceMoment).utc();
            if (momentObj && !momentObj.isValid()) {
                momentObj = moment.utc();
                console.warn("Invalid timeExtent definition. Use current time.")
            }
        }

        return momentObj.toDate();
    }

    /**
     * Generates stops values for the TimeSlider
     *
     * @returns Object that contains the stop configuration
     * @private
     */
    _getStops() {
        const properties = this._properties;
        const stopsProperties = properties.stops;
        const defaultStopCount = 10;
        let stops = null;

        // If stop properties are defined
        if (stopsProperties) {
            // Case: Stops are defined using dates
            if (stopsProperties.dates) {
                stops = {};
                const dates = [];
                let momentObj;
                stopsProperties.dates.forEach((dateString) => {
                    momentObj = moment(dateString).utc();
                    // Push valid dates
                    if (momentObj?.isValid()) {
                        dates.push(momentObj.toDate());
                    }
                    // Warn for invalid dates and skip date
                    else {
                        console.warn("Invalid date stop definition. Skip value.")
                    }
                });
                stops.dates = dates;
            }
            // Check if stops are defined using moments and calculations
            else if (stopsProperties.moment) {
                stops = {};
                const dates = [];
                let momentObj = moment().utc();
                stopsProperties.moment.forEach((timeStop) => {
                    // Check if leading timeStop element is a string
                    if (typeof timeStop === 'string') {
                        momentObj = moment(timeStop).utc();
                        if (momentObj?.isValid()) {
                            dates.push(momentObj.toDate());
                        } else {
                            momentObj = moment.utc();
                            console.warn("Invalid stop definition at start of the array. Use current time.")
                        }
                    }
                    // stop is an array
                    else if (Array.isArray(timeStop)) {
                        timeStop.forEach((time) => {
                            try {
                                momentObj[time.method].apply(momentObj, time.args);
                                if (momentObj?.isValid()) {
                                    dates.push(momentObj.toDate());
                                }
                            } catch {
                                console.warn("Invalid stop definition in moment array. Skip array entry.")
                            }
                        });
                    }
                    // stop is a single object
                    else {
                        try {
                            momentObj[timeStop.method].apply(momentObj, timeStop.args);
                            if (momentObj?.isValid()) {
                                dates.push(momentObj.toDate());
                            }
                        } catch {
                            console.warn("Invalid stop definition in moment array. Skip array entry.")
                        }
                    }
                });
                stops.dates = dates;
            }
            // Case: Stops are defined by count or interval
            else {
                // Case: Stops defined by count
                if (stopsProperties.count) {
                    stops = {};
                    stops.count = stopsProperties.count || defaultStopCount;
                }
                // Case: Stops defined by interval
                else if (stopsProperties.interval) {
                    stops = {};
                    stops.interval = {
                        value: stopsProperties.interval.value || 1,
                        unit: stopsProperties.interval.unit || "years"
                    }
                }
                // Case: No definition provided. Use 10 stops instead
                else {
                    stops = {};
                    stops.count = defaultStopCount;
                }
                // Case: Stops defined by start and end time and interval/count
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
                        }
                    }
                }
            }
        }
        return stops;
    }

    /**
     * Generates the initial values for the TimeSlider
     *
     * @returns {Array} Values for the TimeSlider
     * @private
     */
    _getValues() {
        const properties = this._properties;
        if (properties.values) {
            return properties.values.map((dateString) => this._getDate(dateString));
        } else {
            return null;
        }
    }

    /**
     * Converts a date string to a Date Object via moment
     *
     * @param config Date string
     * @returns {Date}
     * @private
     */
    _getDate(config) {
        return moment(config).toDate();
    }

    /**
     * Returns the current View of the MapWidgetModel
     *
     * @returns {Promise<View>} The current View
     * @private
     */
    _getView() {
        const mapWidgetModel = this._mapWidgetModel;
        return new Promise((resolve) => {
            if (mapWidgetModel.view) {
                resolve(mapWidgetModel.view);
            } else {
                mapWidgetModel.watch("view", ({value: view}) => {
                    resolve(view);
                });
            }
        });
    }

    /**
     * Resets the initial TimeExtent value of the View
     *
     * @private
     */
    _resetTimeExtent() {
        this._getView().then((view) => {
            view.timeExtent = this.#initialTimeExtent;
        })
    }
}
