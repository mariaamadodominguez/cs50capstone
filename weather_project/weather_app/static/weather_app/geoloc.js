document.addEventListener('DOMContentLoaded', () => {

    var save_btns = Array.from(document.getElementsByClassName('save-button')) ;
    console.log(save_btns)
    save_btns.forEach(_btn => {    
        document.getElementById(_btn.id).addEventListener('click', () =>                  
            saveCity(_btn.id));            
        })      


    function saveCity(city_id) {
        url = '/addNewCity'     
        console.log(url, city_id); 
        console.log( document.querySelector(`#name${city_id}`).innerHTML);
        console.log(document.querySelector(`#lat${city_id}`).innerHTML);
        console.log( document.querySelector(`#lon${city_id}`).innerHTML);
        console.log(document.querySelector(`#country${city_id}`).innerHTML);
        console.log( document.querySelector(`#state${city_id}`).innerHTML);
       
        fetch(url,{
            headers: {"X-CSRFToken":document.querySelector('[name=csrfmiddlewaretoken]').value},
            method: 'POST',   
            body: JSON.stringify({
                city: document.querySelector(`#name${city_id}`).innerHTML,
                lat : document.querySelector(`#lat${city_id}`).innerHTML,
                lon : document.querySelector(`#lon${city_id}`).innerHTML,
                country : document.querySelector(`#country${city_id}`).innerHTML,
                state : document.querySelector(`#state${city_id}`).innerHTML,
                })
            }
        )
        .then((resp) => resp.json())
        .then((result) => {      
            console.log(result); 
            document.querySelector('#error-msg').style.display = 'block';
            document.querySelector('#error-msg').innerHTML= result.message;     
            })          
        .catch(error => {
            document.querySelector('#error-msg').style.display = 'block';
            document.querySelector('#error-msg').innerHTML= error;     
            console.log(error);                  
            }); 
        }        
});