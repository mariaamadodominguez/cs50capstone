# Maria Amado Domínguez - CS50 Web cs50capstone
My final project is not a creative one, i just try to show any of the skills and tools that I've learnt during the 
Harvard's CS50 Web Programming with Python and JavaScript course. I used pyton *PYTHON*, *JavaScript*, *HTML5*,  *CSS*, *BOOTSTRAP*

It is a weather forecast-like site that allows users to save their favourite locations, get 5 days forecast, air pollution info and 12 month history records. 

## Set up enviromment
Django
Sqlite

### External modules
requests 
pandas
matplotlib (pyplot)
meteostat (Stations, Monthly)
### API endpoints from openweather.org
/currentweather - Current weather data. Access current weather data for any location
/forecast - 5 day weather forecast. Weather forecast for 5 days with data every 3 hours by geographic coordinates.
/geoloc - Geocoding API to search for locations while working with geographic names and coordinates.
/air_pollution - Air Pollution API current air pollution data for any coordinates on the globe.

## *Models*
WUser model -User plus a ManyToManyField "favouritesList"      
City model - The geoloc info 


## *Forms*
Three django forms for city weather, geo location and monthly history weather
CityForm, GeoCityForm, MonthlyNormalsForm

# User authentication (sign up, login, log out)

# Default route 

Calls the 'getCurrentPosition" function and saves the result data (position.coords.latitude and position.coords.longitude) in a session variable (sessionStorage).
Shows the current weather using the device's current position.

If user is signed up, it will show also a list all of the locations resgistered in the system, displaying its name, state and country, as wlel as the latitude and longitude of each place.

Clicking the 'thermomether' icon will show a brief description of the current weather in that location 

Clicking the 'heart' icon will save the location in the user's fauvorite list. If the item is already on the list, the user should be able to remove it.

When a user clicks on the name of the location, will be taken to the "Weather" page, using the geographical coordinates  registered, instead of the location name, for a more accuracy information.

# Search
Any user, signed up or not, can search for the current weather data for any location. If the location is not found the user should be presented with an error (Location not found!) 

# Weather page
Shows all the detailed information of the current weather.
	Temperature
	A descriptive icon of the weather 
	Description     
   	Feels like 
    Temp High and Low 
        
    Humidity
    Wind speed (m/s) and direction (converting degrees in directions)
    Cloudiness        
    Visibility, The maximum value is 10 km        
    Precipitation, mm/h
    Amospheric pressure on the sea level and Ground Level

    Sunrise and sunset in local time, plus GMT difference

If user is signed there and has chosen one of the locations already saved, there are additionally 3 buttons:
## 5 Days Forecast: 
Weather forecast for 5 days with data every 3 hours by geographic coordinates. Time (converted from UnixTimeStamp To DateTime), temperature, description and the probability of precipitation, plus the correspondent weather_icon.
## Air pollution: 
Air Quality Index(Good, Fair, Moderate, Poor, Very Poor, Fair) and the Сoncentration of CO (μg/m3)
## History  

# Geoloc page
Search for the geoloc information of a given place,up to 5 results for search. If the user is signed in should have the ability to save the location and automatically include on his fauvorites places list. If it already exists the page should say so. If the location is not found the user should be presented with an error (Geodata for Lugoo not found!)
Geocoding is the process of transformation of any location name into geographical coordinates, working at the level of city names, areas and districts, countries and states.


# Monthly Weather page 
Using the information retrieved from Meteostat, user logged can query for the history weather of any place, saved or not in the database, for a specific period of time. If the location is not found the user should be presented with an error (Geodata for Lugoo not found!)
The result of the query is a plot that shows monthly maximun, minimun and average temperatures. The heading of the plot shows ten name of the station that provides the information. 

# User's favourites 
Displays all of the locations, if any, that the user logged has added to their favourite list. Same funcionality as the default route.
