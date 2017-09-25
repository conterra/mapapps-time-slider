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
define(["dojo/_base/lang", "dojo/_base/declare", "dojo/_base/array", "dojo/aspect", "dojo/date/locale", "esri/dijit/TimeSlider", "ct/mapping/geometry", "ct/mapping/mapcontent/ServiceTypes"],
    function (d_lang, declare, d_array, d_aspect, d_locale, TimeSlider, geometry, ServiceTypes) {
        return declare([],
            {
                activate: function () {
                    var properties = this._properties;
                    var timeSliderOptions = d_lang.mixin({}, properties.timeSliderOptions || {});
                    try {
                        // create esri layer object
                        var timeSlider = this._timeSlider = new TimeSlider({
                            excludeDataAtLeadingThumb: timeSliderOptions.excludeDataAtLeadingThumb,
                            excludeDataAtTrailingThumb: timeSliderOptions.excludeDataAtTrailingThumb
                        });
                        this._esriMap.setTimeSlider(timeSlider);

                        // create time stops
                        var timeStopsOptions = properties.timeStopsOptions;
                        if (timeStopsOptions) {
                            // create time extent
                            var timeExtent = timeStopsOptions.timeExtent ? geometry.createTimeExtent(timeStopsOptions.timeExtent) : null;
                            if (timeStopsOptions.timeStops && timeStopsOptions.timeStops.length > 0) {
                                var timeStops = d_array.map(timeStopsOptions.timeStops, function (time) {
                                    return new Date(time);
                                });
                                timeSlider.setTimeStops(timeStops);
                            } else if (timeStopsOptions.timeIntervalCount && timeStopsOptions.timeIntervalCount > 1) {
                                timeSlider.createTimeStopsByCount(timeExtent, timeStopsOptions.timeIntervalCount);
                            } else {
                                timeSlider.createTimeStopsByTimeInterval(timeExtent, timeStopsOptions.timeIntervalLength, timeStopsOptions.timeIntervalUnits || {});
                            }
                        }

                        // set properties
                        timeSlider.setThumbCount(timeSliderOptions.thumbCount || 1);
                        timeSlider.setThumbIndexes(timeSliderOptions.thumbIndexes || [0, 1]);
                        timeSlider.setThumbMovingRate(timeSliderOptions.thumbMovingRate || 1000);
                        timeSlider.setLoop(timeSliderOptions.loop || false);
                        timeSlider.singleThumbAsTimeInstant(!timeSliderOptions.cumulative);

                        // create labels
                        var opts = {
                            selector: timeSliderOptions.labelSelector || "date time",
                            datePattern: timeSliderOptions.labelDatePattern || "yyyy-MM-dd",
                            timePattern: timeSliderOptions.labelTtimePattern || "HH:mm:ss"
                        };
                        var labels = d_array.map(timeSlider.timeStops, function (timeStop) {
                            return d_locale.format(timeStop, opts);
                        }, this);
                        timeSlider.setLabels(labels);

                        // start timeslider on startup
                        if (timeSliderOptions.playOnStartup) {
                            d_aspect.after(timeSlider, "startup", function () {
                                timeSlider.play();
                            });
                        }

                        // get service / services
                        var service = properties.service;
                        if (!Array.isArray(service)) {
                            service = [service];
                        }
                        d_array.forEach(service, function (service) {
                            var mapModelNodeId = service.id;
                            if (service.layer) {
                                mapModelNodeId = mapModelNodeId + "/" + service.layer;
                            }
                            var node = this._mapModel.getNodeById(mapModelNodeId);
                            if (!node) {
                                throw Error("TileSliderFactory: Service/Layer not found!");
                            }
                            if (node.get("type") === ServiceTypes.AGS_FEATURE) {
                                var esriLayer = this._esriMapReference.getEsriLayer(node);
                                esriLayer.setTimeDefinition(timeExtent);
                            }
                        }, this);
                    } catch (e) {
                        throw Error("TileSliderFactory: Cannot create time slider!", e);
                    }
                },
                createInstance: function () {
                    return this._timeSlider;
                },
                deactivate: function () {
                    var timeSlider = this._timeSlider;
                    var esriMap = this._esriMap;
                    esriMap.setTimeSlider(null);
                    esriMap.setTimeExtent(null);
                    if (timeSlider) {
                        // try/catch required due to a problem with destroying of widget
                        try {
                            timeSlider.destroyRecursive();
                        } catch (e) {
                            console.error("TimeSliderFactory: Error destroying timeslider", e);
                        }
                        this._timeSlider = null;
                    }
                }
            });
    });