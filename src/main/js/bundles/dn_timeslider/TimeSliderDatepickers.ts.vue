<!--

    Copyright (C) 2025 con terra GmbH (info@conterra.de)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<template>
    <div class="timeslider-container__datepickers">
        <div class="timeslider-container__datepicker timeslider-container__datepicker--start">
            <v-menu
                v-model="startMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
            >
                <v-text-field
                    slot="activator"
                    :value="startDateTimeFormatted"
                    prepend-icon="event"
                    readonly
                    hide-details
                ></v-text-field>
                <v-card>
                    <v-date-picker
                        v-model="startDate"
                        :min="fullMin"
                        :max="fullMax"
                        @input="onStartDateInput"
                    ></v-date-picker>
                    <v-combobox
                        v-model="startTime"
                        :items="timeOptions"
                        class="timeslider-container__time-combobox"
                        prepend-icon="access_time"
                        hide-details
                        @change="onStartTimeChange"
                    ></v-combobox>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="startMenu = false">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
        </div>
        <div class="timeslider-container__datepicker timeslider-container__datepicker--end">
            <v-menu
                v-model="endMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
            >
                <v-text-field
                    slot="activator"
                    :value="endDateTimeFormatted"
                    prepend-icon="event"
                    readonly
                    hide-details
                ></v-text-field>
                <v-card>
                    <v-date-picker
                        v-model="endDate"
                        :min="fullMin"
                        :max="fullMax"
                        @input="onEndDateInput"
                    ></v-date-picker>
                    <v-combobox
                        v-model="endTime"
                        :items="timeOptions"
                        class="timeslider-container__time-combobox"
                        prepend-icon="access_time"
                        hide-details
                        @change="onEndTimeChange"
                    ></v-combobox>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="endMenu = false">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "apprt-vue/Vue";
import TimeExtent from "@arcgis/core/TimeExtent";
import moment from "moment";

import type TimeSlider from "@arcgis/core/widgets/TimeSlider";

// Native <input type="date"> forces yyyy-mm-dd display, following the browser/OS locale
// only. Vuetify's v-date-picker/v-text-field own their display text instead, so the
// widget can show a fixed dd.mm.yyyy format regardless of locale.
const ISO_DATE_FORMAT = "YYYY-MM-DD";
const ISO_TIME_FORMAT = "HH:mm";
const ISO_DATETIME_FORMAT = `${ISO_DATE_FORMAT} ${ISO_TIME_FORMAT}`;
const DISPLAY_FORMAT = "DD.MM.YYYY HH:mm";

const TIME_STEP_MINUTES = 30;

// 24h time-of-day options at a fixed interval, e.g. "00:00", "00:30", "01:00", ... shown
// as v-combobox dropdown suggestions; the field itself still accepts free-typed values.
const TIME_OPTIONS: string[] = (() => {
    const options: string[] = [];
    for (let minutes = 0; minutes < 24 * 60; minutes += TIME_STEP_MINUTES) {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        options.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }
    return options;
})();

type DateExtentPart = "start" | "end";

export default Vue.extend({
    data() {
        return {
            timeSlider: undefined as TimeSlider | undefined,
            startDateLabel: "",
            endDateLabel: "",
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
            fullMin: undefined as string | undefined,
            fullMax: undefined as string | undefined,
            startMenu: false,
            endMenu: false,
            timeOptions: TIME_OPTIONS,
            _timeExtentHandle: undefined as any,
            _fullTimeExtentHandle: undefined as any
        };
    },
    computed: {
        startDateTimeFormatted(): string {
            return this.formatForDisplay(this.startDate, this.startTime);
        },
        endDateTimeFormatted(): string {
            return this.formatForDisplay(this.endDate, this.endTime);
        }
    },
    methods: {
        formatForDisplay(isoDate: string, isoTime: string): string {
            if (!isoDate) {
                return "";
            }
            return moment(`${isoDate} ${isoTime || "00:00"}`, ISO_DATETIME_FORMAT).format(DISPLAY_FORMAT);
        },
        toIsoDate(date: Date | undefined | null): string | undefined {
            if (!date) {
                return undefined;
            }
            return moment(date).format(ISO_DATE_FORMAT);
        },
        toIsoTime(date: Date | undefined | null): string {
            if (!date) {
                return "";
            }
            return moment(date).format(ISO_TIME_FORMAT);
        },
        syncFromTimeSlider(): void {
            const timeSlider = this.timeSlider;
            if (!timeSlider) {
                return;
            }
            const timeExtent = timeSlider.timeExtent;
            const fullTimeExtent = timeSlider.fullTimeExtent;
            this.startDate = this.toIsoDate(timeExtent?.start) ?? "";
            this.startTime = this.toIsoTime(timeExtent?.start);
            this.endDate = this.toIsoDate(timeExtent?.end) ?? "";
            this.endTime = this.toIsoTime(timeExtent?.end);
            this.fullMin = this.toIsoDate(fullTimeExtent?.start);
            this.fullMax = this.toIsoDate(fullTimeExtent?.end);
        },
        onStartDateInput(value: string): void {
            this.applyDateTime("start", value, this.startTime);
        },
        onEndDateInput(value: string): void {
            this.applyDateTime("end", value, this.endTime);
        },
        onStartTimeChange(value: string): void {
            this.applyDateTime("start", this.startDate, value);
        },
        onEndTimeChange(value: string): void {
            this.applyDateTime("end", this.endDate, value);
        },
        applyDateTime(part: DateExtentPart, dateValue: string, timeValue: string): void {
            const timeSlider = this.timeSlider;
            if (!timeSlider || !dateValue) {
                return;
            }

            const time = moment(timeValue, ISO_TIME_FORMAT, true);
            if (!time.isValid()) {
                return;
            }

            const combined = `${dateValue} ${time.format(ISO_TIME_FORMAT)}`;
            const newDate = moment(combined, ISO_DATETIME_FORMAT, true).toDate();
            const currentExtent = timeSlider.timeExtent;

            const start = part === "start" ? newDate : currentExtent?.start;
            const end = part === "end" ? newDate : currentExtent?.end;

            timeSlider.timeExtent = new TimeExtent({ start, end });
        }
    },
    mounted(): void {
        const timeSlider = this.timeSlider;
        if (!timeSlider) {
            return;
        }

        this.syncFromTimeSlider();
        this._timeExtentHandle = timeSlider.watch("timeExtent", () => this.syncFromTimeSlider());
        this._fullTimeExtentHandle = timeSlider.watch("fullTimeExtent", () => this.syncFromTimeSlider());
    },
    beforeDestroy(): void {
        this._timeExtentHandle?.remove();
        this._fullTimeExtentHandle?.remove();
    }
});
</script>
