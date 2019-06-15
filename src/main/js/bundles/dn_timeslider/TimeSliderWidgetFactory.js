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
import TimeSliderWidget from "./TimeSliderWidget.vue";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import Binding from "apprt-binding/Binding";

export default class TimeSliderWidgetFactory {

    activate() {
        this._initComponent();
    }

    createInstance() {
        return new VueDijit(this.widget);
    }

    _initComponent() {
        const widget = this.widget = new Vue(TimeSliderWidget);
        let model = this._timeSliderWidgetModel;
        widget.i18n = this._i18n.get().ui;

        // listen to view model methods
        widget.$on('startup', () => {
            model.startup();
        });
        widget.$on('setFilter', () => {
            model.setFilter();
        });
        widget.$on('resetFilter', () => {
            model.resetFilter();
        });
        widget.$on('nextTimeStop', () => {
            model.nextTimeStop();
        });
        widget.$on('previousTimeStop', () => {
            model.previousTimeStop();
        });
        widget.$on('play', () => {
            model.play();
        });
        widget.$on('stop', () => {
            model.stop();
        });

        Binding.for(widget, model)
            .syncAll("locale", "layers", "selectedLayerIds", "timeStops", "startTimeStopIndex", "endTimeStopIndex", "playSlider")
            .enable()
            .syncToLeftNow();
    }
}
