# dn_timeslider

The Time Slider bundle allows the user to change the time extent of the map.

## Usage
**Requirement: map.apps 4.8.0**

1. First you need to add the bundle dn_timeslider to your app.
2. Then you need to configure it.

To make the functions of this bundle available to the user, the following tool can be added to a toolset:

| Tool ID              | Component            | Description              |
|----------------------|----------------------|--------------------------|
| timeSliderToggleTool | TimeSliderToggleTool | Show or hide the widget. |

## Configuration Reference

### Config

#### Sample configuration
```json
"Config": {
    "fullTimeExtent": {
                    "start": "2019-01-01T00:00Z",
                    "end": "2019-12-31T00:00Z"
                },
    "viewTimeExtent": null,
    "stops": {
        "interval": {
            "value": 1,
            "unit": "weeks"
        },
        "timeExtent": {
            "start": "2019-03-01T00:00Z",
            "end": "2019-09-01T00:00Z"
        }
    },
    "mode": "instant",
    "values": [
       "2019-04-01T00:00Z"
    ],
    "loop": true,
    "playRate": 1000,
    "playOnStartup": true,
    "timeVisible": false
}
```

| Property       | Type    | Possible Values                                                                                            | Default              | Description                                                                                                                                                                                                                                                                                                                       |
|----------------|---------|------------------------------------------------------------------------------------------------------------|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| fullTimeExtent | Object  |                                                                                                            |                      | The temporal extent of the entire slider.                                                                                                                                                                                                                                                                                         |
| viewTimeExtent | Object  |                                                                                                            |                      | The temporal extent of the view.
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
    "start": "2019-01-01T00:00Z",
    "end": "2019-12-31T00:00Z"
}
```

#### Configuration of viewTimeExtent
To configure this property you need to define a start and an end date. For that you need to use [Moment.js-Strings](https://momentjs.com/docs/#/parsing/).

```json
"viewTimeExtent": {
    "start": "2019-01-01T00:00Z",
    "end": "2019-12-31T00:00Z"
}
```

To use the current time you can use either of the three following possibilites:

```json
"fullTimeExtent": {
    "start": "2019-01-01T00:00Z",
    "end": null
}

"fullTimeExtent": {
    "start": "2019-01-01T00:00Z",
    "end": "now"
}

"fullTimeExtent": {
    "start": "2019-01-01T00:00Z",
    "end":
}
```

#### Dynamic calculation of timeExtents
The start and end component of a viewTimeExtent or fullTimeExtent can also be calculated dynamically. As basis either a moment or the current time are used. To these specific calculations can be applied. To use a moment and apply calculations to it is important that the moment is the first element of the array.

```json
"fullTimeExtent": {
    "start": [
        "2019-01-01T00:00Z",
        {
            "method": "subtract",
            "args": [
                1,
                "year"
            ]
        },
        {
            "method": "add",
            "args": [
                6,
                "months"
            ]
        }
    ],
    "end": "2019-12-31T00:00Z"
}

"viewTimeExtent": {
    "start": [
        "2019-01-01T00:00Z",,
        {
            "method": "subtract",
            "args": [
                1,
                "year"
            ]
        },
        {
            "method": "add",
            "args": [
                6,
                "months"
            ]
        }
    ],
    "end": "2019-12-31T00:00Z"
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
        "2019-01-15T00:00Z",
        "2019-02-15T00:00Z",
        "2019-03-15T00:00Z",
        "2019-04-15T00:00Z",
        "2019-05-15T00:00Z",
        "2019-06-15T00:00Z",
        "2019-07-15T00:00Z",
        "2019-08-15T00:00Z",
        "2019-09-15T00:00Z",
        "2019-10-15T00:00Z",
        "2019-11-15T00:00Z",
        "2019-12-15T00:00Z"
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
        "start": "2019-01-01T00:00Z",
        "end": "2019-12-31T00:00Z"
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
        "start": "2019-01-01T00:00Z",
        "end": "2019-12-31T00:00Z"
    }
}
```
