document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#airpollution-btn').addEventListener('click', () =>                  
        {
            if (document.querySelector('#airpollution-view').style.display == 'block'){
                document.querySelector('#airpollution-view').style.display = 'none';
            } else {
                airpollution();                      
            }        
        }    
        
    )
    function airpollution() {
        url = '/airpollution';        
        city_lat = document.querySelector(`#city-lat`).innerHTML;
        city_lon = document.querySelector(`#city-lon`).innerHTML;       
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
            const air  = result.air_pollution_data.air_pollution[0];
            const aqui_index = ['','Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
            //console.log(aqui[air.main['aqi']]);
            var txtAqui = `Air Quality Index: ${air.main['aqi']}-${aqui_index[air.main['aqi']]}`;  
            var txtCon_CO = `Сoncentration of CO:${air.components['co']} μg/m3`;     
            // clean previous content
            document.querySelector('#airpollution-view').innerHTML = '';
            var element = document.createElement('div')
            element.className = 'caption px-1';            
            element.innerHTML = txtAqui + '---' + txtCon_CO;
            document.querySelector('#airpollution-view').append(element);               
            // show content
            //element.innerHTML = `<span>${dt.toLocaleTimeString('pt-BR', options)} </span> `; 
            document.querySelector('#airpollution-view').style.display = 'block';                
            })          
        .catch(error => {
            document.querySelector('#error-msg').style.display = 'block';
            document.querySelector('#error-msg').innerHTML= error;     
            console.log(error);                  
            }); 
        }
});

