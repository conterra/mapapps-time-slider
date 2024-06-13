/*
 * Copyright (C) 2024 con terra GmbH (info@conterra.de)
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
import TimeSliderWidgetController from "../TimeSliderWidgetController";
import { expect } from "chai";

function createComponent() {
    const controller = new TimeSliderWidgetController();
    controller._properties = {
        timeExtent: { start: undefined, end: undefined },
        fullTimeExtent: { start: undefined, end: undefined }
    };
    return controller;
}

describe(module.id, () => {
    it("should add labelFormatFunction to widget", () => {
        const myFormatter = () => null;
        const component = createComponent();
        component.setLabelFormatFunction(myFormatter);

        const actual = component.getWidget();

        expect(actual.labelFormatFunction).to.equal(myFormatter);
    });

    it("should be able to create the widget without labelFormatFunction", () => {
        const component = createComponent();
        const actual = component.getWidget();

        expect(actual).to.be.an("object");
    });
});
