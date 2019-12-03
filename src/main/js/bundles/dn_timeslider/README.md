# dn_timeslider

The Time Slider bundle allows the user to change the time extent for FeatureLayers.

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

TODO

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
