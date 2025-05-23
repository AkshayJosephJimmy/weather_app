const searchCity=document.querySelector("#search");
const searchBtn=document.querySelector("#submit-city");
let weatherData={};
const currLoc=document.querySelector("#location");
const temp=document.querySelector("#temperature");
const windSpeed=document.querySelector("#wind");
const humidity=document.querySelector("#humidity");
const weatherIcon=document.querySelector("#weather-icon");
const forecastDiv=document.querySelectorAll(".forecast");
const apiKey="9c4260a5becc413596e111024250804";
const suggestion=document.querySelector("#suggestion-box");
const recentSearches=document.querySelector("#recent-searches");
const recentDiv=document.querySelector("#recent-div");
const currLocationBtn=document.querySelector("#current-button");

let timeout;


/* adding event listener to the search button */
searchBtn.addEventListener("click",getApi);

function getApi(){
  const city=searchCity.value;
    /* fetching the data from the weather api */
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=6`)
    .catch((error)=>{
        console.log("Error:",error);
        alert("Please enter a valid city name");
    })
    .then((response)=>response.json())
    .then((data)=>{
        
      weatherData=data;
      console.log(weatherData);
      /* filling the data in the html elements */
      currLoc.innerHTML=`${city}`
      temp.innerHTML=`${weatherData.current.temp_c}°C`
      windSpeed.innerHTML=`Wind Speed: ${weatherData.current.wind_kph} km/h`
      humidity.innerHTML=`Humidity: ${weatherData.current.humidity}%`
      weatherIcon.setAttribute("src",`${weatherData.current.condition.icon}`);
      /* filling the data in the forecast divs */
      for(let i=0;i<forecastDiv.length;i++){
        forecastDiv[i].children[0].innerHTML=`${weatherData.forecast.forecastday[i+1].date}`;
        forecastDiv[i].children[1].innerHTML=`Temperature:${weatherData.forecast.forecastday[i+1].day.avgtemp_c}°C`;
        forecastDiv[i].children[2].innerHTML=`Wind:${weatherData.forecast.forecastday[i+1].day.maxwind_kph} km/h`;
        forecastDiv[i].children[3].innerHTML=`Humidity:${weatherData.forecast.forecastday[i+1].day.avghumidity}%`;
        forecastDiv[i].children[4].setAttribute("src",`${weatherData.forecast.forecastday[i+1].day.condition.icon}`);
      }
      recentDiv.style.display="block";
      /*checking if the city is already in the recent searches */
      const already=[...recentSearches.children[0].children].some((item)=>item.innerHTML===city)

      if(!already){
        /* if not then create a new li element and append it to the recent searches */
      var searchItem=document.createElement("li");
      recentSearches.children[0].appendChild(searchItem);
      searchItem.classList.add("search-item");
      searchItem.innerHTML=`${city}`;
      }
      searchItem.addEventListener("click",()=>{
        searchCity.value=city;
        getApi();
      })


        })

       

}
/* adding event listener to the recent searches div */
recentDiv.addEventListener("click",()=>{
          
  if(recentSearches.style.display==="block"){
    recentSearches.style.display="none";
    
    
  }else{
    recentSearches.style.display="block";
    
    
  }

})
/*putting autocomplete function on the search input */
searchCity.addEventListener('input',autoCorrect);
function autoCorrect(){
  const input=searchCity.value.trim();
  clearTimeout(timeout);
  suggestion.innerHTML="";
  timeout=setTimeout(()=>{
    fetch(`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${input}`)
     .then((response)=>response.json())
     .then((data)=>{
       console.log(data);
       
       /*dropdown the suggestion box */
       data.forEach(element => {
         
        const p=document.createElement("p");
        p.innerHTML=element.name;
        p.classList.add("suggestion");
        suggestion.appendChild(p);
        p.addEventListener("click",()=>{
          searchCity.value=element.name;
          suggestion.innerHTML="";
          getApi();
        })
        p.addEventListener("mouseover",()=>{
          p.style.backgroundColor="lightblue";
        })
        p.addEventListener("mouseout",()=>{
          p.style.backgroundColor="white";
        })
        
       });
       
      
       

     })
   },300)

}
/* adding event listener to the current location button */
currLocationBtn.addEventListener("click",getCurrentLocation);
function getCurrentLocation(){
  if(navigator.geolocation){
    /* getting the current location of the user */
    navigator.geolocation.getCurrentPosition((position)=>{
      const lat=position.coords.latitude;
      const lon=position.coords.longitude;
      /* fetching the data from the weather api from latitude and longitude */
      fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=6`)
      .then((response)=>response.json())
      .then((data)=>{
        weatherData=data;
        console.log(weatherData);
        currLoc.innerHTML=`${weatherData.location.name}`;
        temp.innerHTML=`${weatherData.current.temp_c}°C`
        windSpeed.innerHTML=`Wind Speed: ${weatherData.current.wind_kph} km/h`
        humidity.innerHTML=`Humidity: ${weatherData.current.humidity}%`
        weatherIcon.setAttribute("src",`${weatherData.current.condition.icon}`);
        for(let i=0;i<forecastDiv.length;i++){
          forecastDiv[i].children[0].innerHTML=`${weatherData.forecast.forecastday[i+1].date}`;
          forecastDiv[i].children[1].innerHTML=`Temperature:${weatherData.forecast.forecastday[i+1].day.avgtemp_c}°C`;
          forecastDiv[i].children[2].innerHTML=`Wind:${weatherData.forecast.forecastday[i+1].day.maxwind_kph} km/h`;
          forecastDiv[i].children[3].innerHTML=`Humidity:${weatherData.forecast.forecastday[i+1].day.avghumidity}%`;
          forecastDiv[i].children[4].setAttribute("src",`${weatherData.forecast.forecastday[i+1].day.condition.icon}`);
        }
      })
    })
  }
  else{
    alert("Geolocation is not supported by this browser.");
  }
}




