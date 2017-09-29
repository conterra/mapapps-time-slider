# Time Slider Bundle
The Time Slider bundle allows you to use the Esri time slider to display map content related to times.

Sample App
------------------
https://demos.conterra.de/mapapps/resources/apps/downloads_timeslider/index.html

Installation Guide
------------------
**Requirement: map.apps 3.2.1**

1. First, you need to add the bundle "dn_timeslider" to your app.
2. After that, add a service that supports time-aware layers.
3. Finally you can configure your time slider.

#### Configurable Components of dn_timeslider:

##### TimeSliderFactory:
```
"dn_timeslider": {
    "TimeSliderFactory": {
        "timeSliderOptions": {
            // When true, subtracts one second to the time extent's end time to exclude data at the exact end time instant.
            "excludeDataAtLeadingThumb": false,
            // When true, adds one second to the time extent's start time to exclude data at the exact start time instant.
            "excludeDataAtTrailingThumb": false,
            // Determines whether or not loop.
            "loop": false,
            // Play the time slider on startup.
            "playOnStartup": false,
            // When true cumulative data is displayed from the start time to the current thumb location.
            "cumulative": false,
            // The number of thumbs to display.
            "thumbCount": 1,
            // Change the rate at which the time animation plays.
            "thumbMovingRate": 1000,
            // Array of two integers, the first value determines where to put the first thumb.
            "thumbIndexes": [
                0,
                1
            ],
            // Dojo locale settings to format date labels.
            // Choice of ‘time’,’date’ (default: date and time).
            "labelSelector": "date time",
            // Override pattern with this string.
            "labelDatePattern": "yyyy-MM-dd",
            // Override pattern with this string.
            "labelTimePattern": "HH:mm:ss"
        },
        "timeStopsOptions": {
            // Explained in the next section.
        },
        // Add layers that can be controlled by the timeslider.
        "mapModelNodeIds": [
            "hurricane01/0"
        ]
    }
}
```

##### There are four ways to define the time stops:
###### 1. Use predefined time stops
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
###### 2. Use Moment.js to define time stops
You can use Moment.js functions to create time stops. Have a look at the Modify.js documentation to get more information: https://momentjs.com/docs/#/manipulating/
```
"momentTimeStops": {
    // Add a new time stop to now, but with 0 mins, 0 secs, and 0 ms and add 30 minutes
    [
        {
            "method": "startOf",
            "args": [
                "hour"
            ]
        },
        {
            "method": "add",
            "args": [
                30,
                "minutes"
            ]
        }
    ],
    // add a new time stop one hour later than the previous time stop
    {
        "method": "add",
        "args": [
            1,
            "hours"
        ]
    },
    // add a new time stop one hour and 30 minutes later than the previous time stop
    [
        {
            "method": "add",
            "args": [
                1,
                "hours"
            ]
        },
        {
            "method": "add",
            "args": [
                30,
                "minutes"
            ]
        }
    ],
    // add a new time stop 1 hours and 35 minutes later than the previous time stop
    [
        {
            "method": "add",
            "args": [
                1,
                "hours"
            ]
        },
        {
            "method": "subtract",
            "args": [
                25,
                "minutes"
            ]
        }
    ],
    // add a new time stop one hour before the end of the day
    [
        {
            "method": "endOf",
            "args": [
                "day"
            ]
        },
        {
            "method": "subtract",
            "args": [
                1,
                "hour"
            ]
        }
    ]
}
```
###### 3. Use time tops count
```
"timeStopsOptions": {
    "timeExtent": {
        "startTime": "2000-08-04",
        "endTime": "2000-10-22"
    },
    "timeIntervalCount": 10
}
```
###### 4. Use time interval
```
"timeStopsOptions": {
    "timeExtent": {
        "startTime": "2000-08-04",
        "endTime": "2000-10-22"
    },
    "timeIntervalLength": 1,
    "timeIntervalUnits": "esriTimeUnitsWeeks"
}
```
###### Possible values for timeIntervalUnits:

- esriTimeUnitsCenturies
- esriTimeUnitsDays
- esriTimeUnitsDecades
- esriTimeUnitsHours
- esriTimeUnitsMilliseconds
- esriTimeUnitsMinutes
- esriTimeUnitsMonths
- esriTimeUnitsSeconds
- esriTimeUnitsUnknown
- esriTimeUnitsWeeks
- esriTimeUnitsYears

Development Guide
------------------
### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

##### Other methods to to define the mapapps.remote.base property.
1. Goal parameters
`mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
Change the mapapps.remote.base in the build.properties file and run:
`mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`