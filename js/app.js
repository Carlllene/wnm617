// Instantiate Variables
var db = [];

var styles =
[
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#faa31a"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]




// https://codepen.io/bronkula/pen/bvrgxQ
function readFiles(files,callback,index=0) {
  if (files && files[0]) {
    let file = files[index++],
        reader = new FileReader();
    reader.onload = function(e){
      callback(e);
      if(index<files.length) readFiles(files,callback,index);
    }
    reader.readAsDataURL(file);
  }
}





// Make Functions
function checkLoginForm(){

	var u = $("#login-username").val();
	var p = $("#login-password").val();

	var user = db.filter(function(o){
		if(o.username!=u) return false;
		if(o.password!=p) return false;
		return true;
	})

	if(user.length) {
		console.log("yay")
		sessionStorage.userId = user[0].id;
	} else {
		console.log("boo");
		$(".login-alert").html("Login Failed");
		setTimeout(function(){
			$(".login-alert").html("");
		},2000);
		sessionStorage.removeItem("userId");
	}

	checkStorage();
}

function checkStorage(){

	// is NOT logged in
	if(sessionStorage.userId === undefined) {
		if(
			location.hash != "#login-page" ||
			location.hash != "#signup-page" ||
			location.hash != ""
		){
			$.mobile.navigate("#login-page");
		}
	} else
	// is Logged in
	{
		if(
			location.hash == "#login-page" ||
			location.hash == "#signup-page" ||
			location.hash == ""
		){
			$.mobile.navigate("#map-page");
		}
	}
}







// Page Functions
function showMapPage(){
	if(!waitForDB(db.length,showMapPage,arguments)) return;

	var lastLocArr = [];

	currentUser().cats.forEach(o => {
		let lastloc = o.locations.slice(-1)[0];
		if(lastloc) {
			lastloc.icon = o.img;
			lastloc.catId = o.id;
			lastLocArr.push( lastloc );
		}
	});

	showMap(
		lastLocArr,
		"#map-page .map",
		function(targetMap){
			console.log(targetMap.data());

			targetMap.data("markers").forEach((o,i)=> {
				o.addListener("click",e => {
					console.log(o,i,e,lastLocArr[i].catId)

					targetMap.data("infoWindow")
						.setContent(
							showDataList(
								[catById(lastLocArr[i].catId)],
								$("#map-cat-template").html()
							)
						);

					targetMap.data("infoWindow")
						.open(targetMap,o);
				})
			})
		}
	);
}

function showListPage(arr){
	if(!waitForDB(db.length,showListPage,arguments)) return;

	if(arr===undefined) arr = currentUser().cats;

	showDataList(
		arr,
		$("#catlist-template").html(),
		"#list-page .catlist"
		)
}

function showcatProfilePage(){
	if(!waitForDB(db.length,showcatProfilePage,arguments)) return;

	if(!catById(sessionStorage.catId)) {
		$.mobile.navigate("#list-page");
		return;
	}

	showDataList(
		[currentcat()],
		$("#cat-profile-template").html(),
		"#cat-profile-page .cat-info"
		);
	showDataList(
		currentcat().locations,
		`<div><%= lat %> x <%= lng %></div>`,
		"#cat-profile-page .cat-locations"
		);

	// currentcat().locations.forEach(function(o){
	// 	return true;
	// })
	currentcat().locations.forEach(
		o => o.icon = currentcat().imgp );

	showMap(
		currentcat().locations,
		"#cat-profile-page .map",
		function(targetMap){

			if(!targetMap.data("hasClick")) {
				targetMap.data("hasClick",true);
				targetMap.data("map").addListener("click",e => {
					console.log(e.latLng.lat(),e.latLng.lng())
					console.log("center of map",targetMap.data("map").getCenter())

					$("#add-location-lat").val(e.latLng.lat())
					$("#add-location-lng").val(e.latLng.lng())

					$("#add-location-modal").addClass("active")
				})
			}

			targetMap.data("markers").forEach((o,i)=> {
				o.addListener("click",e => {
					console.log(o,i,e)
					targetMap.data("infoWindow")
						.setContent(`
                            <div>I'm here!</div>
							`);

					targetMap.data("infoWindow")
						.open(targetMap,o);
				})
			})
		}
	);
}

function showProfilePage(){
	if(!waitForDB(db.length,showProfilePage,arguments)) return;

	showDataList(
		[currentUser()],
		$("#profile-template").html(),
		"#profile-page [data-role=main]"
		);
}









// MAPS
function showMap(arr,target,fn){
	if(!waitForDB(window.google,showMap,arguments)) return;

	// maps api examples use a "map" variable
	// we use a $(target).data("map") variable
	if(!$(target).data("map")){
		$(target).data({
			"map": new google.maps.Map(
				$(target)[0],
				{
		          center: {
		          	lat: 37.749876,
		          	lng: -122.442401
		          },
		          zoom: 11,
		          disableDefaultUI:true,
		          styles:styles
		        }
		    ),
		    "infoWindow": new google.maps.InfoWindow({
		    	content:""
		    })
		});
	}

	removeMarkers(target);

	let bounds = new google.maps.LatLngBounds(null);
	for(let i in arr) {
		let marker = new google.maps.Marker({
			position: arr[i],
			map: $(target).data("map"),
			icon:{
				url:arr[i].icon,
				scaledSize: {
					width:40,
					height:40
				}
			}
		});
		$(target).data("markers").push(marker);
		bounds.extend(marker.getPosition())
	}

	setTimeout(()=>{
		if(arr.length>1) $(target).data("map").fitBounds(bounds);

		if(fn) fn($(target));
	},250)
}

function removeMarkers(target) {
	if($(target).data("markers")) {
		for(let i in $(target).data("markers")) {
			$(target).data("markers")[i].setMap(null);
		}
	}

	$(target).data("markers",[]);
}







// Helper Functions
function currentUser(){
	return db.find(function(o){
		return o.id == sessionStorage.userId;
	})
}
function currentcat(){
	return currentUser().cats.find(function(o){
		return o.id == sessionStorage.catId;
	})
}
function catById(id){
	return currentUser().cats.find(function(o){
		return o.id == id;
	})
}
function waitForDB(value,fn,args){
	if(!value) {
		setTimeout(function(){
			fn.apply(this, args);
		},50);
		return false;
	}
	return true;
}







// Run Code
$.ajax({
	url:"data/data.json",
	dataType:"json"
})
.done(function(d){
	console.log(d);
	db = d;
})
// Document Ready
$(function(){

	checkStorage();

	$(document)

	.on("pagecontainerbeforeshow",function(e,ui){
		console.log(ui,ui.toPage[0].id);

		if(ui.prevPage) {
			removeMarkers(ui.prevPage.find(".map"))
		}

		switch(ui.toPage[0].id) {
			case "map-page":
				showMapPage();
				break;
			case "list-page":
				showListPage();
				break;
			case "cat-profile-page":
				showcatProfilePage();
				break;
			case "profile-page":
				showProfilePage();
				break;
		}
	})

	// Event Delegation

	// FORMS
	.on("submit","#login-form",function(e){
		e.preventDefault();

		checkLoginForm();
	})
	.on("submit","#add-location-form",function(e){
		e.preventDefault();

		currentcat().locations.push({
            "id": currentcat().locations.length,
            "lat": +$("#add-location-lat").val(),
            "lng": +$("#add-location-lng").val(),
            "description": $("#add-location-description").val(),
            "date": new Date()
          })

		this.reset();

		$("#add-location-modal").removeClass("active");
		showcatProfilePage();
	})
	.on("submit","#add-cat-list-form",function(e){
		e.preventDefault();

		currentUser().cats.push({
            "id": currentUser().cats.length,
            "name": $("#add-cat-list-name").val(),
            "gender": $("#add-cat-list-gender").val(),
            "age": $("#add-cat-list-age").val(),
            "breed": $("#add-cat-list-breed").val(),
            "img": $("#add-cat-list-form .imagepicker").data("src"),
            "locations":[]
          })

		this.reset();

		$("#add-cat-list-form .imagepicker").css("background-image","none").removeClass("picked")

		$("#add-cat-list-modal").removeClass("active");
		showListPage();
	})
	.on("submit","#edit-cat-form",function(e){
		e.preventDefault();

		var c = currentcat();

		Object.assign(c,{
            "name": $("#edit-cat-name").val(),
            "age": $("#add-cat-list-age").val(),
            "gender": $("#add-cat-list-gender").val(),
            "breed": $("#edit-cat-breed").val(),
            "img": $("#edit-cat-form .imagepicker").data("src")
        })

		$("#edit-cat-modal").removeClass("active");
		showcatProfilePage();
	})




	// CHANGES
	.on("input","#list-search",function(e){
		if(this.value.length<3) {
			showListPage()
			return;
		}

		var arr = currentUser().cats.filter(o=>{
			if(RegExp(this.value,'i').test(o.name)) return true;
			if(RegExp(this.value,'i').test(o.type)) return true;
			if(RegExp(this.value,'i').test(o.breed)) return true;
			return false;
		})

		showListPage(arr);
	})




	// CLICKS
	.on("click",".js-logout",function(e){
		e.preventDefault();

		sessionStorage.removeItem("userId");
		checkStorage();
	})

	.on("click","[data-activate]",function(e){
		$($(this).data("activate")).addClass("active");
	})
	.on("click","[data-deactivate]",function(e){
		$($(this).data("deactivate")).removeClass("active");
	})


	.on("click",".cat-jump",function(e){
		sessionStorage.catId = $(this).data("id");
		$.mobile.navigate("#cat-profile-page")
	})
	.on("click",".cat-delete",function(e){
		currentUser().cats = currentUser().cats.filter(o=>
			o.id!=$(this).data("id")
		);
		$.mobile.navigate("#list-page");
	})

	.on("click",".js-edit-cat",function(e){

		let c = currentcat();

		$("#edit-cat-name").val(c.name);
		$("#edit-cat-age").val(c.age);
		$("#edit-cat-gender").val(c.gender);
		$("#edit-cat-breed").val(c.breed);
		$("#edit-cat-form .imagepicker")
			.css("background-image","url("+c.img+")")
			.addClass("picked")
			.data("src",c.img)
	})

	.on("click",".js-list-filter",function(e){

		var arr = currentUser().cats.filter(o=>{
			if(RegExp($(this).data("value"),'i').test(
				o[$(this).data("filter")])) return true;
			return false;
		})

		showListPage(arr);
	})




	.on("change",".imagepicker-replace input",function() {
	  // store the current "this" into a variable
	  var imagepicker = this;
	  readFiles(this.files,function(e) {
	    // "this" will be different in the callback function
	    $(imagepicker).parent()
	      .addClass("picked")
	      .data({src:e.target.result})
	      .css({"background-image":"url("+e.target.result+")"});
	  });
	})




	// Run On Each Template
	$("[data-template]").each(function(){
		$(this).html($($(this).data("template")).html())
	})



});



//reverse slide


function ChangePage(pageId,iPageIndex) {
    var forward = iCurrCardIndex < iPageIndex;
    iCurrCardIndex = iPageIndex;

    $.mobile.changePage("#list-page" + pageId, "slide", !forward, true);
}


