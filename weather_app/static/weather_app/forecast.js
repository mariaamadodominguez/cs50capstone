document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#forecast-btn').addEventListener('click', () =>     
        {
            if (document.querySelector('#forecast-view').style.display == 'block'){
                document.querySelector('#forecast-view').style.display = 'none';
            } else {
                forecast()
            }        
        }     
    )    
    
    getWindDirection();
    
    function forecast() {
        url = '/forecast';
        console.log(url); 
        city_lat = document.querySelector(`#city-lat`).innerHTML;
        city_lon = document.querySelector(`#city-lon`).innerHTML;
        console.log('city_lat', city_lat, 'city_lon', city_lon);
        fetch(url,{
            headers: {"X-CSRFToken":document.querySelector('[name=csrfmiddlewaretoken]').value},
            method: 'POST',   
            body: JSON.stringify({
                lat : city_lat,
                lon : city_lon,
                })
            }
        )
        .then((resp) => resp.json())
        .then((result) => {                  
            console.log("result:", result);
            if (result.forecast_data.cod != 200) {
                document.querySelector('#error-msg').style.display = 'block';
                document.querySelector('#error-msg').innerHTML= result.forecast_data.message;         
                //console.log("result error:", result.message);
            } else {
                const options = {weekday: 'short', month: 'short', day: 'numeric'};
                const fivedays_forecast = result.forecast_data.forecast
                //console.log(result.forecast_data.forecast);

                // clean previous content
                document.querySelector('#forecast-view').innerHTML = '';    

                var dt = UnixTimeStampToDateTime(fivedays_forecast[0].dt);
                var element = document.createElement('div')
                element.className = 'day';
                var txtDay = `<h3 style="padding-left:10px">${dt.toLocaleString('pt-BR', options)}<img src = "https://openweathermap.org/img/wn/${fivedays_forecast[0].weather[0].icon}.png"></h3>`;
                //console.log(txtDay);
                element.innerHTML = txtDay;
                element.id = dt.getDay();
                document.querySelector('#forecast-view').append(element);               

                fivedays_forecast.forEach(day => {                    
                    if (UnixTimeStampToDateTime(day.dt).getDay() != element.id) {
                        dt = UnixTimeStampToDateTime(day.dt);
                        element = document.createElement('div');
                        element.className = 'day';
                        element.id = dt.getDay();
                        txtDay = `<h3 style="padding-left:10px">${dt.toLocaleString('pt-BR', options)}<img src = "https://openweathermap.org/img/wn/${day.weather[0].icon}.png"></h3>`;
                        element.innerHTML = txtDay;
                        document.querySelector('#forecast-view').append(element);  
                    }
                    add_day_forecast(day);                                       
                    });
                // show content
                document.querySelector('#forecast-view').style.display = 'block';                
                }
            })          
        .catch(error => {
            document.querySelector('#error-msg').style.display = 'block';
            document.querySelector('#error-msg').innerHTML= error;     
            console.log(error);                  
            }); 
        }

    function getWindDirection (){        
        let WIND_DIRECTION;
        deg = document.getElementById('wind-deg').innerHTML;
        //console.log('getWindDirection',deg);

        switch (true) {
        case 0 :
        case 360:
                WIND_DIRECTION = "N";
            break;
        case 90 :
                WIND_DIRECTION = "E";
            break;
        case 180 :
                WIND_DIRECTION = "S";
            break;
        case 270 :
                WIND_DIRECTION = "W";
            break;
        case (deg>0 && deg<90) :
                WIND_DIRECTION = "NE";
            break;
        case (deg>90 && deg <180) :
                WIND_DIRECTION = "SE";
            break;
        case (deg>180 && deg<270) :
                WIND_DIRECTION = "SW";
            break;
        case (deg>270 && deg<360) :
                WIND_DIRECTION = "NW";
            break;
        default:
                WIND_DIRECTION = "-";
                break;
        }
        //console.log(WIND_DIRECTION);

        wind_dir = document.createElement('span');
        wind_dir.innerHTML = WIND_DIRECTION;
        wind_dir.className = "m-1";  
        document.querySelector('#wind-deg').insertAdjacentElement("beforebegin", wind_dir);  
    } 
});

