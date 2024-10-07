document.addEventListener('DOMContentLoaded', function() {
    var weather_btns = Array.from(document.getElementsByClassName('weather-button')) ;
    weather_btns.forEach(_btn => {    
      document.getElementById(_btn.id).addEventListener('click', () =>                  
        cityWeather(_btn.id));            
      })  
  
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
            //document.querySelector(`#temp${city_id}`).style.display = 'block';            
            })          
        .catch(error => {
            console.log(error);                  
            document.querySelector('#error-msg').style.display = 'block';
            document.querySelector('#error-msg').innerHTML= error;                  
            }); 
        }
}) 