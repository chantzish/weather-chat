// cities info array
var cities = [];
// var sorted = "false";

var updateList = function (){
    $('.city-list').empty();
    if (cities.length > 0){
        $('.city-list').append("<button type=\"button\" onclick=\"sortByName();\">sort by name</button>");
        $('.city-list').append("<button type=\"button\" onclick=\"sortByName();\">sort by temp</button>");
        $('.city-list').append("<button type=\"button\" onclick=\"sortByName();\">sort by date</button>");
        $('.city-list').append("<button type=\"button\" onclick=\"clearAll();\">clear all</button>");
    }
    cities.forEach((city, index) => {
        // https://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date
        // (new Date(city.dt * 1000)).toString();
        var d = new Date(0);
        d.setUTCSeconds(city.dt);
        var div = $("<div data-index=\""+index+"\" class=\"city\"><h3>"+city.name+"</h3><p><b>temp:</b> "+city.main.temp+
        "°</br><b>full time:</b> "+d.toString()+"</p><button type=\"button\" class=\"delete-city\">Delete</button></div>").appendTo('.city-list');
        var commentsList = $("<ul></ul>").appendTo(div);
        // !city.comments || city.comments.forEach((comment, index) => commentsList.append("<li data-index=\""+index+"\">"+comment+"</li>"));
        !city.comments ? 0 : city.comments.forEach((comment, index) => commentsList.append("<div data-index=\""+index+"\"  class=\"comment\">"+comment+
        "<button type=\"button\" class=\"delete-comment\">Delete</button></div>"));
        div.append("<form class=\"add-comment\"><input type=\"text\" placeholder=\"Enter Comment\" required><button type=\"submit\">Comment</button></form>");
    });
    //add comment function 
    $('.add-comment').on('submit', function () {
        // event.preventDefault();
        // console.log(event);
        if(!(cities[$(this).closest("div").data().index].comments)){
            cities[$(this).closest("div").data().index].comments = [$(this).find("input").val()];
        }
        else {
            cities[$(this).closest("div").data().index].comments.push($(this).find("input").val());
        }
        saveToLocalStorage();
        updateList();
    });
    // delete city
    $('.delete-city').click(function () {
        cities.splice($(this).closest("div.city").data().index, 1);
        saveToLocalStorage();
        updateList();
    });
    //delete comment
    $('.delete-comment').click(function () {
        cities[$(this).closest("div.city").data().index].comments.splice($(this).closest("div.comment").data().index, 1);
        saveToLocalStorage();
        updateList();
    });
}

$('.get-temp').on('submit', function (e) {
    // console.log(e);
    // console.log(event)
    event.preventDefault();
    getCityTemp($('.city-input').val());
});

var getCityTemp = function (city) {
    var apikey = "afb196bf89494ca1a0cd856cf4ff5f80"; //d703871f861842b79c60988ccf3b17ec
    var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&APPID="+apikey;
    $.ajax({
        method: "GET",
        url: url,
        success: function (data){
            cities.push(data);
            saveToLocalStorage();
            updateList();
        },
        error: function (error){
            alert("error");
        }
    })
}

var saveToLocalStorage = function () {
    localStorage.setItem('weather-chat', JSON.stringify(cities));
};

var restoreFromLocalStorage = function () {
    cities = JSON.parse(localStorage.getItem('weather-chat')) || [];
    updateList();
};

restoreFromLocalStorage();

var getCurrentTemp = function () {
    cities.forEach(city => getCityTemp(city.name))
}

getCurrentTemp();

var sortByName = function () {
    cities.sort(function (a,b) {
        if (a.name > b.name){
            return 1;
        }
        if (a.name < b.name){
            return -1;
        }
        return 0;
    });
    saveToLocalStorage();
    updateList();
}

var sortByTemp = function () {
    cities.sort(function (a,b) {
        return a.main.temp - b.main.temp;
    });
    saveToLocalStorage();
    updateList();
}

var sortByDate = function () {
    cities.sort(function (a,b) {
        return a.dt - b.dt;
    });
    saveToLocalStorage();
    updateList();
}

var clearAll = function () {
    cities = []
    saveToLocalStorage();
    updateList();
}