function add_day_forecast(day_forecast){
// display the forcast for each 3 hours period
const options = {'hour':'2-digit', 'minute':'2-digit'};
const element = document.createElement('div')
element.id= day_forecast.dt;

dt = UnixTimeStampToDateTime(day_forecast.dt);
element.innerHTML = `<span>${dt.toLocaleTimeString('pt-BR', options)} </span> `; 

const _temp = (day_forecast.main.temp.toFixed(0) + "")
//const _feels = (day_forecast.main.feels_like.toFixed(0) + "")
element.innerHTML += `<span style="padding-left:5px;">${_temp}°C</span> `;
//element.innerHTML += `<span style="padding-left:5px">${day_forecast.main.humidity}% Humidity</span>`;
//element.innerHTML += `<span style="padding-left:5px">Wind ${day_forecast.wind.speed}</span>`;
//element.innerHTML += `<span style="padding-left:5px">Pressure ${day_forecast.main.pressure}</span>`;
element.innerHTML += `<span style="padding-left:5px">${day_forecast.weather[0].description}</span> `;
const _pop = (day_forecast.pop* 100).toFixed(0) 

element.innerHTML += `<span style="padding-left:5px">${_pop}%</span>`;
element.className = 'period';
document.getElementById(dt.getDay()).append(element);

const weather_icon = document.createElement('img');
weather_icon.src = `https://openweathermap.org/img/wn/${day_forecast.weather[0].icon}.png`;
document.getElementById(day_forecast.dt).append(weather_icon);

}

function UnixTimeStampToDateTime( unixTimeStamp )
{
    // Unix timestamp is seconds past epoch
    dateTime = new Date(unixTimeStamp * 1000); 
    //dateTime = dateTime.AddSeconds( unixTimeStamp ).ToLocalTime();
    return dateTime;
}


/*
        {% if weather_data.wind_deg == 360 or weather_data.wind_deg < 23 %}(N){% endif %}                            
        {% if weather_data.wind_deg >= 23 and weather_data.wind_deg < 45 %}(NNE){% endif %}                            
        {% if weather_data.wind_deg >= 45 and weather_data.wind_deg < 68 %}(ENE){% endif %}                
        {% if weather_data.wind_deg >= 68 and weather_data.wind_deg < 90 %}(E){% endif %}    
        {% if weather_data.wind_deg >= 90 and weather_data.wind_deg < 113 %}(ESE){% endif %}    
        {% if weather_data.wind_deg >= 135 and weather_data.wind_deg < 156 %}(SE){% endif %}    
        {% if weather_data.wind_deg >= 156 and weather_data.wind_deg < 180 %}(SSE){% endif %}    
        {% if weather_data.wind_deg >= 180 and weather_data.wind_deg < 203 %}(S){% endif %}    
        {% if weather_data.wind_deg >= 203 and weather_data.wind_deg < 225 %}(SSW){% endif %}    
        {% if weather_data.wind_deg >= 225 and weather_data.wind_deg < 248 %}(SW){% endif %}    
        {% if weather_data.wind_deg >= 248 and weather_data.wind_deg < 270 %}(WSW){% endif %}    
        {% if weather_data.wind_deg >= 270 and weather_data.wind_deg < 293 %}(W){% endif %}    
        {% if weather_data.wind_deg >= 293 and weather_data.wind_deg < 315 %}(WNW){% endif %}    
        {% if weather_data.wind_deg >= 315 and weather_data.wind_deg < 338 %}(NW) {% endif %}    
        {% if weather_data.wind_deg >= 338 and weather_data.wind_deg < 360 %}(NNW){% endif %}            

*/


