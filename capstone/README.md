# Maria Amado Domínguez - CS50 Web capstone

In my final project I try to show every skill and tools I learned during ***Harvard's CS50 Web Programming with Python and JavaScript course***. 

I used **Django** on the back-end and **JavaScript**, **HTML5**, **CSS** on the front-end. **Bootstrap** makes the application mobile-responsive.

My project is a weather forecast-like site with the following functionality:

- Easily search for locations working with geographic names and coordinates. Users signed up can save as many places as they want
- Access current weather data for any location on Earth, collecting and processing weather data from weather stations 
- Current air pollution data for the saved locations 
- 5 days forecast data with 3-hour step for the saved locations
- Graphic 12 month (or any other period desired) history records.  
# Distinctiveness and Complexity
## What makes my web application different enough
- In addition to what I learned with ***CS50 Web***, I have incorporated Pandas, Matplotlib and the Meteostat Python library, which makes my project something different from the previous projects in the course. 
## Justification for the complexity of my project
- Conversion of units of measurement of the API response fields
    - The date and time data format of API responses is Unix timestamp, i.e. seconds after epoch, UTC. This must be converted to datetime format.
    - Using the 'timezone' field, which provides the shift in seconds from UTC, the result is converted to local time.
    - The wind direction, returned in degrees (meteorological) is converted in  compass direction (SW, N, S etc.) 
- Geocoding transformation of any location name into geographical coordinates.
- Using the Pandas library to integrate long-term time series from Meteostat from the nearest weather station to a given location.
- Using Matplotlib's line chart that includes average, minimum, and maximum temperature. Save the current figure as an SVG object to be used in a Django framework.
# Files
## capstone (project folder) 
### asgi.py
### settings.py
Django settings for capstone project. Declares 2 keys 
- OPEN_WEATHER_KEY 
- URL_ICONS 
### urls.py
URL configuration for capstone project.
### wsgi.py
## capstone/weather_app/ (app folder)
### admin.py
Defines the CityAdmin class with list_display = ("city", "country", "state")
Registers the (WUser) (City, CityAdmin) and (Time) models
## apps.py
Declares name = 'weather_app' in class WeatherAppConfig'    
### forms.py
3 django forms for city weather (CityForm), geolocation (GeoCityForm) and monthly history weather (MonthlyNormalsForm)
### models.py
This application works with 2 django models on the back-end, one for the geolocation info (City) and the other for users information plus a ManyToManyField "favouritesList" of locations  (WUser)
### test.py
A class that extends the TestCase class with a setUp function and 9 test functions for performing Django and Client Testing.
### urls.py
The urlpatterns list containing the calls to the path functions from views.py
### views.py
Contains all the application API logic, handles incoming requests, and generates responses.
### README.md
This file
### db.sqlite3
The database
### manage.py
### requirements.txt
## capstone/weather_app/static/weather_app/
### air_pollution.js (in *weather.html*)
- airpollution() calls to openweather.org **/air_pollution** endpoint, using as parameter the latitude and longitude of the location chosen. Besides the Air Quality Index ('Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'), returns the concentration of Carbon monoxide (CO) in μg/m3.
### forecast.js (in *weather.html*)
- forecast() calls to **/forecast** endpoint, using as parameter the latitude and longitude of the chosen location . Returns weather forecast for 5 days with data every 3 hours by geographic coordinates. Displays the information breaking by day, showing the corresponding weather icons and transforming the result data (wind direction and timestamps) 
### geoloc.js (in *geoloc.html*)
- saveCity() registers the geolocation information (name, latitude, longitude, country and state) in the database 
### weather_app.js (in *index.html*)
- getLocation() calls the 'getCurrentPosition" function and saves the result data (position.coords.latitude and position.coords.longitude) in a session variable (sessionStorage).
- showPosition() calls the **'/weather** endpoint with position.coords.latitude and position.coords.longitude. 
- cityWeather() function calls the **'/weather** endpoint, using as parameter the latitude, longitude and id stored in the database for the location chosen from the list.
- addFavourite adds the chosen location to the user favourite list, using as parameter the location id.
### weather_history.js (in *weather.html*)
- weather_history() uses latitude and longitude as parameters to get the meteorological station closest to the chosen location. It then gets the MeteoStat monthly data for the last year for that station and shows it in a graph.
### styles.css
Some additional styles for buttons, tooltips and footer,
## capstone/weather_app/templates/weather_app/
### geoloc.html
Allows the user to search for the geolocation information of a given place,up to 5 results for search. 

