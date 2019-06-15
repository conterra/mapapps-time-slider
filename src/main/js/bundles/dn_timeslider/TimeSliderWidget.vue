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
            }
        },
        computed: {
            sliderLabels: function () {
                return this.timeStops.map((stop) => {
                    return stop.label;
                })
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
                setTimeout(() => {
                    this.$emit('setFilter');
                }, 100);
            }
        }
    };
</script>
