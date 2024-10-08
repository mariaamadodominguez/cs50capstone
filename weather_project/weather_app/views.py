import json
from io import StringIO
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from .forms import CityForm, GeoCityForm, MonthlyNormalsForm
from .models import WUser, City
import requests
from django.core.paginator import Paginator
from django.conf import settings
from datetime import datetime, timedelta, timezone
import pandas as pd
import matplotlib.pyplot as plt
from meteostat import Stations, Monthly

def fetch_air_pollution(lat, lon):
    api_key = settings.OPEN_WEATHER_KEY
    url = f'http://api.openweathermap.org/data/2.5/air_pollution?lat=50&lon=50&appid={api_key}'
    response = requests.get(url)
    data = response.json()
    return {
        'air_pollution': data['list'],
    }

def fetch_air_pollution_forecast(lat, lon):
    api_key = settings.OPEN_WEATHER_KEY
    url = f'http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=50&lon=50&appid={api_key}'
    response = requests.get(url)
    data = response.json()
    return {
        'air_pollution_forecast': data['list'],
    }


def fetch_weather_forecast(lat, lon):
    api_key = settings.OPEN_WEATHER_KEY
    url = f'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric&cnt=40';
    response = requests.get(url)
    data = response.json()
    return {
        'cod': data['cod'], 
        'message': data['message'], 
        'cnt': data['cnt'], 
        'forecast': data['list'],
    }

def fetch_weather_data(lat, lon, city):
    api_key = settings.OPEN_WEATHER_KEY        
    if lat != 0:
        url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric'    
    else:
        url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
    
    response = requests.get(url)
    data = response.json()    
    return {
        'description': data['weather'][0]['description'],
        'icon':data['weather'][0]['icon'],
        'temperature': round(data['main']['temp']),
        'feels_like': round(data['main']['feels_like']),
        'humidity': data['main']['humidity'],
        'pressure': data['main']['pressure'],
        'wind': round(data['wind']['speed']),
        'sunrise': datetime.fromtimestamp(data['sys']['sunrise'], tz=timezone.utc), #Sunrise time, unix, UTC
        'sunset': datetime.fromtimestamp(data['sys']['sunset'], tz=timezone.utc), #Sunset time, unix, UTC,
        'timezone':data['timezone'], #Shift in seconds from UTC
    }

def fetch_geo_data(city, limit):
    api_key = settings.OPEN_WEATHER_KEY
    url = f'http://api.openweathermap.org/geo/1.0/direct?q=={city}&appid={api_key}&limit={limit}'
    response = requests.get(url)
    data = response.json()
    return {
        'data': data
    }        
#        'lat': data[0]['lat'],
#        'lon': data[0]['lon'],
#        'country':data[0]['country'],
#        'state':data[0]['state']
#    }

def index(request):    
    
 # Authenticated users view their inbox
    if request.user.is_authenticated:        
        # Return favorite cities in reverse chronologial order
        allcities = City.objects.all()
        allcities = allcities.order_by("-pk").all()   
        p = Paginator(allcities, 10)
        page_number = request.GET.get('page')
        page_obj = p.get_page(page_number)
    
        return render(request, "weather_app/index.html", {
        'title':"All cities",
        "page_name": 'index',        
        'page_obj':page_obj,
        })
    # Everyone else 
    else:
        form = CityForm()
        return render(request, 'weather_app/weather.html', {
        'title':"Current Weather",
        "page_name": 'current',        
        'form':form,
        })        

def addNewCity(request):
    if request.method == 'POST':
        data = json.loads(request.body)    
        try:
            current = City.objects.filter(lat=data.get('lat',''), lon=data.get('lon') )
            if current:
                message = 'City already in list.'                                
            else:
                city = City(
                city = data.get("city"),
                lat = data.get("lat"),
                lon = data.get("lon"),
                country= data.get("country"),
                state = data.get("state")            
                )
                city.save()    
                message = 'City added.'
                        
        except IntegrityError:
            return JsonResponse({"error": IntegrityError.e.__cause__}, status=404)
               
    return JsonResponse({
        "message": message})