If the user is signed in should have the ability to save the location and automatically include it on his fauvorites places list.

If it already exists the page should say so. If the location is not found the user should be presented with an error (Geodata for Xxxxxx not found!)
### index.html
Shows the current weather using the device's current position.

If a user is signed up, it will also show a list of all of the locations registered in the system, displaying its name, state and country, as well as the latitude and longitude of each place.

If the user is logged in and clicks on his or her name in the menu bar, the list only shows locations, if any, that the user has previously added to his or her favorites list.

Clicking the 'thermometer' icon will show a brief description of the current weather in that location 
             
Clicking the 'heart' icon will save the location in the user's fauvorite list. If the item is already on the list, the user should be able to remove it.

When a user clicks on the name of the location, it will be taken to the "Weather" page, using the geographical coordinates  registered, instead of the location name, for more accurate information.
### layout.html
The common layout of the app, a menu, a body container, and a footer.
- General options
    - Search
    - Geographic location
- Only for authenticated users
    - Monthly weather
    - Favorites list (by clicking on the user name)
    - Log out
- Only for unauthenticated users
    - Log in
    - Register
### login.html
Ask for user's name and password to sign up in the system 
### monthlyweather.html
Using the information retrieved from Meteostat, the logged users can consult the weather history of any location, whether or not stored in the database, for a specific period of time. If the location is not found, the user will be shown an error (Geographic data for Xxxxxx not found!).

The result of the query is a plot that shows monthly maximum, minimum and average temperatures. In addition, the name of the station providing the information is shown in the header of the graph.
### register.html
User sign up, asking for Username, Email Address and Password

### weather.html
Any user, signed up or not, can search for the current weather data for any location. If the location is not found the user should be presented with an error (Location not found!) 

Otherwise, all the detailed information about the current weather for a given location is displayed:

- **Temperature**
- **Weather icon**
- **Description**
- **Feels like**
- **Temp High and Low** 
- **Humidity**
- **Wind speed** (m/s) and **direction** (converting degrees in directions)
- **Cloudiness**        
- **Visibility**, The maximum value is 10 km        
- **Precipitation**, mm/h
- **Amospheric pressure** on the sea level and Ground Level
- **Sunrise** and **sunset** in local time, plus GMT difference

If the user is registered and has chosen one of the already saved locations, there are 3 additional buttons:

- **5 Days Forecast**

Weather forecast for 5 days with data every 3 hours by geographic coordinates. Time, temperature, description and the probability of precipitation, plus the correspondent weather icon.
- **Air pollution**

Air Quality Index (Good, Fair, Moderate, Poor, Very Poor, Fair) and the Сoncentration of CO (μg/m3)
- **History**

A Matplotlib line chart plot including the average, minimum and maximum temperature
# How to run
## Set up enviromment
- Django
- Sqlite
- The Meteostat Python package, available through PyPI: pip install meteostat
Meteostat requires Python 3.6 or higher.

1. Clone the repository using the command git clone [https://github.com/mariaamadodominguez/cs50wcapstone.git]
2. Create a virtual environment for the project 
a. Install the python3-venv package using the command. 
$ apt install python3.12-venv
$ mkdir -p ~/.venvs 
b. venv will create a virtual Python installation in the .venv
$ python3 -m venv cs50wenv
c. Activate the virtual env: source cs50wenv/bin/activate
3. pip install -r requirements.txt. Django, Pandas, Matplotlib and Requests
4. Make and apply migrations by running python manage.py makemigrations and python manage.py migrate. 
5. Run the server using python manage.py runserver
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
