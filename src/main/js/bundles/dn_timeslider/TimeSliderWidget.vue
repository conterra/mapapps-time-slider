<template>
    <v-container
        grid-list-md
        fluid
        class="pa-1">
        <div>{{ i18n.layer }}</div>
        <v-select
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
            :min="0"
            :step="1"
            ticks="always"
            tick-size="2"
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
                    <v-icon>skip_previous</v-icon>
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
                    <v-icon>play_arrow</v-icon>
                </v-btn>
                <v-btn v-else
                       block
                       ripple
                       color="primary"
                       @click="$emit('stop', {})"
                >
                    <v-icon>stop</v-icon>
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
                    <v-icon>skip_next</v-icon>
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
            startTimeStopId: {
                type: Number,
                default: 0
            },
            endTimeStopId: {
                type: Number,
                default: 1
            },
            playSlider: {
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
                    return [this.startTimeStopId, this.endTimeStopId];
                },
                set: function (value) {
                    this.startTimeStopId = value[0];
                    this.endTimeStopId = value[1];
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
