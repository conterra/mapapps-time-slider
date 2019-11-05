<!--

    Copyright (C) 2019 con terra GmbH (info@conterra.de)

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
    <v-container
        grid-list-md
        fluid
        class="pa-1">
        <div v-if="showLayerSelection">{{ i18n.layer }}</div>
        <v-select
            v-if="showLayerSelection"
            :items="layers"
            item-value="id"
            item-text="title"
            multiple
            v-model="selectedLayerIds"
            class="pa-0"
            single-line
            hide-details
        />
        <v-range-slider
            v-model="sliderValue"
            :max="timeStops.length - 1"
            class="px-2"
            :min="0"
            :step="1"
            ticks="always"
            tick-size="3"
            :tick-labels="sliderLabels"
        ></v-range-slider>
        <v-layout
            row
            wrap>
            <v-flex
                md4
                xs4>
                <v-btn
                    block
                    ripple
                    color="primary"
                    @click="$emit('previousTimeStop', {})"
                >
                    <v-icon>icon-time-rewind</v-icon>
                </v-btn>
            </v-flex>
            <v-flex
                md4
                xs4>
                <v-btn v-if="!playSlider"
                       block
                       ripple
                       color="primary"
                       @click="$emit('play', {})"
                >
                    <v-icon>icon-play</v-icon>
                </v-btn>
                <v-btn v-else
                       block
                       ripple
                       color="primary"
                       @click="$emit('stop', {})"
                >
                    <v-icon>icon-pause</v-icon>
                </v-btn>
            </v-flex>
            <v-flex
                md4
                xs4>
                <v-btn
                    block
                    ripple
                    color="primary"
                    @click="$emit('nextTimeStop', {})"
                >
                    <v-icon>icon-time-forward</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import Bindable from "apprt-vue/mixins/Bindable";

    export default {
        components: {},
        mixins: [Bindable],
        props: {
            i18n: {
                type: Object,
                default: function () {
                    return {
                        layer: "Layer:"
                    }
                }
            },
            layers: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            locale: {
                type: String,
                default: "en"
            },
            selectedLayerIds: {
                type: Array,
                default: () => []
            },
            timeStops: {
                type: Array,
                default: () => []
            },
            startTimeStopIndex: {
                type: Number,
                default: 0
            },
            endTimeStopIndex: {
                type: Number,
                default: 1
            },
            playSlider: {
                type: Boolean,
                default: false
            },
            showLayerSelection: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            sliderLabels: function () {
                return this.timeStops.map((stop) => stop.label)
            },
            sliderValue: {
                get: function () {
                    return [this.startTimeStopIndex, this.endTimeStopIndex];
                },
                set: function (value) {
                    this.startTimeStopIndex = value[0];
                    this.endTimeStopIndex = value[1];
                }
            }
        },
        watch: {
            sliderValue: function () {
                this.setFilter();
            },
            selectedLayerIds: function () {
                this.setFilter();
            }
        },
        mounted: function () {
            this.$emit('startup');
        },
        methods: {
            setFilter: function () {
                this.$emit('setFilter');
            }
        }
    };
</script>
