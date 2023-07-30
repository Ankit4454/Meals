window.onload = function () {
    //It will set empty list in local storage of browser
  if (localStorage.getItem("favList") == null) {
    localStorage.setItem("favList", JSON.stringify([]));
  }
  loadFavouriteMeals();
};

//Function for Side menu (Favourite List)
function showDrawer() {
  let sideDrawer = document.getElementById("sideDrawer").classList;
  if (document.getElementById("menu").checked) {
    sideDrawer.add("showDrawer");
  } else {
    sideDrawer.remove("showDrawer");
  }
}

//This function will animate text form left to right if text width is larger than it's parent div
function textAnimation() {
  document.querySelectorAll(".itemName").forEach((item) => {
    let container = item;
    let text = item.getElementsByTagName("h3")[0];

    if (container.clientWidth < text.clientWidth) {
      text.classList.add("animate");
    }
  });
}

//This function will fetch the requestd data from Meals API
async function fetchDataFromAPI(url, keyword) {
  let res = await fetch(`${url + keyword}`);
  let meals = await res.json();
  return meals;
}

//This function will render all meals according to search parameter
async function getMealList() {
  let list = JSON.parse(localStorage.getItem("favList"));
  let keyword = document.getElementById("search").value;
  let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  let data = await fetchDataFromAPI(url, keyword);
  let itemsDiv = document.getElementById("itemsDiv");
  let htmlString = ``;

  if (data.meals) {
    htmlString = data.meals
      .map((item) => {
        return `<div class="card">
        <div class="card2">
            <img src="${item.strMealThumb}"
            class="card-img-top" alt="...">
            <div class="cardContent">
                <div class="itemName">
                    <h3>${item.strMeal}</h3>
                    <div class="fader fader-left"></div>
                    <div class="fader fader-right"></div>
                </div>           
                <div class="btnDiv">
                    <div class="container">
                        <a href="aboutMeal.html?item=${item.idMeal}" target="_blank" class="button">Learn More</a> 
                        <span class="arrow first">
                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                          </svg>
                        </span>
                        <span class="arrow second">
                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                          </svg>
                        </span>
                        <span class="arrow third">
                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                          </svg>
                        </span>
                    </div>
                    <div class="favouriteDiv">
                        <label>
                            <input type="checkbox" id="fav${item.idMeal}" onclick="fillHeart(${item.idMeal});toggleFavouriteList(${item.idMeal});" ${list.indexOf(parseInt(item.idMeal)) != -1 ? 'checked': ''}>
                            <i class="${list.indexOf(parseInt(item.idMeal)) != -1 ? 'fa-solid': 'fa-regular'} fa-heart" id="${item.idMeal}"></i>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
      })
      .join("");
  } else {
    htmlString = `<h1>We Couldn't find anything :(</h1>`;
  }
  itemsDiv.innerHTML = htmlString;
  textAnimation();
}

function fillHeart(id) {
  let item = document.getElementById(id).classList;
  if (document.getElementById("fav" + id).checked) {
    item.add("fa-solid");
    item.remove("fa-regular");
  } else {
    item.remove("fa-solid");
    item.add("fa-regular");
  }
}

//This function will load all favourite meals from the stored list
async function loadFavouriteMeals() {
  let list = JSON.parse(localStorage.getItem("favList"));
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let htmlString = ``;
  let favouriteListDiv = document.getElementById("favouriteListDiv");

  if (list.length > 0) {
    for (let i = 0; i < list.length; i++) {
      let data = await fetchDataFromAPI(url, list[i]);

      if (data.meals) {
        htmlString += `<div class="favItem">
                <div class="favImageDiv">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                </div>
                <div class="favItemInfo">
                    <div class="itemName noPaddding">
                        <h3>${data.meals[0].strMeal}</h3>
                    </div> 
                    <div class="favBtnDiv">
                        <div class="container">
                            <a href="aboutMeal.html?item=${data.meals[0].idMeal}" target="_blank" class="button2">Learn More</a> 
                        </div>
                        <div class="favouriteDiv">
                            <label>
                                <i class="fa-solid fa-trash" onclick="toggleFavouriteList(${data.meals[0].idMeal});"></i>
                            </label>  
                        </div>
                    </div>
                </div>
            </div>`;
      }
    }
  } else {
    htmlString = `<h2 style="text-align:center;margin-top:1rem;">No Favourites Yet!</h2>`;
  }
  favouriteListDiv.innerHTML = htmlString;
  textAnimation();
}

//This function will add/remove item from the favourite list
function toggleFavouriteList(id) {
  let list = JSON.parse(localStorage.getItem("favList"));
  let index = list.indexOf(id);

  if (index == -1) {
    list.push(id);
  } else {
    list.splice(index, 1);
  }

  localStorage.setItem("favList", JSON.stringify(list));
  loadFavouriteMeals();
  getMealList();
}
