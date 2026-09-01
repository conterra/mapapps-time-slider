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
        <v-menu
            v-model="startMenu"
            :position-x="startMenuX"
            :position-y="startMenuY"
            absolute
            :close-on-content-click="false"
            offset-y
            min-width="290px"
        >
            <v-card>
                <v-date-picker
                    v-model="startDate"
                    :min="fullMin"
                    :max="fullMax"
                    @input="onStartDateInput"
                />
                <v-combobox
                    v-model="startTime"
                    :items="timeOptions"
                    class="timeslider-container__time-combobox"
                    prepend-icon="access_time"
                    hide-details
                    @change="onStartTimeChange"
                />
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        flat
                        color="primary"
                        @click="startMenu = false"
                    >
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
        <v-menu
            v-model="endMenu"
            :position-x="endMenuX"
            :position-y="endMenuY"
            absolute
            :close-on-content-click="false"
            offset-y
            min-width="290px"
        >
            <v-card>
                <v-date-picker
                    v-model="endDate"
                    :min="fullMin"
                    :max="fullMax"
                    @input="onEndDateInput"
                />
                <v-combobox
                    v-model="endTime"
                    :items="timeOptions"
                    class="timeslider-container__time-combobox"
                    prepend-icon="access_time"
                    hide-details
                    @change="onEndTimeChange"
                />
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        flat
                        color="primary"
                        @click="endMenu = false"
                    >
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>

<script lang="ts">
    import Vue from "apprt-vue/Vue";
    import TimeExtent from "@arcgis/core/TimeExtent";
    import moment from "moment";

    import type TimeSlider from "@arcgis/core/widgets/TimeSlider";

    const ISO_DATE_FORMAT = "YYYY-MM-DD";
    const ISO_TIME_FORMAT = "HH:mm";
    const ISO_DATETIME_FORMAT = `${ISO_DATE_FORMAT} ${ISO_TIME_FORMAT}`;

    const TIME_STEP_MINUTES = 30;

    // Classes on the TimeSlider widget's own (calcite) markup that the start/end date
    // labels live in -- the icons are injected as extra children of these groups instead
    // of being rendered by this component, so they sit directly beside Esri's own labels.
    const START_GROUP_CLASS = "esri-time-slider__time-extent-start-group";
    const END_GROUP_CLASS = "esri-time-slider__time-extent-end-group";
    const ICON_CLASS = "timeslider-container__extent-icon";

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
                startMenuX: 0,
                startMenuY: 0,
                endMenuX: 0,
                endMenuY: 0,
                timeOptions: TIME_OPTIONS,
                timeExtentHandle: undefined as any,
                fullTimeExtentHandle: undefined as any,
                extentIconsObserver: undefined as MutationObserver | undefined
            };
        },
        mounted(): void {
            const timeSlider = this.timeSlider;
            if (!timeSlider) {
                return;
            }

            this.syncFromTimeSlider();
            this.timeExtentHandle = timeSlider.watch("timeExtent", () => this.syncFromTimeSlider());
            this.fullTimeExtentHandle = timeSlider.watch("fullTimeExtent", () => this.syncFromTimeSlider());
            this.setupExtentIcons();
        },
        beforeDestroy(): void {
            this.timeExtentHandle?.remove();
            this.fullTimeExtentHandle?.remove();
            this.extentIconsObserver?.disconnect();
        },
        methods: {
            setupExtentIcons(): void {
                const container = this.timeSlider?.container as HTMLElement | undefined;
                if (!container) {
                    return;
                }

                const injectBoth = (): void => {
                    this.injectExtentIcon(container, START_GROUP_CLASS, "start", true);
                    this.injectExtentIcon(container, END_GROUP_CLASS, "end", false);
                };

                injectBoth();

                // The TimeSlider widget renders its internal (calcite) DOM asynchronously and
                // re-renders it on every timeExtent/fullTimeExtent change, so the injected icon
                // is re-added here whenever it goes missing rather than relying on it surviving.
                const observer = new MutationObserver(injectBoth);
                observer.observe(container, { childList: true, subtree: true });
                this.extentIconsObserver = observer;
            },
            injectExtentIcon(container: HTMLElement, groupClass: string, part: DateExtentPart, prepend: boolean): void {
                const group = container.querySelector<HTMLElement>(`.${groupClass}`);
                if (!group || group.querySelector(`.${ICON_CLASS}`)) {
                    return;
                }

                const icon = document.createElement("span");
                icon.className = ICON_CLASS;
                icon.setAttribute("role", "button");
                icon.setAttribute("aria-label", part === "start" ? this.startDateLabel : this.endDateLabel);
                icon.addEventListener("click", (event) => {
                    event.stopPropagation();
                    this.openMenu(part, icon);
                });

                if (prepend) {
                    group.insertBefore(icon, group.firstChild);
                } else {
                    group.appendChild(icon);
                }
            },
            openMenu(part: DateExtentPart, anchor: HTMLElement): void {
                const rect = anchor.getBoundingClientRect();
                if (part === "start") {
                    this.startMenuX = rect.left;
                    this.startMenuY = rect.bottom;
                    this.startMenu = true;
                } else {
                    this.endMenuX = rect.right;
                    this.endMenuY = rect.bottom;
                    this.endMenu = true;
                }
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
        }
    });
</script>
