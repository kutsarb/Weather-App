$(document).ready(function(){

    var cities = [];

    $("#currentCity").hide();
    $("#fiveDay").hide();

    function currentCityForecast(city){
        var apiKey = "e03d2591655463dd5306c7bb89761fd3";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            var weatherIcon = response.weather[0].icon;
            var date = $("<h2>").text(moment().format('l'));
            var icon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"); 
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
                
            $("#currentName").text(response.name);
            $("#currentName").append(date);
            $("#currentName").append(icon);
            $("#currentTemp").text(tempF.toFixed(2) + " \u00B0F");
            $("#currentHumidity").text(response.main.humidity + "%");
            $("#currentWind").text(response.wind.speed + "MPH");

                var lat = response.coord.lat
                var lon = response.coord.lon
                queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon; 
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function(response){
                    var uvIndex = response.value;
                    $("#cityUV").removeClass("favorable");
                    $("#cityUV").removeClass("moderate");
                    $("#cityUV").removeClass("severe");
                        if (uvIndex <= 2.9){
                            $("#cityUV").addClass("favorable");
                        } else if (uvIndex >= 3 && uvIndex <= 7.9){
                            $("#cityUV").addClass("moderate");
                        } else {
                            $("#cityUV").addClass("severe");
                        };

                        $("#cityUV").text(response.value);
                    
                });   

                $("#currentCity").show();   
        }); 
    };
        
    function fiveDayForecast(city){
        var apiKey = "818e5b0e3e17697364971c8cea59f2dd"
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;
    
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            var counter = 1
            for(var i=0; i < response.list.length; i += 8){
                var date = moment(response.list[i].dt_txt).format("l");
                var weatherIcon = response.list[i].weather[0].icon;
                var tempF = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                    
                $("#date" + counter).text(date);
                $("#icon" + counter).attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                $("#temp" + counter).text(tempF.toFixed(2) + " \u00B0F");
                $("#humid" + counter).text(response.list[i].main.humidity + "%"); 
                counter++;

            };

            $("#fiveDay").show();   
        });
    };

    function createCityLists(city){
        var cityLi = $("<li>").text(city)
        cityLi.addClass("cityList");
        $("#cityList").append(cityLi); 
    };

    function renderCities(){
        $("#cityList").empty();
        for (var i = 0; i < cities.length; i++) { 
            createCityLists(cities[i]);
        };
    };

    function weather(city){
        currentCityForecast(city);
        fiveDayForecast(city);
    };

    function init() {
        var storedCities = JSON.parse(localStorage.getItem("searches"));
    
        if (storedCities) {
            cities = storedCities;
            renderCities();
            weather(cities[cities.length -1]);
        }; 
    };
    init();

    $("#searchBtn").click(function(){
        var cityInputs = $(this).siblings("#userInput").val().trim();
        $("#userInput").val("");
        if (cityInputs !== ""){
            if (cities.indexOf(cityInputs)== -1){
                cities.push(cityInputs);
                localStorage.setItem("searches",JSON.stringify(cities));
                createCityLists(cityInputs);
            };
            
            weather(cityInputs);
        };
    });

    $("#cityList").on("click", ".cityList", function(){
        var cityOnButton = $(this).text();
        weather(cityOnButton);
    });

});