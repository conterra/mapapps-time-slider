# Time Slider Bundle
The Time Slider bundle adds the Esri TimeSlider widget to a map.apps app.

![Screenshot App](https://github.com/conterra/mapapps-time-slider/blob/master/screenshot.JPG)

## Sample App
https://demos.conterra.de/mapapps/resources/apps/downloads_timeslider4/index.html

## Installation Guide
**Requirement: map.apps 4.8.0**

[dn_timeslider Documentation](https://github.com/conterra/mapapps-time-slider/tree/master/src/main/js/bundles/dn_timeslider)

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
