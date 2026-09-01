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

import Widget from "@arcgis/core/widgets/Widget";
import { tsx } from "@arcgis/core/widgets/support/widget";
import TimeSlider from "@arcgis/core/widgets/TimeSlider";
import Vue from "apprt-vue/Vue";

import TimeSliderDatepickers from "./TimeSliderDatepickers.ts.vue";

interface TimeSliderWidgetContainerProperties extends __esri.WidgetProperties {
    timeSlider: TimeSlider;
    showDatepickers?: boolean;
    startDateLabel?: string;
    endDateLabel?: string;
}

const CSS = {
    base: "timeslider-container",
    host: "timeslider-container__host"
};

class TimeSliderWidgetContainer extends Widget {

    timeSlider: TimeSlider;
    showDatepickers: boolean;
    startDateLabel: string;
    endDateLabel: string;
    private _datepickersVm: any;

    constructor(properties: TimeSliderWidgetContainerProperties) {
        super(properties);
        // Assign explicitly: uninitialized class fields are defined (to `undefined`) after
        // super() returns, which would otherwise clobber the values Accessor just applied.
        this.timeSlider = properties.timeSlider;
        this.showDatepickers = properties.showDatepickers ?? false;
        this.startDateLabel = properties.startDateLabel ?? "Start date";
        this.endDateLabel = properties.endDateLabel ?? "End date";
    }

    render(): tsx.JSX.Element {
        return (
            tsx("div", { class: CSS.base }, [
                this.showDatepickers ? tsx("div", {
                    key: "datepickers-host",
                    afterCreate: this.attachDatepickers.bind(this)
                }) : null,
                tsx("div", {
                    key: "timeslider-host",
                    class: CSS.host,
                    afterCreate: this.attachTimeSlider.bind(this)
                })
            ])
        );
    }

    private attachTimeSlider(element: HTMLDivElement): void {
        this.timeSlider.container = element;
    }

    private attachDatepickers(element: HTMLDivElement): void {
        // Mounted detached (no target) and appended manually, rather than letting Vue
        // mount-and-replace `element` directly -- keeps this outside of Esri's own vdom
        // bookkeeping for the tsx tree entirely, matching how the TimeSlider itself is
        // attached above via plain container assignment instead of vnode children.
        const vm: any = new Vue(TimeSliderDatepickers);
        vm.timeSlider = this.timeSlider;
        vm.startDateLabel = this.startDateLabel;
        vm.endDateLabel = this.endDateLabel;
        vm.$mount();
        element.appendChild(vm.$el);
        this._datepickersVm = vm;
    }

    destroy(): void {
        this._datepickersVm?.$destroy();
        super.destroy();
    }
}

export default TimeSliderWidgetContainer;
