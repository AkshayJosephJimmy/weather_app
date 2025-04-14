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

let timeout;



searchBtn.addEventListener("click",getApi);

function getApi(){
  const city=searchCity.value;
    
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=6`)
    .catch((error)=>{
        console.log("Error:",error);
        alert("Please enter a valid city name");
    })
    .then((response)=>response.json())
    .then((data)=>{
        
      weatherData=data;
      console.log(weatherData);
      currLoc.innerHTML=`${city}`
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
      recentDiv.style.display="block";
      const already=[...recentSearches.children[0].children].some((item)=>item.innerHTML===city)
      if(!already){
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

        recentDiv.addEventListener("click",()=>{
          if(recentSearches.style.display==="none"){
            recentSearches.style.display="block";
          }else{
            recentSearches.style.display="none";
          }

        })



}
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



