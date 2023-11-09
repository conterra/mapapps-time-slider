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
const ID = "timeslider";

import EsriDijit from "esri-widgets/EsriDijit";

export default class TimeSliderTocActionDefinitionFactory {

    #bundleContext = undefined;
    #serviceRegistration = undefined;

    activate(componentContext) {
        this.#bundleContext = componentContext.getBundleContext();
    }

    constructor() {
        this.supportedIds = [ID];
    }

    createDefinitionById(id) {
        if(id !== ID){
            return;
        }
        const i18n = this._i18n.get();
        const timeSliderWidgetController = this._timeSliderWidgetController;
        const that = this;

        return {
            id: "timeslider",
            type: "button",
            label: i18n.tocActionLabel,
            icon: "icon-editor-table",

            isVisibleForItem(tocItem) {
                const ref = tocItem.ref;
                return typeof ref.timeInfo !== "undefined" && ref.timeInfo !== null;
            },

            trigger(tocItem) {
                const layer = tocItem.ref;
                const timeSliderProperties = tocItem.ref.timeSlider;

                if (layer.timeExtent) {
                    timeSliderProperties.timeExtent.start = String(layer.timeExtent.start);
                    timeSliderProperties.timeExtent.end = String(layer.timeExtent.end);
                }
                const controller = timeSliderWidgetController;
                const timeSliderWidget = controller.getWidget(timeSliderProperties);
                // TODO: clean watch on close
                timeSliderWidget.watch("timeExtent", (value) => {
                    // update layer view filter to reflect current timeExtent
                    layer.timeExtent = value;
                });
                const widget = new EsriDijit(timeSliderWidget);
                const serviceProperties = {
                    "widgetRole": "layerTimeSliderWidget"
                };
                const interfaces = ["dijit.Widget"];
                that.#serviceRegistration = that.#bundleContext.registerService(interfaces, widget, serviceProperties);
            }
        };
    }

}
