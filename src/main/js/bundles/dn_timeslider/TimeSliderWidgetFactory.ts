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

import { InjectedReference } from "apprt-core/InjectedReference";
import { createDijit, EsriDijit } from "esri-widgets/EsriDijit";

import type TimeSliderWidgetController from "./TimeSliderWidgetController";
import type { MessagesReference } from "./nls/bundle";
import TimeSliderWidgetContainer from "./TimeSliderWidgetContainer";

export default class TimeSliderWidgetFactory {

    private _timeSliderWidgetController: InjectedReference<TimeSliderWidgetController>;
    private _i18n: InjectedReference<MessagesReference>;

    public createInstance(): any {
        return this.getWidget();
    }

    private getWidget(): EsriDijit<TimeSliderWidgetContainer> {
        const controller = this._timeSliderWidgetController!;
        const i18n = this._i18n?.get();
        const timeSliderWidget = controller.getWidget();

        const timeSliderContainer = new TimeSliderWidgetContainer({
            timeSlider: timeSliderWidget,
            showDatepickers: controller.isShowDatepickersEnabled(),
            startDateLabel: i18n?.startDateLabel,
            endDateLabel: i18n?.endDateLabel
        });

        return createDijit(timeSliderContainer);
    }
}
