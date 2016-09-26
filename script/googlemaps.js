/*

zipcodechecker - DONE

create map - DONE
display markers - DONE
ask user location - DONE
    yes - display location -DONE
        -check if within 5 counties -DONE. 
            yes 
                -calculate distance to nearest warehouse -DONE
                -route - done
            no 
                - display error message 
    no - ask to enter address -DONE
        - check if within 5 counties -partial
            yes - DONE
                - calculate distance to nearest warehouse -DONE
                - route - DONE
            no  - partial
                - display error message - DONE
                
simulate 
    route - DONE
    get time needed from route (ex 15 mins)
    get coordinates from route ->result.routes[0].overview_path
        set display interval to 1min 
    divide time needed by display interval -> 15 intervals
        get 15 intervals from route
        after each interval, move the 'truck' location until destination
    
    
TODO: integrate with vieworder.php page
    i
        
*/

var locations = [
['Antioch', 38.01081, -121.83624],
['Walnut Creek', 37.91706, -122.0667],
['Oakland', 37.80436, -122.27111],
['Fremont', 37.54826, -121.98857],
['San Francisco', 37.78718, -122.40785],
['San Francisco', 37.74349, -122.47056],
['Milbrae', 37.59854, -122.38719],
['Menlo Park', 37.45364, -122.18222],
['Santa Clara', 37.4059, -121.99614],
['Santa Clara', 37.25347, -121.79809]
];

var map; //global variable


/**blurzipcode
this is triggered when a user enters zipcode and moves away from that form field.
displays the status without having to click any other buttons
*/
function blurZipCode(){
    console.log("blurzipcode");
    var zipcode = document.getElementById("zipcode").value;
    if (zipcode != "")
        zipcodeChecker();
}

/**zipcodechecker
gets the zipcode value from zipcode div in index.php 
passes the value to 'withinfivecouties' function as a string,
get the value returned via retva (async function) and based on retval,
figure out the operation.
*/
function zipcodeChecker(){
    var zipcode = document.getElementById("zipcode").value;

    withinFiveCounties(zipcode, function(retVal){
        console.log("inside w5c retval", retVal);
        if (retVal){
            //document.getElementById('zipstatus').style.visibility = 'hidden';
            document.getElementById('zipstatus').innerHTML = "<h5>Yes, We deliver to your location.</h5>";
            document.getElementById('submit-btn').disabled = false;
        }
        else{
            document.getElementById('zipstatus').style.visibility = 'visible';
            document.getElementById('zipstatus').innerHTML = "<h5>Sorry, You're Out Of Our Delivery Zone</h5>";
            document.getElementById('submit-btn').disabled = true;
        }
        zipstatus = status;
    });
        
}

/**mapconfig
loads the map function. 
create a map.
display the markers
grab address as displayed in browser
and send that address for routing
*/

window.onload = function mapConfig() {
    createMap();
	displayMarkers(map);
	//var addr = addressProcessor();
	var address = {address:addressProcessor()};
	var geocoder = new google.maps.Geocoder;
    geocoder.geocode(address, (function (results, status) { 
	console.log("onload address", address);
        temp = results;
        if (status === google.maps.GeocoderStatus.OK) {
			var lat = results[0].geometry.location.lat();
			var lng = results[0].geometry.location.lng();
			var coords = new google.maps.LatLng(lat, lng);
			routeCalculations(coords);
            console.log("results", results, lat, lng);
          //  var latlng = results[0].geometry[0];
          //  console.log("onload latlng", latlng);
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  }));
//displayRoute('Mountain View,ca', 'Sunnyvale, CA');
 //   displayMarkers(map);
    
    // if (navigator.geolocation) {
       // var pos = navigator.geolocation.getCurrentPosition(userLocation, userLocationDenied);
    // } else {
        // document.getElementById('map').innerHTML = 'Geo Location is not supported';
    // }
}

/**createMap
creates a map with given latlng and center positions
*/

function createMap(){
    var mapcanvas = document.createElement('div');
    mapcanvas.id = 'mapcontainer';
    mapcanvas.style.height = '400px';
    //mapcanvas.style.width = '550px';

    document.getElementById('map').appendChild(mapcanvas);

    var options = {
        zoom: 8,
        center: new google.maps.LatLng(37.566418,-122.1207166),
        mapTypeControl: false,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("mapcontainer"), options);
}

/**displayMarkers
@param map - map object that was created from createMap function

runs through the global storelocation variables
and displays a marker where each of them are positioned. 
*/

function displayMarkers(map){
    
    var position;
    var info="";
    for (var i=0; i<locations.length; i++){
        var storeLoc = new google.maps.Marker({
            label:locations[i][0],
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map:map,
            
        });
        
        var infowindow = new google.maps.InfoWindow();
        
        google.maps.event.addListener(storeLoc, 'click', (function(storeLoc, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, storeLoc);
        }
      })(storeLoc, i));
    }
}

