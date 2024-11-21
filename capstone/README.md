# Maria Amado Domínguez - CS50 Web cs50capstone

In my final project I try to show every skills and tools I learned during ***Harvard's CS50 Web Programming with Python and JavaScript course***. I've also incorporated other knowledge acquired in my previous jobs and programming curses to make the project more complete and different from the others developed in ***CS50***.

I used **Python**, **JavaScript**, **HTML5**, **CSS** and **BOOTSTRAP**.

*Models* Two models, one for the geoloc info (City) and the other for users information plus a ManyToManyField "favouritesList" of locations  (WUser)

*Forms* Three django forms for city weather (CityForm), geo location (GeoCityForm) and monthly history weather (MonthlyNormalsForm)


My project is a weather forecast-like site with the following funcionality:

- Easily search for locations working with geographic names and coordinates. Users signed up can save as many places as they want
- Access current weather data for any location on Earth, collecting and processing weather data from weather stations 
- Current air pollution data for the saved locations 
- 5 days forecast data with 3-hour step for the saved locations
- Graphic 12 month (or anyother period desired) history records.  

# Distinctiveness and Complexity
In addition to what I learned with CS50 Web, I have incorporated pandas and matplot lib to process the Meteostat information, which makes my project something different from the previous projects in the course. 

The complexity:
- Conversions 
    -- Time of data calculation, unix UTC to datetime
    -- Time to local time - Shift in seconds from UTC 
    -- Javascript routine to convert Wind degrees to compass directions   
- Geocoding transformation of any location name into geographical coordinates.
- Integrate Meteostat long-term time series of nearest weather stations of a given location, using Pandas.
- A Matplotlib line chart plot including the average, minimum and maximum temperature, converting the output to an SVG path using StringIO, thus avoiding writing file-like objects to disk.

# Files
## In weather_app/static/weather_app/
### air_pollution.js
Javascript function used in *weather.html*
- airpollution() calls to openweather.org **/air_pollution** endpoint, using as parameter the latitude and longitude of the location chosen. Besides the Air Quality Index ('Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'), returns the concentration of Carbon monoxide (CO) in μg/m3.

### forecast.js
Javascript function used in *weather.html*
- forecast() calls to **/forecast** endpoint, using as parameter the latitude and longitude of the chosen location . Returns weather forecast for 5 days with data every 3 hours by geographic coordinates. Displays the information breaking by day, showing the corresponding weather icons and transforming the result data (wind direction and timestamps) 

### geoloc.js
Javascript function used in *geoloc.html*
- saveCity()) registers the geolocation information (name, latitude, longitude, country and state) in the database 

### weather_app.js 
Javascript functions used in *index.html*
- getLocation() calls the 'getCurrentPosition" function and saves the result data (position.coords.latitude and position.coords.longitude) in a session variable (sessionStorage).
- showPosition() calls the **'/weather** endpoint with position.coords.latitude and position.coords.longitude. 
- cityWeather() function calls the **'/weather** endpoint, using as parameter the latitude, longitude and id stored in the database for the location chosen from the list.
- addFavourite adds the chosen location to the user favourite list, using as parameter the location id.

### weather_history.js
Javascript function used in *weather.html*
- weather_history() uses latitude and longitude as parameters to get the meteorological station closest to the chosen location. It then gets the MeteoStat monthly data for the last year for that station and shows it in a graph.

### styles.css
Some additional styles for buttons, tooltips and footer,

## In weather_app/templates/weather_app/
### geoloc.html

Allows the user to search for the geoloc information of a given place,up to 5 results for search. If the user is signed in should have the ability to save the location and automatically include on his fauvorites places list. If it already exists the page should say so. If the location is not found the user should be presented with an error (Geodata for Lugoo not found!)

### index.html

Shows the current weather using the device's current position.

If user is signed up, it will show also a list all of the locations resgistered in the system, displaying its name, state and country, as well as the latitude and longitude of each place.

If the user is logged in and clicks on his or her name in the menu bar, the list only shows locations, if any, that the user has previously added to his or her favorites list.

Clicking the 'thermomether' icon will show a brief description of the current weather in that location 

Clicking the 'heart' icon will save the location in the user's fauvorite list. If the item is already on the list, the user should be able to remove it.

When a user clicks on the name of the location, will be taken to the "Weather" page, using the geographical coordinates  registered, instead of the location name, for a more accuracy information.

### layout.html
The common layout of the app, a menu, a body container, and a footer.
General options
-- Search
-- Geographic location
Only for authenticated users:
-- Monthly weather
-- Favorites list (by clicking on the user name)
-- Log out
Only for unauthenticated users:
-- Log in
-- Register

### login.html
Ask for user's name and password to sign up in the sistem 


### monthlyweather.html
Using the information retrieved from Meteostat, user logged can query for the history weather of any place, saved or not in the database, for a specific period of time. If the location is not found the user should be presented with an error (Geodata for Xxxxxx not found!)

The result of the query is a plot that shows monthly maximun, minimun and average temperatures. The heading of the plot shows the name of the station that provides the information. 


### register.html
User sign up, asking for Username, Email Address and Password

### weather.html
Any user, signed up or not, can search for the current weather data for any location. If the location is not found the user should be presented with an error (Location not found!) 

Shows all the detailed information of the current weather for a given location.
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

If the user is registered and has chosen one of the already saved locations, there are 3 additional buttons:

#### 5 Days Forecast: 
Weather forecast for 5 days with data every 3 hours by geographic coordinates. Time (converted from UnixTimeStamp To DateTime), temperature, description and the probability of precipitation, plus the correspondent weather_icon.
#### Air pollution: 
Air Quality Index(Good, Fair, Moderate, Poor, Very Poor, Fair) and the Сoncentration of CO (μg/m3)
#### History  
A Matplotlib line chart plot including the average, minimum and maximum temperature


# How to run
## Set up enviromment
- Django 
- Sqlite
- The Meteostat Python package, available through PyPI: pip install meteostat

Meteostat requires Python 3.6 or higher.

## External modules
- requests 
- pandas
- matplotlib (pyplot)
- meteostat (Stations, Monthly)

## API endpoints from openweather.org
- /weather - Current weather data. Access current weather data for any location
- /forecast - 5 day weather forecast. Weather forecast for 5 days with data every 3 hours by geographic coordinates.
- /geoloc - Geocoding API to search for locations while working with geographic names and coordinates.
- /air_pollution - Air Pollution API current air pollution data for any coordinates on the globe.
