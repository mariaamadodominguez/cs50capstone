document.addEventListener('DOMContentLoaded', function() {
    var weather_btns = Array.from(document.getElementsByClassName('weather-button')) ;
    weather_btns.forEach(_btn => {    
      document.getElementById(_btn.id).addEventListener('click', () =>                  
        cityWeather(_btn.id));            
      })  

    var fav_btns = Array.from(document.getElementsByClassName('fav-button')) ;
    fav_btns.forEach(_btn => {    
    document.getElementById(_btn.id).addEventListener('click', () =>                  
      addFavourite(_btn.dataset.id));            
    })  
 
    const current_pos = document.getElementById("current-geopos");
    console.log(current_pos);

    function getLocation() {
        console.log('Geolocation is supported by this browser?');
        console.log("sessionStorage.geolocation", sessionStorage.geolocation);
        if (sessionStorage.geolocation) {
            console.log("sessionStorage.geolocation", sessionStorage.lat);
            console.log("sessionStorage.geolocation", sessionStorage.lon);
            if (sessionStorage.lon) {
                showPosition(); 
            }
        } else  {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success);
            } else {
                current_pos.innerHTML = "Geolocation is not supported by this browser.";
            }
        }
    }

    function success(position) {
        console.log(position);
        sessionStorage.geolocation = 1;
        sessionStorage.lat = position.coords.latitude;
        sessionStorage.lon = position.coords.longitude;
        showPosition(); 
    }

    function showPosition() {        
        url = '/cityweather'     
        fetch(url,{
            headers: {"X-CSRFToken":document.querySelector('[name=csrfmiddlewaretoken]').value},
            method: 'POST',   
            body: JSON.stringify({                
              lat : sessionStorage.lat,
              lon : sessionStorage.lon,
              })
            }
        )
        .then((resp) => resp.json())
        .then((result) => {      
            console.log(result);                         
            const weather_icon =  `https://openweathermap.org/img/wn/${result.weather_data.icon}.png`;
            document.querySelector('#crnt-icon').src = weather_icon;            
            document.querySelector('#crnt-name').innerHTML = result.weather_data.name;                                           
            
            document.querySelector('#crnt-description').innerHTML = result.weather_data.description;           
            document.querySelector('#crnt-temperature').innerHTML = result.weather_data.temperature;  
            document.querySelector('#crnt-feels').innerHTML = "Feels like "+ result.weather_data.feels_like + '°C';
            document.querySelector('#crnt-mintemp').innerHTML = "Min." + result.weather_data.temp_min + '°C' ;
            document.querySelector('#crnt-maxtemp').innerHTML = "Max." + result.weather_data.temp_max + '°C' ;
                        
            })          
        .catch(error => {
            console.log(error);                  
            document.querySelector('#error-msg').style.display = 'block';
            document.querySelector('#error-msg').innerHTML= error;                  
            });         
    }   
 
    function cityWeather(city_id) {
        //OPEN_WEATHER_KEY = 'a04aaf2aec23e50b409641a9bfc3def9';
        //api_key = OPEN_WEATHER_KEY;      
        //url = `http://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}&units=metric`;
        url = '/cityweather'     
        console.log(url); 
        console.log('lat :'+ document.querySelector(`#lat${city_id}`).innerHTML);
        console.log('lon :'+ document.querySelector(`#lon${city_id}`).innerHTML);
        fetch(url,{
            headers: {"X-CSRFToken":document.querySelector('[name=csrfmiddlewaretoken]').value},
            method: 'POST',   
            body: JSON.stringify({
              //city_name:city_name,              
              lat : document.querySelector(`#lat${city_id}`).innerHTML,
              lon : document.querySelector(`#lon${city_id}`).innerHTML,
              })
            }
        )
        .then((resp) => resp.json())
        .then((result) => {      
            console.log(result); 
            console.log(`#temperature${city_id}`);
            document.querySelector(`#description${city_id}`).innerHTML = result.weather_data.description;           
            document.querySelector(`#temperature${city_id}`).innerHTML = result.weather_data.temperature;  
            const weather_icon =  `https://openweathermap.org/img/wn/${result.weather_data.icon}.png`;
            document.querySelector(`#icon${city_id}`).src = weather_icon;            
            })          
        .catch(error => {
            console.log(error);                  
            document.querySelector('#error-msg').style.display = 'block';
            document.querySelector('#error-msg').innerHTML= error;                  
            }); 
        }

    function addFavourite(city_id) {        
        url = '/favouritecity'     
        fetch(url, {
          method: "PUT",
          headers: {"X-CSRFToken":document.querySelector('[name=csrfmiddlewaretoken]').value},
          body: JSON.stringify({city_id:city_id,})
        })
        .then((resp) => resp.json())
        .then((result) => {      
          if (result['userFav'])          
            document.querySelector(`#fav-icon${city_id}`).style = "color:red";        
          else          
            document.querySelector(`#fav-icon${city_id}`).style = "color:gray"
        })          
        .catch(error => {
            console.log(error);                  
            document.querySelector('#error-msg').style.display = 'block';
            document.querySelector('#error-msg').innerHTML= error;                  
        }); 
    }      

    getLocation();
}) 
