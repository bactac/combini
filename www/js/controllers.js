var app = angular.module("controllers", ['services']);



/*******************************************************************************
*
*
*
*   Controllers para index
*
*
*
********************************************************************************/

app.controller("MainController", function($rootScope, $location, UserService, $ionicSideMenuDelegate) {
    $rootScope.isLoggedIn = function() {
        return UserService.isLoggedIn();
    };

    $rootScope.logout = function() {      
        UserService.logout();  
		$rootScope.toggleRight();
        $location.path('/login');
    };
	
	
	$rootScope.showUser = function() {
	
		$rootScope.toggleRight();
		$location.path('/showUser');
    };
		
	$rootScope.toggleRight = function() {
		$ionicSideMenuDelegate.toggleRight();
    };
	
	$rootScope.editProfile = function() {		
		$rootScope.toggleRight();
		$location.path('/editProfile');
	};

	$rootScope.goStore = function() {
        $rootScope.toggleRight();
        $location.path('/store');
    };

    $rootScope.goInventory = function() {
        $rootScope.toggleRight();
        $location.path('/inventory');
    };


    if (!$rootScope.isLoggedIn()) {
        $location.path('/login');
    }
    
});



/*******************************************************************************
*
*
*
*   Controllers para paginas
*
*
*
********************************************************************************/



app.controller("LoginController", function($scope, $location, UserService, $ionicLoading) {
    $scope.credentials = { user : "" };
    $scope.credentials.user = { email:"asdf@asdf.com", password : "asdf" };

    $scope.login = function() {
	
		$ionicLoading.show({
			template: "<i class='icon ion-loading-c'></i>",
			content: 'Getting current location...',
			showBackdrop: false
        });
		
		UserService.login($scope.credentials).success(function() {
            //alert("Login Win!");
			$ionicLoading.hide();
			$location.path('/combinis');
        }).error(function() {
			$ionicLoading.hide();
            alert("Login Fail");
        });
    };

    $scope.withoutLogin= function() {
        UserService.withoutLogin().success(function() {
            //alert("AAAAAAAAAAAAH!");
			$location.path('/combinis');
        }).error(function() {
            //alert("Entrada Fail");
        });
    };

    $scope.signup = function() {
        $location.path('/signup');
    }
});





app.controller("SignupController", function($scope, $location, UserService, TitleService) {
    $scope.form = { user: "" };
    $scope.form.user = { title_id : "",name : "",email : "",motto : "",avatar : "",password : "",password2 : "" };

    TitleService.index().success(function(data) {
        $scope.titles = data;
        $scope.form.user.title_id = data[0].id;
    }).error(function(data) {
        alert("Nao consegui puxar os titulos T_T");
    });

    $scope.sendForm = function() {
        if ($scope.form.user.password == $scope.form.user.password2) {
            UserService.create($scope.form).success(function() {
                alert("Conta criada!");
                $location.path('/combini');
            }).error(function() {
                alert("Criacao da conta falhou");
            });    
        }
        else {
            alert("Passwords nao batem!");
        }
        
    };
});


app.controller("CombiniFormSelectController", function($scope, $stateParams, TypegroupService) {
    var request = TypegroupService.index();

    $scope.latitude = $stateParams.latitude;
    $scope.longitude = $stateParams.longitude;

    request.success(function(data){
        $scope.typegroups = data;
        $scope.types = []
        for (var i = 0; i < $scope.typegroups.length; i++) {
            request = TypegroupService.showTypes($scope.typegroups[i].id);
            request.success(function(data) {
                $scope.types[data[0].typegroup_id] = data
            });
            request.error(function(data) {
                alert("ERRO!");
            });
        }
    });
    request.error(function(data){
        alert("ERRO!");
    });



});




