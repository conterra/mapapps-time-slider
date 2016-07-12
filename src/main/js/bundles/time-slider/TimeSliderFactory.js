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
                    var timeSliderOpts = d_lang.mixin({}, properties.timeSliderOpts || {});
                    try {
                        var timeSlider = this._timeSlider = new TimeSlider(timeSliderOpts);
                        var layout = properties.sliderLayout;
                        this._esriMap.setTimeSlider(timeSlider);
                        if (layout) {
                            var timeExtent = layout.timeExtent ? geometry.createTimeExtent(layout.timeExtent) : null;
                            if (!layout.timeStops) {
                                timeSlider.createTimeStopsByTimeInterval(timeExtent, layout.stops, layout.unit, layout.opts || {});
                            } else {
                                timeSlider.setTimeStops(layout.timeStops)
                            }
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
                        }
                        timeSlider.setThumbCount(timeSliderOpts.thumbCount || 1);
                        timeSlider.setThumbIndexes(timeSliderOpts.thumbIndexes || [0, 1]);
                        timeSlider.setThumbMovingRate(timeSliderOpts.thumbMovingRate || 1000);
                        timeSlider.setLoop(timeSliderOpts.loop || false);
                        var opts = {
                            selector: layout.selector || "date time",
                            datePattern: layout.datePattern || "yyyy-MM-dd",
                            timePattern: layout.timePattern || "HH:mm:ss"
                        }
                        var labels = d_array.map(timeSlider.timeStops, function (timeStop) {
                            var timeStopString = d_locale.format(timeStop, opts);
                            return timeStopString;
                        }, this);
                        timeSlider.setLabels(labels);
                        timeSlider.singleThumbAsTimeInstant(!timeSliderOpts.cumulative || false);
                        if (timeSliderOpts.playOnStartup) {
                            d_aspect.after(timeSlider, "startup", function () {
                                timeSlider.play();
                            });
                        }
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