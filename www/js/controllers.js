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
        console.log(!$rootScope.isLoggedIn());
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

	$rootScope.gotoStore = function() {
		$rootScope.toggleRight();
		$location.path('/store');
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



app.controller("LoginController", function($scope, $location, UserService) {
    $scope.credentials = { user : "" };
    $scope.credentials.user = { email:"asdf@asdf.com", password : "asdf" };

    $scope.login = function() {
		
		UserService.login($scope.credentials).success(function() {
            //alert("Login Win!");
			$location.path('/combinis');
        }).error(function() {
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
            alert("Porra enviada!");
            $location.path('/combinis.html');
        }).error(function() {
            alert("Porra, falhou!");
        });
    };

    $scope.setQuality = function(value) {
        $scope.form.combini.quality_rank = value;
    }


});

/**
		COMBINIS CONTROLLER
**/
app.controller('CombinisController', function($scope, CombiniService, $ionicLoading, $compile, $cordovaGeolocation, $location, UserService, $rootScope, $timeout) {

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
            var count = 3;
            var counter;

            $scope.alert = "Ganhou " + (diffXp) + " Xp!";

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
            var count = 3;
            var counter;

            $scope.alert = "Ganhou " + (diffLvl) + " Lvl!";

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
            var count = 3;
            var counter;

            $scope.alert = "Ganhou " + (diffGold) + " gold!";

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
	
	function initialize() {
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
			mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        		
        $scope.map = map;
		
		$scope.loading = $ionicLoading;
		$scope.loading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });
		
		$cordovaGeolocation.getCurrentPosition().then(function(pos) {
			//adicionei
			$scope.position = pos.coords;
			myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
			$scope.map.setCenter(myLatlng);
			
			
			//Marker + infowindow + angularjs compiled ng-click
			var marker = new google.maps.Marker({
				position: myLatlng,
				map: map,
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
        });
		$scope.loading.hide();

		
	}
	ionic.Platform.ready(initialize);
	  
	
	$rootScope.showMarkers = function() {
		for(i = 0; i < 10; i++){
			var marker = new google.maps.Marker({
					position: new google.maps.LatLng($scope.position.latitude + Math.random()/50-Math.random()/50,$scope.position.longitude + Math.random()/50-Math.random()/50),
					map: $scope.map,
					title: 'AAAAH!',
					icon: "./assets/48/" + Math.floor(Math.random()*23 + 1) + ".png"
					});
					
			google.maps.event.addListener(marker, 'click', function() {
				$location.path('/showCombini');
			});		
		}
	}
	  /*
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


app.controller("showCombiniController", function($scope) {

});
