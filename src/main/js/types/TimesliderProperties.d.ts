export interface TimesliderProperties {
    timeExtent: __esri.TimeExtent,
    fullTimeExtent: __esri.TimeExtent,
    viewTimeExtent: __esri.TimeExtent,
    stops: __esri.StopsByDates | __esri.StopsByCount | __esri.StopsByInterval
    mode: "instant" | "time-window" | "cumulative-from-start" | "cumulative-from-end",
    loop: boolean,
    playRate: number,
    playOnStartup: boolean,
    timeVisible: boolean
}
