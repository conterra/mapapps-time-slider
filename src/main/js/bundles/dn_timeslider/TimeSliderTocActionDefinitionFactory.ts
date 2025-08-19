///
/// Copyright (C) 2025 con terra GmbH (info@conterra.de)
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

import type { InjectedReference } from "apprt-core/InjectedReference";
import ct_util from "ct/ui/desktop/util";
import async from "apprt-core/async";
import EsriDijit from "esri-widgets/EsriDijit";

import { MessagesReference } from "./nls/bundle";
import type TimeSliderWidgetController from "./TimeSliderWidgetController";
import { ExtendedLayer } from "../../types/ExtendedLayer";

export default class TimeSliderTocActionDefinitionFactory {
    public delay = 1000;
    public supportedIds: Array<string>;

    private Id = "timeslider";
    private bundleContext: InjectedReference<any> = undefined;
    private timeExtentWatcher: InjectedReference<any> = undefined;
    private serviceRegistration: InjectedReference<any> = undefined;
    private _i18n: InjectedReference<MessagesReference>;
    private _timeSliderWidgetController: TimeSliderWidgetController;

    public activate(componentContext: InjectedReference<any>): void {
        this.bundleContext = componentContext.getBundleContext();
    }

    public constructor() {
        this.supportedIds = [this.Id];
    }

    public createDefinitionById(id: string): any {
        if (id !== this.Id) {
            return;
        }
        const i18n = this._i18n.get();
        const timeSliderWidgetController = this._timeSliderWidgetController;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;

        return {
            id: "timeslider",
            type: "button",
            label: i18n.tocActionLabel,
            icon: "icon-time-forward",

            isVisibleForItem(tocItem: any) {
                const ref = tocItem.ref;
                return typeof ref.timeInfo !== "undefined" && ref.timeInfo !== null && !!ref.timeSlider;
            },

            trigger(tocItem: any) {
                if (that.serviceRegistration) {
                    that.serviceRegistration.unregister();
                    that.serviceRegistration = null;
                }
                const layer = tocItem.ref as ExtendedLayer;
                const controller = timeSliderWidgetController;
                const timeSliderProperties = tocItem.ref.timeSlider;

                layer.visible = true;
                layer.useViewTime = false;

                if (layer.timeExtent && !layer._initialTimeExtent) {
                    layer._initialTimeExtent = layer.timeExtent;
                }
                if (layer._lastTimeExtent) {
                    layer.timeExtent = layer._lastTimeExtent;
                    timeSliderProperties.timeExtent = layer._lastTimeExtent;
                }

                const timeSliderWidget = controller.getWidget(timeSliderProperties);
                that.timeExtentWatcher = timeSliderWidget.watch("timeExtent", (value) => {
                    layer.timeExtent = value;
                });
                const widget = new (EsriDijit as any)(timeSliderWidget);
                const serviceProperties = {
                    "widgetRole": "layerTimeSliderWidget"
                };
                const interfaces = ["dijit.Widget"];
                that.serviceRegistration = that.bundleContext.registerService(interfaces, widget, serviceProperties);

                async(() => {
                    const window = ct_util.findEnclosingWindow(timeSliderWidget);
                    window.set("title", `${window.title} - ${layer.title}`);
                    window?.on("Hide", () => {
                        that.timeExtentWatcher.remove();
                        that.timeExtentWatcher = undefined;
                        layer._lastTimeExtent = layer.timeExtent;
                        layer.timeExtent = layer._initialTimeExtent;
                        layer.useViewTime = true;
                    });
                }, that.delay);
            }
        };
    }

}
