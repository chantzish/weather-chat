// cities info array
var cities = [];

var updateList = function (){
    $('.city-list').empty();
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
        console.log(event);
        if(!(cities[$(this).closest("div").data().index].comments)){
            cities[$(this).closest("div").data().index].comments = [$(this).find("input").val()];
        }
        else {
            cities[$(this).closest("div").data().index].comments.push($(this).find("input").val());
        }
        updateList();
    });
    // delete city
    $('.delete-city').click(function () {
        cities.splice($(this).closest("div.city").data().index, 1);
        updateList();
    });
    //delete comment
    $('.delete-comment').click(function () {
        cities[$(this).closest("div.city").data().index].comments.splice($(this).closest("div.comment").data().index, 1);
        updateList();
    });
}

$('.get-temp').on('submit', function (e) {
    console.log(e);
    console.log(event)
    event.preventDefault();
    var url = "http://api.openweathermap.org/data/2.5/weather?q="+$('.city-input').val()+"&units=metric&APPID=d703871f861842b79c60988ccf3b17ec"
    $.ajax({
        method: "GET",
        url: url,
        success: function (data){
            cities.push(data);
            updateList();
        },
        error: function (error){
            alert("error");
        }
    })
});

var saveToLocalStorage = function () {
    
}