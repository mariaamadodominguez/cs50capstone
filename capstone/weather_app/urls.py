from django.urls import path

from . import views
#app_name = "weather_app"            
urlpatterns = [
    path("", views.index, name="index"),
    path("favourites", views.favourites, name="favourites"),    
    path("favouritecity", views.addFavourite, name="addFavourite"),
    path("weather", views.weather, name="weather"),
    path("currentweather/<int:id>", views.currentweather, name="currentweather"),    
    path("cityweather", views.cityweather, name="cityweather"),
    path("geoloc", views.geo_view, name="geo_view"),
    path("addNewCity", views.addNewCity, name="addNewCity"),
    path("forecast", views.forecast_view, name="forecast_view"), 
    path("airpollution", views.air_pollution_view, name='air_pollution_view'),
    path("airpollution_forecast", views.air_pollution_forecast_view, name='air_pollution_forecast_view'),    
    path("monthlyweather", views.monthly_weather_view, name="monthly_weather_view"),
    path("weatherhistory", views.weatherhistory_view, name="weatherhistory_view"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]

