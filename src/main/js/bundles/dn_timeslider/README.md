# dn_timeslider

The Time Slider bundle allows the user to change the time extent of the map.

## Usage
**Requirement: map.apps 4.8.0**

1. First you need to add the bundle dn_timeslider to your app.
2. Then you need to configure it.

To make the functions of this bundle available to the user, the following tool can be added to a toolset:

| Tool ID              | Component            | Description              |
|----------------------|----------------------|--------------------------|
| timeSliderToggleTool | timeSliderToggleTool | Show or hide the widget. |

## Configuration Reference

### Config

#### Sample configuration
```json
"Config": {
    "fullTimeExtent": {
        "start": "2000-08-04T00:00Z",
        "end": "2000-10-22T00:00Z"
    },
    "stops": {
        "interval": {
            "value": 1,
            "unit": "weeks"
        },
        "timeExtent": {
            "start": "2000-08-07T00:00Z",
            "end": "2000-10-22T00:00Z"
        }
    },
    "mode": "time-window",
    "values": [
        "2000-08-07T00:00Z",
        "2000-08-13T00:00Z"
    ],
    "loop": true,
    "playRate": 1000,
    "playOnStartup": false,
    "timeVisible": false
}
```

| Property       | Type    | Possible Values                                                                                            | Default              | Description                                                                                                                                                                                                                                                                                                                       |
|----------------|---------|------------------------------------------------------------------------------------------------------------|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| fullTimeExtent | Object  |                                                                                                            |                      | The temporal extent of the entire slider.                                                                                                                                                                                                                                                                                         |
| stops          | Object  |                                                                                                            | ```{ count : 10 }``` | Defines specific locations on the time slider where thumbs will snap to when manipulated.                                                                                                                                                                                                                                         |
| mode           | String  | ```instant``` &#124; ```time-window``` &#124; ```cumulative-from-start``` &#124; ```cumulative-from-end``` | ```time-window```    | This property is used for defining if the temporal data will be displayed cumulatively up to a point in time, a single instant in time, or within a time range. More information is available in the [TimeSlider](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-TimeSlider.html#mode) documentation. |
| values         | Array   |                                                                                                            | ```null```           | Values define the current location of time slider thumbs. The "time-window" mode has two values, the other modes only have one.                                                                                                                                                                                                   |
| loop           | Boolean | ```true``` &#124; ```false```                                                                              | ```true```           | When true, the time slider will play its animation in a loop.                                                                                                                                                                                                                                                                     |
| playRate       | Number  |                                                                                                            | ```1000```           | The time (in milliseconds) between animation steps.                                                                                                                                                                                                                                                                               |
| playOnStartup  | Boolean | ```true``` &#124; ```false```                                                                              | ```false```          | When true, the time slider will play its animation on startup.                                                                                                                                                                                                                                                                               |
| timeVisible    | Boolean | ```true``` &#124; ```false```                                                                              | ```false```          | Shows/hides time in the display.                                                                                                                                                                                                                                                                                                  |

#### Configuration of fullTimeExtent
To configure this property you need to define a start and an end date. For that you need to use [Moment.js-Strings](https://momentjs.com/docs/#/parsing/).

```json
"fullTimeExtent": {
    "start": "2000-08-04T00:00Z",
    "end": "2000-10-22T00:00Z"
}
```

To use the current time you must use undefined:

```json
"fullTimeExtent": {
    "start": "2000-08-04T00:00Z",
    "end": undefined
}
```

#### Configuration of stops
There are four ways to configure the stops of the time slider:

1. Usage of moment.js methods
```javascript
"moment": [
    // Add a new time stop to the first april of 2019
    "2019-04-01T00:00Z",
    // Add a new time stop one month later than the previous time stop
    {
        "method": "add",
        "args": [
            1,
            "months"
        ]
    },
    // add a new time stop 7 days later than the previous time stop
    {
        "method": "add",
        "args": [
            7,
            "days"
        ]
    },
    // add a new time stop one week and 2 days later than the previous time stop
    [
        {
            "method": "add",
            "args": [
                1,
                "weeks"
            ]
        },
        {
            "method": "add",
            "args": [
                2,
                "days"
            ]
        }
    ],
    // add a new time stop 1 week minus 2 days later than the previous time stop
    [
        {
            "method": "add",
            "args": [
                1,
                "weeks"
            ]
        },
        {
            "method": "subtract",
            "args": [
                2,
                "days"
            ]
        }
    ]
]
```

2. Predefined dates
```json
"stops": {
    "dates": [
        "2000-08-04T00:00Z",
        "2000-08-05T00:00Z",
        "2000-08-06T00:00Z",
        "2000-08-07T00:00Z",
        "2000-08-08T00:00Z",
    ]
}
```

3. Stops by count
```json
"stops": {
    "count": 10
}
```

4. Stops by interval
More information about the possible units are available in the [TimeInterval](https://developers.arcgis.com/javascript/latest/api-reference/esri-TimeInterval.html) documentation
```json
"stops": {
    "interval": {
        "value": 1,
        "unit": "weeks"
    }
}
```

If you configure the stops over an interval or a number, you have the additional possibility to set a time extent. If you do this, the stops will only be created within this period.
```json
"stops": {
    "count": 10,
    "timeExtent": {
        "start": "2000-08-07T00:00Z",
        "end": "2000-10-22T00:00Z"
    }
}
```

```json
"stops": {
    "interval": {
        "value": 1,
        "unit": "weeks"
    },
    "timeExtent": {
        "start": "2000-08-07T00:00Z",
        "end": "2000-10-22T00:00Z"
    }
}
```