def air_pollution_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)    
        try:
            city_lat = data.get("lat")
            city_lon = data.get("lon")            
            air_pollution_data = fetch_air_pollution(city_lat, city_lon)            
            return JsonResponse({'air_pollution_data': air_pollution_data})            
        except IntegrityError:
            return JsonResponse({"error": IntegrityError.e.__cause__}, status=404)
        
def air_pollution_forecast_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)    
        try:
            city_lat = data.get("lat")
            city_lon = data.get("lon")            
            air_pollution_forecast_data = fetch_air_pollution_forecast(city_lat, city_lon)            
            return JsonResponse({'air_pollution_forecast_data': air_pollution_forecast_data})            
        except IntegrityError:
            return JsonResponse({"error": IntegrityError.e.__cause__}, status=404)

def forecast_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)    
        try:
            city_lat = data.get("lat")
            city_lon = data.get("lon")            
            forecast_data = fetch_weather_forecast(city_lat, city_lon)            
            return JsonResponse({'forecast_data': forecast_data})            
        except IntegrityError:
            return JsonResponse({"error": IntegrityError.e.__cause__}, status=404)


def geo_view(request):
    if request.method == 'POST':
        form = GeoCityForm(request.POST)
        if form.is_valid():
            city = form.cleaned_data['city']
            limit = int(form.cleaned_data['limit'])
            geo_data = fetch_geo_data(city, limit)   
            if len(geo_data['data']) > 0 :
                return render(request, 'weather_app/geoloc.html', {'geo_data': geo_data, 'form': form})
            else:
                return render(request, 'weather_app/geoloc.html', {
                                "error": f'Geodata for {city} not found!',
                                'form': form })
    else:
        form = GeoCityForm(initial={"limit":1})        
    return render(request, 'weather_app/geoloc.html', {'form': form})

def currentweather(request, id):
    if request.method == "GET":     
        city = City.objects.get(pk=id)     
        weather_data = fetch_weather_data(city.lat, city.lon, '')
        weather_data['sunrise'] = weather_data['sunrise']+ timedelta(0,weather_data['timezone']) 
        weather_data['sunset'] = weather_data['sunset']+ timedelta(0,weather_data['timezone'])         
        weather_data['timezone'] = weather_data['timezone']/3600
        return render(request, 'weather_app/weather.html', {
            "title": city.city+'-'+city.state,
            #"lat":str(round(city.lat,2)),
            #"lon":str(round(city.lon,2)),
            "lat":city.lat,
            "lon":city.lon,
            "page_name": 'cityweather',                
            'weather_data': weather_data})
    
def weather(request):
    if request.method == 'POST':
        form = CityForm(request.POST)
        if form.is_valid():
            city = form.cleaned_data['city']
            try:
                weather_data = fetch_weather_data(0,0,city)
                weather_data['sunrise'] = weather_data['sunrise']+ timedelta(0,weather_data['timezone']) 
                weather_data['sunset'] = weather_data['sunset']+ timedelta(0,weather_data['timezone'])         
                weather_data['timezone'] = weather_data['timezone']/3600
                return render(request, 'weather_app/weather.html', {
                    "title": 'Current Weather',
                    "page_name": "current",
                    'weather_data': weather_data, 
                    'form': form
                    })
            except:
                return render(request, 'weather_app/weather.html', {
                    "title": 'Current Weather',
                    "page_name": "current",
                    "error": "City not found!",
                    'form': form
                })
    else:
        form = CityForm()
    return render(request, 'weather_app/weather.html', {
        "title": 'Current Weather',
        "page_name": "current",                
        'form': form
        })

def cityweather(request):    
    data = json.loads(request.body)    
    #cityname = data.get('city_name','')
    lat = data.get('lat','')
    lon = data.get('lon','')
    #weather_data = fetch_weather_data(cityname) 
    weather_data = fetch_weather_data(lat,lon, '') 
    return JsonResponse( {'weather_data': weather_data,})            

