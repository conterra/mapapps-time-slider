/*
 * Copyright (C) 2023 con terra GmbH (info@conterra.de)
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
import ct_util from "ct/ui/desktop/util";
import async from "apprt-core/async";

const ID = "timeslider";
const DELAY = 1000;

import EsriDijit from "esri-widgets/EsriDijit";

export default class TimeSliderTocActionDefinitionFactory {

    #bundleContext = undefined;
    #timeExtentWatcher = undefined;
    #serviceRegistration = undefined;

    activate(componentContext) {
        this.#bundleContext = componentContext.getBundleContext();
    }

    constructor() {
        this.supportedIds = [ID];
    }

    createDefinitionById(id) {
        if (id !== ID) {
            return;
        }
        const i18n = this._i18n.get();
        const timeSliderWidgetController = this._timeSliderWidgetController;
        const that = this;

        return {
            id: "timeslider",
            type: "button",
            label: i18n.tocActionLabel,
            icon: "icon-time-forward",

            isVisibleForItem(tocItem) {
                const ref = tocItem.ref;
                return typeof ref.timeInfo !== "undefined" && ref.timeInfo !== null;
            },

            trigger(tocItem) {
                const layer = tocItem.ref;
                const controller = timeSliderWidgetController;
                let timeSliderProperties = tocItem.ref.timeSlider;

                if (layer.timeExtent) {
                    if (!timeSliderProperties) {
                        timeSliderProperties = {};
                        timeSliderProperties.timeExtent = {};
                        timeSliderProperties.fullTimeExtent = {};
                    }
                    timeSliderProperties.timeExtent.start = layer.timeExtent.start;
                    timeSliderProperties.timeExtent.end = layer.timeExtent.end;
                    timeSliderProperties.fullTimeExtent = layer.timeInfo.fullTimeExtent;
                    timeSliderProperties.stops = layer.stops;
                }

                const timeSliderWidget = controller.getWidget(timeSliderProperties);
                that.#timeExtentWatcher = timeSliderWidget.watch("timeExtent", (value) => {
                    layer.timeExtent = value;
                });
                this.supressLayerDefaults(layer, timeSliderProperties, timeSliderWidget);
                const widget = new EsriDijit(timeSliderWidget);
                const serviceProperties = {
                    "widgetRole": "layerTimeSliderWidget"
                };
                const interfaces = ["dijit.Widget"];
                that.#serviceRegistration = that.#bundleContext.registerService(interfaces, widget, serviceProperties);

                async(() => {
                    const window = ct_util.findEnclosingWindow(timeSliderWidget);
                    window?.on("Hide", () => {
                        that.#timeExtentWatcher.remove();
                        that.#timeExtentWatcher = undefined;
                    });
                }, DELAY);
            },

            supressLayerDefaults(layer, props, widget) {
                if (props) {
                    layer.timeInfo.fullTimeExtent = props.fullTimeExtent;
                    layer.stops = props.stops;
                } else if (widget.fullTimeExtent) {
                    layer.timeInfo.fullTimeExtent = widget.fullTimeExtent;
                    layer.stops = widget.stops;
                }
            }
        };
    }

}