app.controller("CombiniFormSendController", function($scope, $location, $stateParams, UserService, NeighborhoodService, CombiniService) {

    $scope.form = { combini : "" };
    $scope.form.combini = { typegroup_id : $stateParams.typegroup_id,
                            type_id : $stateParams.type_id,
                            comment : "",
                            latitude : $stateParams.latitude,
                            longitude : $stateParams.longitude,
                            name : "",
                            quality_rank : 3,
                            neighborhood_id : "" };

    $scope.type_name = $stateParams.type_name;
    $scope.type_id = $stateParams.type_id;

    $scope.form.combini.user_id = UserService.getUser().id

    NeighborhoodService.index($scope.form.combini.latitude, $scope.form.combini.longitude).success(function(data) {
        $scope.neighborhoods = data;
        $scope.form.combini.neighborhood_id = data[0].id;
    });

    $scope.sendForm = function() {
        CombiniService.create($scope.form).success(function() {
            //alert("Combini enviado!");
            $location.path('/combinis');
        }).error(function() {
            alert("Falha ao criar novo Combini...");
        });
    };

    $scope.setQuality = function(value) {
        $scope.form.combini.quality_rank = value;
    }


});

/**
		COMBINIS CONTROLLER
**/
app.controller('CombinisController', function($scope, CombiniService, $ionicLoading, $compile, $cordovaGeolocation, $location, UserService, $timeout) {

	$scope.form = { latitude : "", longitude : "", limit : ""};
    $scope.combinis = [];
    $scope.getCombinis = function() {

    CombiniService.index($scope.form.latitude, $scope.form.longitude, $scope.form.limit).success(function(data){
            $scope.combinis = data;
        });
    };

    var user = UserService.getUser();

    UserService.show(user.id).success(function(data) {

        var diffXp = data.xp - user.xp;
        var diffLvl = data.lvl - user.lvl;
        var diffGold = data.gold - user.gold;

        var alertXp = function() {
            var count = 1;
            var counter;

            $scope.alert = "+" + (diffXp) + " XP!";

            var countdown = function() {
                if (count == 0) {
                    $timeout.cancel(counter);
                    $scope.alert = "";
                    if (diffLvl)
                        alertLvl();
                    else if (diffGold)
                        alertGold();
                }
                else {
                    counter = $timeout(function() {
                        count--;   
                        countdown();   
                    }, 1000);    
                }
            };
            countdown();
        }
        var alertLvl = function() {
            var count = 1;
            var counter;

            $scope.alert = "+" + (diffLvl) + "Lvl!";

            var countdown = function() {
                if (count == 0) {
                    $timeout.cancel(counter);
                    $scope.alert = "";
                    if (diffGold)
                        alertGold();
                }
                else {
                    counter = $timeout(function() {
                        count--;   
                        countdown();   
                    }, 1000);    
                }
            };
            countdown();
        }
        var alertGold = function() {
            var count = 1;
            var counter;

            $scope.alert = "+" + (diffGold) + " gold!";

            var countdown = function() {
                if (count == 0) {
                    $timeout.cancel(counter);
                    $scope.alert = "";
                }
                else {
                    counter = $timeout(function() {
                        count--;   
                        countdown();   
                    }, 1000);    
                }
            };
            countdown();
        }

        if (diffXp) 
            alertXp();

    });

    var createMarker = function(data) {
        var marker = new google.maps.Marker({
                position: new google.maps.LatLng(data.latitude,data.longitude),
                map: $scope.map,
                title: data.name,
                icon: "./assets/48/" + data.type_id + ".png",
                id: data.id
                });
                
        google.maps.event.addListener(marker, 'click', function() {
            location.href = '/#/showCombini/' + marker.id;
        }); 

        $scope.markers.push(marker);
    }
	
	var initialize = function() {
	
		$ionicLoading.show({
			template: "<i class='icon ion-loading-c'></i>",
			content: 'Getting current location...',
			showBackdrop: false
        });
		
		var myLatlng = new google.maps.LatLng(-23.5577678,-46.7299445);
        
        var mapOptions = {
			center: myLatlng,
			zoom: 16,
			panControl: false,
			zoomControl: false,
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			navigationControl: false,
			disableDefaultUI: false,
			overviewMapControl: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: [{"stylers":[{"saturation":-100},{"gamma":1}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":50},{"gamma":0},{"hue":"#50a5d1"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"gamma":1},{"saturation":50}]}, {"featureType": "transit.station.bus","stylers": [{ "visibility": "off" }]}]
        };
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        		
		$cordovaGeolocation.getCurrentPosition().then(function(pos) {
		
			$ionicLoading.hide();
			
			//adicionei
			$scope.position = pos.coords;
			myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
			$scope.map.setCenter(myLatlng);

            CombiniService.index(pos.coords.latitude, pos.coords.longitude, 20).success(function(data){
                $scope.markers = [];
                for (var i = 0; i < data.length; i++) {
                    createMarker(data[i]);

                }
            });
			
			//Marker + infowindow + angularjs compiled ng-click
			var marker = new google.maps.Marker({
				position: myLatlng,
				map: $scope.map,
				icon: "./assets/location_marker.png"
				});			
			/*var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
			var compiled = $compile(contentString)($scope);
			var infowindow = new google.maps.InfoWindow({
			  content: compiled[0]
			});
			//APARECER INFORMACOES DA PORRA
			google.maps.event.addListener(marker, 'click', function() {
			  //infowindow.open(map,marker);
			});		
			*/
        }, function(error) {
			alert('Unable to get location: ' + error.message);
			$ionicLoading.hide();
        });
		
	}
	
	ionic.Platform.ready(initialize);
	  
	
/*	$rootScope.showMarkers = function() {
		for(i = 0; i < 10; i++){
			var marker = new google.maps.Marker({
					position: new google.maps.LatLng($scope.position.latitude + Math.random()/50-Math.random()/50,$scope.position.longitude + Math.random()/50-Math.random()/50),
					map: $scope.map,
					title: 'AAAAH!',
					icon: "./assets/48/" + Math.floor(Math.random()*23 + 1) + ".png"
					});
					
			google.maps.event.addListener(marker, 'click', function() {
				$location.path('/showCombini');
                $scope.asdf= '1234';
			});		
		}
	}*/

	  /*
    }
    $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading;
		$scope.loading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      */
    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };
	
	$scope.gotoForm = function() {
        if ($scope.position) {
            $location.path('/combiniFormSelect/' + $scope.position.latitude + '/' + $scope.position.longitude);    
        }
        else {
            alert("Nao temos sua posicao ainda!");
        }
		
	};
	
});



app.controller("showUserController", function($scope, UserService) {
    $scope.user = UserService.getUser();
});



app.controller("editProfileController", function($scope, $location, UserService) {
    $scope.form = { user : "" };
    $scope.form.user = UserService.getUser();

    $scope.sendForm = function() {
        if ($scope.form.user.password == $scope.form.user.password2) {
            UserService.update($scope.form).success(function() {
                alert("Updato!");
                $location.path('/combinis');
            }).error(function() {
                alert("Update falhou");
            });    
        }
        else {
            alert("Passwords nao batem!");
        }
        
    };
});



app.controller("storeController", function($scope) {

});

app.controller("inventoryController", function($scope, UserService) {
    $scope.user = UserService.getUser();
});


app.controller("showCombiniController", function($scope, $stateParams, CombiniService, UserService, NeighborhoodService) {

    $scope.user = UserService.getUser();

    $scope.form = {comment:""};


    CombiniService.show($stateParams.id).success(function(data){
	
        $scope.combini = data;

        CombiniService.countLikes($stateParams.id).success(function(data) {
            $scope.combini.likesCount = data;
        });

        CombiniService.liked($stateParams.id, $scope.user.id).success(function(data){
            $scope.combini.liked = data;
        });

        CombiniService.showComments($stateParams.id).success(function(data) {
            $scope.combini.comments = data;
        });

        NeighborhoodService.show($scope.combini.neighborhood_id).success(function(data) {
            $scope.combini.neighborhood = data;
        });

        UserService.show($scope.combini.user_id).success(function(data) {
            $scope.combini.user = data;
        });
		
    });

    $scope.like = function(like) {
        if (!Array.isArray($scope.combini.liked)) {
            alert("vc jah deu like porra!");
        } else {
            CombiniService.like($stateParams.id, $scope.user.id, like).success(function(data){
                $scope.combini.liked = like;
                alert("Like Funcionado!");
                CombiniService.countLikes($stateParams.id).success(function(data) {
                    $scope.combini.likesCount = data;
                });
            }).error(function(data){
                alert("Like ferrou");
            });    
        }
        
    };

    $scope.sendComment = function() {
        CombiniService.sendComment($stateParams.id, $scope.user.id, $scope.form.comment).success(function(data) {
            alert("Comentado!");
            CombiniService.showComments($stateParams.id).success(function(data) {
                $scope.combini.comments = data;
            });
        }).error(function(data){
            alert("Comment ferrou!");
        });
    };

    $scope.randomAvatar = function() {
        return Math.floor(Math.random()*8 + 1);
    }
});
