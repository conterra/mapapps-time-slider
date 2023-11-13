///
/// Copyright (C) 2023 con terra GmbH (info@conterra.de)
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
import EsriDijit from "esri-widgets/EsriDijit";
import Binding, { Bindable, Binding as BindingType } from 'apprt-binding/Binding';

import { MapWidgetModel } from "map-widget/api";
import type TimeSliderWidgetController from "./TimeSliderWidgetController";

export default class TimeSliderWidgetFactory {

    private binding: BindingType;
    private _mapWidgetModel: InjectedReference<MapWidgetModel>;
    private _timeSliderWidgetController: TimeSliderWidgetController;

    public deactivate(): void {
        this.deactivateBinding();
    }

    public createInstance(): any {
        return this.getWidget();
    }

    private getWidget(): any {
        const timeSliderWidget = this._timeSliderWidgetController.getWidget();
        const mapWidgetModel = this._mapWidgetModel;
        // new Bindable
        this.binding = Binding.for(timeSliderWidget as Bindable, mapWidgetModel)
            .syncToLeft("view")
            .enable()
            .syncToLeftNow();

        //new new without void
        return new (EsriDijit as any)(timeSliderWidget);
    }

    private deactivateBinding(): void {
        this.binding.unbind();
        this.binding = undefined;
    }
}
