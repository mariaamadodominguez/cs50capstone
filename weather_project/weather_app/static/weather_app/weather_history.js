document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#monthly-weather-btn').addEventListener('click', () =>                  
        weather_history());   

});

function weather_history() {
    url = '/weatherhistory';
        console.log(url); 
        city_lat = document.querySelector(`#city-lat`).innerHTML;
        city_lon = document.querySelector(`#city-lon`).innerHTML;        
        const dtEnd = new Date(); 
        const dtStart = new Date(dtEnd.getFullYear()-1, dtEnd.getMonth(), dtEnd.getDate());
        console.log('dtStart', dtStart.toDateString('YYYMMDD'), 'dtEnd', dtEnd.toDateString('YYYMMDD'));
        console.log('city_lat', city_lat, 'city_lon', city_lon);
        fetch(url,{
            headers: {"X-CSRFToken":document.querySelector('[name=csrfmiddlewaretoken]').value},
            method: 'POST',   
            body: JSON.stringify({
                lat : city_lat,
                lon : city_lon,
                dtStart: dtStart.toDateString('YYYMMDD'),
                dtEnd: dtEnd.toDateString('YYYMMDD'),
                })
            }
        )
        .then((resp) => resp.json())
        .then((result) => {                  
            console.log("result:", result);
            if (result.cod != 200) {
                document.querySelector('#error-msg').style.display = 'block';
                document.querySelector('#error-msg').innerHTML= result.message;         
                //console.log("result error:", result.message);
            } else {
                // show content
                document.querySelector('#monthly-weather-view').style.display = 'block';      
                document.querySelector('#monthly-weather-view').innerHTML = result.graph;
                }
            })          
        .catch(error => {
            document.querySelector('#error-msg').style.display = 'block';
            document.querySelector('#error-msg').innerHTML= error;     
            console.log(error);                  
            }); 
    }        