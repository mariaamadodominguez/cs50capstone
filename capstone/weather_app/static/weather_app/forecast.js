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
    
    document.querySelector('#wind-deg').innerHTML = getWindDirection(document.getElementById('wind-deg').innerHTML);
    
    function forecast() {
        url = '/forecast';
        //console.log(url); 
        city_lat = document.querySelector(`#city-lat`).innerHTML;
        city_lon = document.querySelector(`#city-lon`).innerHTML;
        //console.log('city_lat', city_lat, 'city_lon', city_lon);
        document.querySelector('#error-msg').style.display = 'none';
        document.querySelector('#error-msg').innerHTML= '';     

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
            //console.log("result:", result);
            if (result.forecast_data.cod != 200) {
                document.querySelector('#error-msg').style.display = 'block';
                document.querySelector('#error-msg').innerHTML= result.forecast_data.message;         
                //console.log("result error:", result.message);
            } else {
                const fivedays_forecast = result.forecast_data.forecast
                console.log(result.forecast_data.forecast);
                // clean previous content
                document.querySelector('#forecast-view').innerHTML = '';    
                
                // create day element
                var current_day = fivedays_forecast[0]; 
                var element = add_day_forecast(current_day);             
                var max = Math.round( current_day.main.temp_max, 0);
                var min = Math.round( current_day.main.temp_min, 0);

                                                
                fivedays_forecast.forEach(day => {    
                    if ( max < Math.round( day.main.temp_max, 0)){
                        max = Math.round( day.main.temp_max, 0);
                    } 
                    if ( min > Math.round( day.main.temp_min, 0)){
                        min = Math.round( day.main.temp_min, 0);
                    }
                    if (UnixTimeStampToDateTime(day.dt).getDay() != element.id) {
                        // update header info with max and min temperatures                        
                        update_day_header(element.id, current_day, max, min);
                        
                        // create new day element
                        current_day = day; 
                        element = add_day_forecast(current_day);             
                                                                    
                        max = Math.round( current_day.main.temp_max, 0);
                        min = Math.round( current_day.main.temp_min, 0);                    
                                                  
                    }
                    add_hour_forecast(element.id, day);                                       
                    });
                // update the last day header
                update_day_header(element.id, fivedays_forecast[fivedays_forecast.length-1], max, min);
                        
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
});

function getWindDirection(deg){

    let WIND_DIRECTION;    
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
    return WIND_DIRECTION;             
} 

function add_day_forecast(day){
    
    const element = document.createElement('div');                        
    const parent_element = document.createElement('div')
    const header_element = document.createElement('div')

    const dt = UnixTimeStampToDateTime(day.dt);                
    
    parent_element.id = 'parent-' + dt.getDay();
    parent_element.className = 'day';        
    document.querySelector('#forecast-view').append(parent_element);
    
    header_element.id= 'hdr-' + dt.getDay();
    document.getElementById(parent_element.id).append(header_element);                
    
    element.id = dt.getDay();
    document.getElementById(parent_element.id).append(element);                
                
    return element;                                
}

function update_day_header(element_id, day, max, min){
    // update header info
    const options = {weekday: 'short', month: 'short', day: 'numeric'};                
    const dt = UnixTimeStampToDateTime(day.dt);
    const w_icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    const txtDayHeader = `<h3 style="padding-left:10px">${dt.toLocaleString('pt-BR', options)}<img src ="${w_icon}"> High:${max}° Low:${min}°</h3>`;
    const header_id = 'hdr-'+ element_id;
        
    document.getElementById(header_id).innerHTML = txtDayHeader;  
}

function add_hour_forecast(parent_id, day_forecast){
    // display the forcast for each 3 hours period
    const options = {'hour':'2-digit', 'minute':'2-digit'};
    const element = document.createElement('div');

    const _temp = (day_forecast.main.temp.toFixed(0) + "");
    const _pop = (day_forecast.pop* 100).toFixed(0) 
    const dt = UnixTimeStampToDateTime(day_forecast.dt);
    const win_dir = getWindDirection(day_forecast.wind.deg);
    const weather_icon_src = `https://openweathermap.org/img/wn/${day_forecast.weather[0].icon}.png`;
    
    element.id= day_forecast.dt;    
    element.className = 'period';

    element.innerHTML = `<span>${dt.toLocaleTimeString('pt-BR', options)} </span> `; 
    
    element.innerHTML += `<span style="padding-left:5px;">${_temp}°</span> `;
    element.innerHTML += `<img src = ${weather_icon_src}>`;

    element.innerHTML += `<span style="padding-left:5px">${day_forecast.weather[0].description}</span> `;
    element.innerHTML += `<span style="padding-left:5px"><i class="fa fa-umbrella" aria-hidden="true"></i> ${_pop}%</span>`;
    element.innerHTML += `<span style="padding-left:5px; text-transform:none;"><i class="fa fa-location-arrow" aria-hidden="true"></i> ${day_forecast.wind.speed} m/s - ${win_dir}</span>`;    

    document.getElementById(parent_id).append(element);    
}

function UnixTimeStampToDateTime( unixTimeStamp ){
    // Unix timestamp is seconds past epoch
    dateTime = new Date(unixTimeStamp * 1000); 
    return dateTime;
}