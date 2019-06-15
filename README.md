# Time Slider Bundle
The Time Slider bundle allows the user to change the time extent for FeatureLayers.

## Sample App
https://demos.conterra.de/mapapps/resources/apps/downloads_timeslider4/index.html

## Installation Guide
**Requirement: map.apps 4.7.0**

1. First, you need to add the bundle "dn_timeslider" to your app.
2. After that, add a time-aware FeatureLayer to your app.
3. Finally you can configure your time slider.

### Configurable Components of dn_timeslider:
#### Config:
```
"dn_timeslider": {
    "Config": {
        "timeStopsOptions": {
            ...
        },
        "labelPattern": "DD.MM.YYYY",
        "playOnStartup": false,
        "thumbMovingRate": 1000,
        "loop": false,
        "startTimeStopIndex": 0,
        "endTimeStopIndex": 1
    }
}
```

##### Properties
| Property           | Type    | Possible Values                                                               | Default Value    | Description                                |
|--------------------|---------|-------------------------------------------------------------------------------|------------------|--------------------------------------------|
| timeStopsOptions   | Object  | [More information](https://github.com/conterra/mapapps-time-slider#timestops) |                  | Detailed description below                 |
| labelPattern       | String  | [More information](https://momentjs.com/docs/#/displaying/format/)            | ```DD.MM.YYYY``` | The label pattern for the slider ticks     |
| playOnStartup      | Boolean | ```true``` &#124; ```false```                                                 | ```false```      | Play the slider on startup                 |
| thumbMovingRate    | Integer |                                                                               | ```1000```       | Moving rate in milliseconds                |
| loop               | Boolean | ```true``` &#124; ```false```                                                 | ```false```      | Restart when the end time has been reached |
| startTimeStopIndex | Integer |                                                                               | ```0```          | Start time stop index                      |
| endTimeStopIndex   | Integer |                                                                               | ```1```          | End time stop index                        |

#### Timestops
There are three ways to define the time stops:
##### 1. Use predefined time stops
```
"timeStopsOptions": {
    "timeStops": [
        "2000-08-04",
        "2000-08-20",
        "2000-09-02",
        "2000-09-24",
        "2000-10-06",
        "2000-10-22"
    ]
}
```
##### 2. Use time tops count
```
"timeStopsOptions": {
    "timeExtent": {
        "start": "2000-08-04T00:00Z",
        "end": "2000-10-22T00:00Z"
    },
    "timeStopCount": 4
}
```
##### 3. Use time interval
```
"timeStopsOptions": {
    "timeExtent": {
        "start": "2000-08-04T00:00Z",
        "end": "2000-10-22T00:00Z"
    },
    "timeIntervalLength": 7,
    "timeIntervalUnits": "days"
}
```
##### Possible values for timeIntervalUnits:
- years
- quarters
- months
- weeks	
- days
- hours
- minutes
- seconds
- milliseconds

For more information have a look at the moment.js documentation: https://momentjs.com/docs/#/manipulating/add/

## Development Guide
### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

### Other methods to to define the mapapps.remote.base property.
1. Goal parameters
`mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
Change the mapapps.remote.base in the build.properties file and run:
`mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`
