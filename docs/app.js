const endpoint = "data.json";
const eventinfo = [];
const sliders = [];
const eventCard_contEL = document.querySelector(".EventCard_cont");
const ui_ContEL = document.querySelector(".UI_cont");;
const searchbarEl = document.getElementById("searchId");
const calanderEl = document.getElementById("calId");

console.log(moment());

class event{
    constructor(eventDateName,name,dateOfShow,userGroupName,eventHallName,imageSource, cardId, price){
        this.eventDateName = eventDateName;
        this.name = name;
        this.dateOfShow = dateOfShow;
        this.userGroupName = userGroupName;
        this.eventHallName = eventHallName;
        this.imageSource = imageSource;
        this.cardId = cardId;
        this.price = price;
    }
    build(){
        let div = document.createElement("div");
        div.id = this.cardId;
        div.className = "event";
        div.innerHTML += `<img class="imgClass" src="${this.imageSource}">
        <h1>Name: ${this.name}</h1>
        <p>Date: ${moment(this.dateOfShow).format("LLL")}</p>
        <p>Location: ${this.eventHallName}</p>
        <p>Group: ${this.userGroupName}</p>
        <p>Price: ${this.price}</p>`;
        eventCard_contEL.appendChild(div);
        
    }

}
function hider(ids, priceValue){
  for (let i = 0; i < ids.length; i++) {
    if (ids[i].price < priceValue) {
      console.log(ids[i].cardId);
      priceDiv = document.querySelector(`#${ids[i].cardId}`);
      priceDiv.style.display = "none";
    }
    else{
      priceDiv = document.querySelector(`#${ids[i].cardId}`);
      priceDiv.style.display = "block";
      
    }
    
  }
}

function resetter(ids){
  for (let i = 0; i < ids.length; i++) {
    idDiv = document.querySelector(`#${ids[i].cardId}`);
    idDiv.style.display = "block";
    
  }
  for (let i = 0; i < sliders.length; i++) {
     hider(eventinfo,sliders[i].value)
    }

}



function CreateSlider(min,max, id){
  let div = document.createElement("div");
  div.id = `sliderDiv${id}`;
  div.className = "sliderDivClass";
  div.innerHTML=`<p>${min}</p><input type="range" min="${min}" max="${max}" value="1" id="slider${id}" class="sliderClass"><p>${max}</p><p>value:</p><p class="value">0</p>`
  ui_ContEL.appendChild(div)
  sliders.push(document.getElementById(`slider${id}`));
}

function SearchEngine(text){
  resetter(eventinfo);
  for (let i = 0; i < eventinfo.length; i++) {
    evenetStringName = eventinfo[i].name.toLowerCase();
    if (!evenetStringName.includes(text.toLowerCase())) {
      priceDiv = document.querySelector(`#${eventinfo[i].cardId}`);
      priceDiv.style.display = "none";
    }
  }
}


function Calander(date){
  resetter(eventinfo);
  for (let i = 0; i < eventinfo.length; i++) {
    if (moment(eventinfo[i].dateOfShow).format("YYYY-MM-DD") != date) {
      priceDiv = document.querySelector(`#${eventinfo[i].cardId}`);
      priceDiv.style.display = "none";
    }
  }
}

fetch(endpoint)  
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('villa nr: ' + response.status);
        return;
      }

      response.json().then(function(data) {
        maxPrice = 0;
  			for (var i = 0; i < data.results.length; i++) {			
                    let _data = data.results[i];
                    let cardId = "id"+i;
                    if (maxPrice < _data.price) {
                      maxPrice = _data.price;
                    }
					          eventinfo.push(new event(_data.eventDateName,_data.name,_data.dateOfShow,_data.userGroupName,_data.eventHallName,_data.imageSource, cardId, _data.price ))
        };
          for (let i = 0; i < eventinfo.length; i++) {
            eventinfo[i].build();
          }	

          CreateSlider(0,maxPrice,1);

          for (let i = 0; i < sliders.length; i++) {
            sliders[i].oninput = function(){
              console.log(this.value);
              document.querySelector(`.value`).innerHTML = this.value;
              hider(eventinfo,this.value);
            }
            sliders[i].addEventListener("mousemove", function(){
              
            })
            
          }
          searchbarEl.addEventListener("keyup",function(){SearchEngine(this.value)})
          
          calanderEl.addEventListener("change",function(){Calander(this.value)});
      }
      );
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });


  console.log(eventinfo);