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
        var card = $("<div data-index=\""+index+"\" class=\"card city mb-3\"></div>").appendTo('.city-list');
        var cardBody =$("<div class=\"card-body\">"+
                          //"<div class=\"container\">"+
                            //"<div class=\"row\">"+
                          "<h3 class=\"card-title\">"+
                            city.name+
                            "<button type=\"button\" class=\"btn btn-outline-danger float-right delete-city\">"+
                              "<i class=\"fas fa-trash-alt\"></i>"+
                            "</button>"+
                          "</h3>"+
                            //"</div>"+
                          //"</div>"+
                          "<p class=\"card-text\">"+
                            "<b>temp:</b> "+city.main.temp+"°</br><b>full time:</b> "+d.toString()+
                          "</p>"+
                        "</div>").appendTo(card);
        var commentsList = $("<ul class=\"list-group\"></ul>").appendTo(cardBody);
        // !city.comments || city.comments.forEach((comment, index) => commentsList.append("<li data-index=\""+index+"\">"+comment+"</li>"));
        !city.comments ? 0 : city.comments.forEach((comment, index) => commentsList.append( "<li data-index=\""+index+"\"  class=\"list-group-item comment\">"+
                                                                                              comment+
                                                                                              "<button type=\"button\" class=\"btn btn-outline-danger float-right delete-comment\">"+
                                                                                                "<i class=\"fas fa-trash-alt\"></i>"+
                                                                                              "</button>"+
                                                                                            "</li>"));
        cardBody.append("<form class=\"add-comment\">"+
                          "<div class=\"input-group\">"+
                            "<input type=\"text\" placeholder=\"Enter Comment\""+" class=\"form-control\" required>"+
                            "<div class=\"input-group-append\">"+
                              "<button type=\"submit\" class=\"btn btn-success\">Comment</button>"+
                            "</div>"+
                          "</div>"+
                        "</form>");
    });// end forEach city
    //add comment function 
    $('.add-comment').on('submit', function (event) {
        event.preventDefault();
        // console.log(event);
        if(!(cities[$(this).closest("div.city").data().index].comments)){
            cities[$(this).closest("div.city").data().index].comments = [$(this).find("input").val()];
        }
        else {
            cities[$(this).closest("div.city").data().index].comments.unshift($(this).find("input").val());
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
        cities[$(this).closest("div.city").data().index].comments.splice($(this).closest("li.comment").data().index, 1);
        saveToLocalStorage();
        updateList();
    });
}

$('.get-temp').on('submit', function (e) {
    // console.log(e);
    // console.log(event)
    event.preventDefault();
    getCityTemp($('.city-input').val());
    $('.city-input').val("");
});

var getCityTemp = function (city) {
    var apikey = "afb196bf89494ca1a0cd856cf4ff5f80"; //d703871f861842b79c60988ccf3b17ec
    var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&APPID="+apikey;
    $.ajax({
        method: "GET",
        url: url,
        success: function (data){
            cities.unshift(data);
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