/**process address
reads address from vieworderdetail page
and grab the street name and zipcode
*/
function addressProcessor(){
	var addr = document.getElementById("address").innerHTML;
	return (addr = addr.replace("<br>", ", "));
}

function userLocation(position){
//    console.log("userlocation pos", position);
//    console.log("userlocation map", map);
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
//    console.log("userLocation lat lng", lat, "", lng);
    var coords = new google.maps.LatLng(lat, lng);
    
    console.log("userlocation coords", coords.lat());
    
 //   document.getElementById('status').innerHTML = position.coords.latitude;
    withinFiveCounties(coords, function(retVal){
        console.log("userlocation retval", retVal);
    });
    var marker = new google.maps.Marker({
      position: coords,
      map: map,
      title:"You are here!",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5.5,
        fillColor: "#4286F5",
        fillOpacity: 0.7,
        strokeWeight: 1
        },
    });
    var marker2 = new google.maps.Marker({
      position: coords,
      map: map,
      title:"You are here!",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 11.0,
        fillColor: "#4286F5",
        fillOpacity: 0.1,
        strokeWeight: 0.4
        },
    });

    searchLoc();
}

//called when user denies location through browser
function userLocationDenied(err){
    var errMsg = err.message;
    console.log(errMsg);
    document.getElementById('status').innerHTML = err.message + '. Enter your location on the search box above';
    
    searchLoc();
    
}

function searchLoc(){
 //   console.log(3);
    var box = document.getElementById('pac-input');
    box.style.display = "block";
    var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
    
   //map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('pac-input'));
   google.maps.event.addListener(searchBox, 'places_changed', function() {
     searchBox.set('map', null);


     var places = searchBox.getPlaces();
     var bounds = new google.maps.LatLngBounds();
     var i, place;
    for (i = 0; place = places[i]; i++) {
         
    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();
        
        var coords = new google.maps.LatLng(lat, lng); 
        routeCalculations(coords);
    
         
       (function(place) {
         var marker = new google.maps.Marker({
            
           position: place.geometry.location
         });
         marker.bindTo('map', searchBox, 'map');
         google.maps.event.addListener(marker, 'map_changed', function() {
           if (!this.getMap()) {
             this.unbindAll();
           }
         });
         bounds.extend(place.geometry.location);
           

       }(place));
/*     }
         else
             document.getElementById('status').innerHTML = 
            "You are out of our delivery zone";*/
         
         
     }
     map.fitBounds(bounds);
     searchBox.set('map', map);
     map.setZoom(Math.min(map.getZoom(),12));

   });
 }

/** 
withinFiveCounties - returns if the given lat lng is in within the five counties (1) or not(0). uses google maps geocoder. FN in paramater is because geocode is a async function that doesnt return value so fn carries the value back to the caller.

i is the location where county name is found in 
https://maps.googleapis.com/maps/api/geocode/xml?address=94087
*/

function withinFiveCounties(address, fn){
    console.log(address, typeof(address));
 //   console.log("withinFiveCounties lat lng", latitude, "", longitude);
    //if address is as lat/lng 
    if (typeof(address) == "object"){
        console.log(address.lat());
        console.log(address.lng());
        address = {location:address};
        console.log(address);
        i = 4;
    } else{     //if zipcode
        console.log(typeof(address))
        address = {address:address};    //ok for zipcode
        i = 2;
    }
    
    var retVal;
    var arrOfLocations = [
        "Antioch County",
        "San Francisco County",
        "Santa Clara County",
        "Alameda County",
        "Contra Costa County",
        "San Jose"];
    var geocoder = new google.maps.Geocoder;
    
    console.log("w5counties address2", typeof(address));
    geocoder.geocode(address, (function (results, status) { 
        temp = results;
        console.log(7);
        if (status === google.maps.GeocoderStatus.OK) {
            console.log(8);
            console.log("results", results);
            var county = results[0].address_components[i].long_name;
            console.log("w5c county", county);
            if (arrOfLocations.indexOf(county) > -1){
                retVal = 1;
            }
            else{
                retVal = 0;
            }
    } else {
      window.alert('Geocoder failed due to: ' + status);
        retVal = 0;
    }
        fn(retVal);
  }));
}


//pass the current user/search location object and it'll calculate 
//distance and route to the closest warehouse
function routeCalculations(userCoords){
    var aryOfLocs = [];
    var userLat = userCoords.lat();
    var userLng = userCoords.lng();
    console.log("routeCalculations", "userlat", userLat, "userlng", userLng);
    
    for (var j = 0; j < locations.length; j++){
        var storeLat = locations[j][1];
        var storeLng = locations[j][2];
        var p1 = new google.maps.LatLng(storeLat, storeLng);
        var p2 = new google.maps.LatLng(userLat,userLng);
        
        aryOfLocs[j] = {"distance":calcDistance(p1, p2), "coords": p1};
       // console.log("distance", aryOfLocs[j], " from ", locations[j]);
    }
    function sortAry(a,b){
        return a.distance-b.distance;
    }
    aryOfLocs.sort(sortAry)
//    console.log(aryOfLocs[0].coords.lat()); //this is tring
    //aryoflocs[0].coords is store location. coords is user location
    displayRoute(aryOfLocs[0].coords, userCoords);
}

