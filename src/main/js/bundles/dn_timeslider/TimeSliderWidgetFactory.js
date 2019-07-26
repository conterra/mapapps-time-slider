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
        return new VueDijit(this.vm);
    }

    _initComponent() {
        const vm = this.vm = new Vue(TimeSliderWidget);
        let model = this._timeSliderWidgetModel;
        vm.i18n = this._i18n.get().ui;

        // listen to view model methods
        vm.$on('startup', () => {
            model.startup();
        });
        vm.$on('setFilter', () => {
            model.setFilter();
        });
        vm.$on('resetFilter', () => {
            model.resetFilter();
        });
        vm.$on('nextTimeStop', () => {
            model.nextTimeStop();
        });
        vm.$on('previousTimeStop', () => {
            model.previousTimeStop();
        });
        vm.$on('play', () => {
            model.play();
        });
        vm.$on('stop', () => {
            model.stop();
        });

        Binding.for(vm, model)
            .syncAll("selectedLayerIds", "startTimeStopIndex", "endTimeStopIndex")
            .syncAllToLeft("timeStops", "locale", "layers", "playSlider", "showLayerSelection")
            .enable()
            .syncToLeftNow();
    }
}