def weatherhistory_view(request):
    data = json.loads(request.body)    
    lat = float(data.get('lat',''))
    lon = float(data.get('lon',''))
    #lat = -33.4377756 
    #lon = -70.6504502

    start = pd.Timestamp(data.get('dtStart',''))
    end = pd.Timestamp(data.get('dtEnd',''))

    # Fetch weather data from API (pseudo-code)      
    try:                                
        stations = Stations()
        stations = stations.nearby(lat, lon)
        station = stations.fetch(1)
        
        Monthly_data = Monthly(station, start, end)
        Monthly_data = Monthly_data.normalize()
        Monthly_data = Monthly_data.fetch()
        if (Monthly_data.empty):                   
            return JsonResponse( {'cod': 400, "message": 'empty'})            
        else:            
            #-- Plot line chart including average, minimum and maximum temperature
            Monthly_data.plot(y=['tmin', 'tmax','tavg'])
            label = str(list(station.name)[0])+"-"+str(list(station.region)[0])+"/"+str(list(station.country)[0])
            plt.title(label)
            plt.xlabel('MeteoStat Monthly Data')
            plt.ylabel('Temp [min/max/avg]')
                                    
            imgdata = StringIO()
            plt.savefig(imgdata, format='svg')
                    
            imgdata.seek(0)     
            data = imgdata.getvalue()
            return JsonResponse( {'cod': 200, 'graph': data,})            
        
        
    except IntegrityError:
        return JsonResponse({
            "error": IntegrityError.e.__cause__,
            "cod": '404', 'lat':lat, 'lon':lon,'start':start,'end':end,                
            }, status=404)


def monthly_weather_view(request):
    if request.method == 'POST':
        form = MonthlyNormalsForm(request.POST)
        if form.is_valid():
            current_city = form.cleaned_data['city']            
            try:            
                geo_data = fetch_geo_data(current_city, 1)
                
                if len(geo_data['data']) > 0 : 
                    gdcity = geo_data['data'][0] 
                    current_city_lon= gdcity['lon'] 
                    current_city_lat=  gdcity['lat'] 
            
                    # Fetch weather data from API (pseudo-code)            
                    stations = Stations()
                    stations = stations.nearby(current_city_lat, current_city_lon)
                    station = stations.fetch(1)

                    start = pd.Timestamp(form.cleaned_data['dtStart'])
                    end = pd.Timestamp(form.cleaned_data['dtEnd'])
                    Monthly_data = Monthly(station, start, end)
                    Monthly_data = Monthly_data.normalize()
                    Monthly_data = Monthly_data.fetch()
                   
                    #-- Plot line chart including average, minimum and maximum temperature
                    Monthly_data.plot(y=['tmin', 'tmax','tavg'])
                    label = str(list(station.name)[0])+"-"+str(list(station.region)[0])+"/"+str(list(station.country)[0])
                    
                    plt.title(f'{label} - {gdcity['lat']}{gdcity['lon']} {form.cleaned_data['dtStart']} - {form.cleaned_data['dtEnd']}',)
                    plt.xlabel('MeteoStat Monthly Data')
                    plt.ylabel('Temp [min/max/avg]')
                                    
                    imgdata = StringIO()
                    plt.savefig(imgdata, format='svg')
                    
                    imgdata.seek(0)     
                    data = imgdata.getvalue()
                    context = {
                        "title": 'MeteoStat Monthly Weather',
                        "page_name": "current",
                        'form': form, 
                        'graph': data
                        }
                    return render(request, 'weather_app/monthlyweather.html', context)
                else:
                    return render(request, 'weather_app/monthlyweather.html', {
                        "title": 'MeteoStat Monthly Weather',
                        "page_name": "current",
                        "error": f'Geodata for {current_city} not found!',
                        'form': form
                    })    
            except:
                return render(request, 'weather_app/monthlyweather.html', {
                    "title": 'MeteoStat Monthly Weather',
                    "page_name": "current",
                    "error": f'No data for {current_city}!',
                    'form': form
                })
    else:
        form = MonthlyNormalsForm()
    return render(request, 'weather_app/monthlyweather.html',{ 
        "title": 'Monthly Weather',
        "page_name": "current",
        'form': form
        })

def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))        
        else:
            return render(request, "weather_app/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "weather_app/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "weather_app/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = WUser.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
             return JsonResponse({"error": "Post not found."}, status=404)
       
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "weather_app/register.html")
#OPEN_WEATHER_KEY = 'a04aaf2aec23e50b409641a9bfc3def9'