/**displayRoute - initialize the google maps api required for routing service */
function displayRoute(storeLoc, userLoc){
    console.log("storeloc", storeLoc, userLoc);
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    request = {
        origin: storeLoc,
        destination: userLoc,
        travelMode: google.maps.TravelMode.DRIVING
  };
    directionsService.route(request, function(result, status) {
        simulateDriving(result);
   //        console.log("directionservices result", result[0].routes[0].overview_path[0].lat());
    if (status == google.maps.DirectionsStatus.OK) {    

      directionsDisplay.setDirections(result);
  //    directionsService.setDirections(result);
    } else {
      alert("couldn't get directions:" + status);
    }
  });
}

/**simulateDriving
@param aryOfCoords - array of coords generated in displayRoute
arrayofcoords are a bunch of lat/lng coordinates that is routed between given two locations.
this function calculates the drive time and total number of coordinates and uses that value 
to calculate the optimum display interval.
the location is updated every 'updatePeriod' seconds until the item has been delivered
*/

function simulateDriving(aryOfCoords){
    orderTime = new Date(document.getElementById("date").innerHTML);
//    orderTime = new Date("2016-05-05 13:00:00");
    currTime = new Date();

  timeDiff = Math.floor((currTime - (orderTime - 3*60*60*1000))/1000/60); //comment out this line if you are in west coast line
//   timeDiff = Math.floor((currTime - orderTime)/1000/60);					//comment out this line if you are in east coast time
    updatePeriod = 10; //seconds
	deliveryStatus = document.getElementById('delivery-status'); 
    statusText="In Progress";
    var marker;
    timeRemaining = aryOfCoords.routes[0].legs[0].duration.text.split(' ')[0]*1;
    driveTime = timeRemaining;
    //only display tracking if item hasnt been delivered
    if (timeDiff >= driveTime){
        statusText = "Delivered";
        deliveryStatus.innerHTML = statusText;
        deliveryStatus.style.backgroundColor = "lightgreen";
    } else
        timeRemaining -= timeDiff;
        
    var totalPoints = aryOfCoords.routes[0].overview_path.length;
    console.log("simulateDriving timeRemaining", timeRemaining, "minutes");
    interval = Math.floor(totalPoints/driveTime);
    console.log("totalpoints", totalPoints, "timeRemaining", timeRemaining, "interval", interval);
    driverLocation = aryOfCoords.routes[0].overview_path;
    startingPos = (timeDiff*interval);
    i=startingPos;  //index for driver position
    x = setInterval(function(){
        if (statusText != "Delivered"){
            console.log("driverlocation", driverLocation[i].lat(), driverLocation[i].lng(), i, "timerem", timeRemaining, "minutes");
			
			//display only the latest marker position
			if (marker){
				marker.setMap(null);
			}
            marker = new google.maps.Marker({
              position: driverLocation[i],
              map: map,
              icon: 'http://maps.google.com/mapfiles/ms/micons/truck.png',
                });  
            if (i<driverLocation.length-interval){
                timeRemaining-- ;
                i+=interval;
				deliveryStatus.innerHTML = statusText;
				deliveryStatus.style.backgroundColor = "yellow";
            }
                
            else{
                i+=driverLocation.length-i;
                statusText="Delivered";
				deliveryStatus.innerHTML = statusText;
				deliveryStatus.style.backgroundColor = "lightgreen";
                console.log(deliveryStatus);
            }
        }
        else
            clearTimeout(x);
    }, updatePeriod*1000);
    
    
 //   aryOfCoords = aryOfCoords.routes[0].overview_path;
/*    for (var i = 0; i < aryOfCoords.routes[0].overview_path.length; i+=5){
        console.log("results", aryOfCoords.routes[0].overview_path[i].lat(), aryOfCoords.routes[0].overview_path[i].lng(), i);
        
            var marker = new google.maps.Marker({
          position: aryOfCoords.routes[0].overview_path[i],
          map: map,
          title:"You are here!",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5.5,
            fillColor: "#4286F5",
            fillOpacity: 0.7,
            strokeWeight: 1
            },
            });        
        
    }*/
    
}

/**gettimeRemaining
gets arryofcoords object and extract the 'duration' element from it. 
duration is represented as x mins. split x and mins using split, get the 
time (x) variable and multiply that by 60 to convert string to int and 
convert mins to seconds
*/

function gettimeRemaining(aryOfCoords){
    return aryOfCoords.routes[0].legs[0].duration.text.split(' ')[0]*1;
}


/**calcDistance - calculate the distance between two points 
p1, p1 are google.maps.LatLng coordinates */
function calcDistance(p1, p2){
    return (google.maps.geometry.spherical.computeDistanceBetween(p1,p2)/1000).toFixed(2);
}
