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
import {declare} from "apprt-core/Mutable";
import TimeExtent from "esri/TimeExtent";
import FeatureFilter from "esri/views/layers/support/FeatureFilter";
import Locale from "ct/Locale";
import moment from "esri/moment";

export default declare({

    locale: "en",
    layers: [],
    selectedLayerIds: [],
    timeStops: [],
    startTimeStopId: 0,
    endTimeStopId: 1,

    activate() {
        this.locale = Locale.getCurrent().getLanguage();
        let layers = this.layers = this._getLayers();
        if (layers.length) {
            this.selectedLayerIds = [layers[0].id];
        }

        let mapWidgetModel = this._mapWidgetModel;
        let map = mapWidgetModel.map;
        map.layers.on("after-changes", () => {
            this.layers = this._getLayers();
            this.selectedLayerIds = [this.layers[0].id];
        });
        this.timeStops = this._getTimeStops();
    },

    setFilter() {
        let start = this.timeStops[this.startTimeStopId].date;
        let end = this.timeStops[this.endTimeStopId].date;
        const timeExtent = new TimeExtent({
            start: start,
            end: end
        });

        let filter = new FeatureFilter({
            timeExtent: timeExtent
        });

        let layerIds = this.selectedLayerIds;
        layerIds.forEach((layerId) => {
            this._setFilterToLayer(layerId, filter);
        })
    },

    resetFilter() {
        let filter = new FeatureFilter();

        let layerIds = this.selectedLayerIds;
        layerIds.forEach((layerId) => {
            this._setFilterToLayer(layerId, filter);
        })
    },

    _setFilterToLayer(layerId, filter) {
        let layer = this._getLayerById(layerId);
        if (layer) {
            let mapWidgetModel = this._mapWidgetModel;
            let view = mapWidgetModel.view;
            view && view.whenLayerView(layer).then(function (layerView) {
                layerView.filter = filter;
            });
        }
    },

    _getLayers() {
        let mapWidgetModel = this._mapWidgetModel;
        let map = mapWidgetModel.map;
        let layers = map.layers.toArray();
        let featureLayers = layers.filter((layer) => {
            return layer.type === "feature";
        });
        return featureLayers.map((layer) => {
            return {
                id: layer.id,
                title: layer.title
            }
        })
    },

    _getLayerById(layerId) {
        let mapWidgetModel = this._mapWidgetModel;
        let map = mapWidgetModel.map;
        return map.findLayerById(layerId);
    },

    _getTimeStops() {
        let timeStops = [];
        let properties = this._properties;
        let timeStopsOptions = properties.timeStopsOptions;
        if (timeStopsOptions.timeStops && timeStopsOptions.timeStops.length) {
            timeStops = timeStopsOptions.timeStops.map((stop) => {
                let momentObj = moment(stop);
                return this._getTimeStop(momentObj);
            })
        } else if (timeStopsOptions.timeStopCount) {
            let timeStopCount = timeStopsOptions.timeStopCount || 10;
            let timeExtent = timeStopsOptions.timeExtent;
            let startMoment = moment(timeExtent.start);
            let endMoment = moment(timeExtent.end);
            let startTimestamp = startMoment.valueOf();
            let endTimestamp = endMoment.valueOf();
            let interval = (endTimestamp - startTimestamp) / (timeStopCount - 1);
            timeStops.push(this._getTimeStop(startMoment));
            for (let i = 1; i < timeStopCount - 1; i++) {
                let timestamp = startTimestamp + interval * i;
                let currentMoment = moment(timestamp);
                timeStops.push(this._getTimeStop(currentMoment));
            }
            timeStops.push(this._getTimeStop(endMoment));
        } else if (timeStopsOptions.timeIntervalLength > 0 && timeStopsOptions.timeIntervalUnits) {
            let timeIntervalLength = timeStopsOptions.timeIntervalLength || 1;
            let timeIntervalUnits = timeStopsOptions.timeIntervalUnits || "days";
            let timeExtent = timeStopsOptions.timeExtent;
            let endMoment = moment(timeExtent.end);
            let momentObj = moment(timeExtent.start);
            while (momentObj.isBefore(endMoment)) {
                timeStops.push(this._getTimeStop(momentObj));
                momentObj = momentObj.add(timeIntervalLength, timeIntervalUnits);
            }
            timeStops.push(this._getTimeStop(endMoment));
        }
        return timeStops;
    },

    _getTimeStop(momentObj) {
        return {date: momentObj.toDate(), label: momentObj.format("DD.MM")}
    }
})
