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
        
        $location.path('/login');
        return UserService.logout();
    };
	
	$rootScope.signup = function() {
		$location.path('/signup');
	}
	
	$rootScope.showUser = function() {
		$location.path('/showUser');
    };
		
	$rootScope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
    };
	
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

    if (UserService.isLoggedIn()) {
		//alert("logado!!!");
		$location.path('/combinis');
	}
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

app.controller("UpdateController", function($scope, $routeParams, $location, UserService, TitleService) {
    $scope.form = { user: "" };
    $scope.form.user = { title_id : "",name : "",email : "",motto : "",avatar : "",password : "",password2 : "" };

    

    TitleService.index().success(function(data) {
        $scope.titles = data;

        UserService.show($routeParams.id).success(function(data) {
            $scope.form.user = data;
        });
    }).error(function(data) {
        alert("Nao consegui puxar os titulos T_T");
    });

    $scope.sendForm = function() {
        if ($scope.form.user.password == $scope.form.user.password2) {
            UserService.update($scope.form).success(function() {
                alert("Updato!");
                $location.path('/combini');
            }).error(function() {
                alert("Update falhou");
            });    
        }
        else {
            alert("Passwords nao batem!");
        }
        
    };
});

app.controller("CombiniController", function($scope, $location, SessionService, CombiniService, TypegroupService, NeighborhoodService, TitleService, UserService) {
    $scope.form = { combini : "" };
    $scope.form.combini = { typegroup_id : "",type_id : "",comment : "",latitude : "",longitude : "",name : "",quality_rank : "", neighborhood_id : "" };


    // Trocar isso aqui, tah mto porco
    $scope.name = SessionService.get('name');

    // Trocar isso aqui, tah mto porco
    TitleService.show(SessionService.get('title_id')).success(function(data) {
        $scope.title = data.name;
    });

    $scope.onTypegroupChange = function() {
        TypegroupService.showTypes($scope.form.combini.typegroup_id).success(function(data) {
            $scope.types = data;
            $scope.form.combini.type_id = data[0].id;
        }).error(function() {
            alert("Nao recebi os tipos!");
        })
    };

    $scope.sendForm = function() {
        CombiniService.create($scope.form).success(function() {
            alert("Porra enviada!");
        }).error(function() {
            alert("Porra, falhou!");
        });
    };

    $scope.findNeighborhood = function() {
        NeighborhoodService.index($scope.form.combini.latitude, $scope.form.combini.longitude).success(function(data) {
            $scope.neighborhoods = data;
            $scope.form.combini.neighborhood_id = data[0].id;
        });
    };

    TypegroupService.index().success(function(data) {
        $scope.typegroups = data;
        $scope.form.combini.typegroup_id = data[0].id;
        $scope.onTypegroupChange();
    }).error(function() {
        alert("Nao recebi os grupos!");
    });

	$scope.logout = function() {
		$location.path('/login');
        return UserService.logout();
	}
	
    $scope.findNeighborhood();


});

app.controller("NeighborhoodController", function($scope, $routeParams, NeighborhoodService) {

    $scope.id;

    NeighborhoodService.index(null, null).success(function(data) {
        $scope.neighborhoods = data;
        $scope.id = data[0].id;
        $scope.query();
    });

    $scope.query = function() {
        NeighborhoodService.show($scope.id).success(function(data){
            $scope.neighborhood = data;
        });
        NeighborhoodService.showCombinis($scope.id).success(function(data){
            $scope.combinis = data;
        });
        NeighborhoodService.countCombinis($scope.id).success(function(data){
            $scope.count = data.combinis_count;
        });
    };
});





















app.controller("CombiniFormSendController", function($scope) {

    $scope.send = function() {
		alert("colocar codigo de criar novo combini aqui");
	}
});

app.controller("CombiniFormSelectController", function($scope, $location) {

    $scope.selectType = function() {
		$location.path('/combiniFormSend');
	}
});


/**
		COMBINIS CONTROLLER
**/
app.controller('CombinisController', function($scope, CombiniService, $ionicLoading, $compile, $cordovaGeolocation, $location, UserService, $rootScope) {
	
	$scope.form = { latitude : "", longitude : "", limit : ""};
    $scope.combinis = [];
    $scope.getCombinis = function() {

    CombiniService.index($scope.form.latitude, $scope.form.longitude, $scope.form.limit).success(function(data){
            $scope.combinis = data;
        });
    };
	
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
				icon: "./img/location_marker.png"
				});			
			var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
			var compiled = $compile(contentString)($scope);
			var infowindow = new google.maps.InfoWindow({
			  content: compiled[0]
			});
			//APARECER INFORMACOES DA PORRA
			google.maps.event.addListener(marker, 'click', function() {
			  infowindow.open(map,marker);
			});		
		
			
        }, function(error) {
			alert('Unable to get location: ' + error.message);
        });
		
		$scope.loading.hide();

		
	}
			
	ionic.Platform.ready(initialize);
	  
	
	$rootScope.showMarkers = function() {
	
		//dummy
		var tipos = new Array(
			"./img/balao/balao_banca.png",
			"./img/balao/balao_banco.png",
			"./img/balao/balao_bicicleta.png",
			"./img/balao/balao_bilheteunico.png",
			"./img/balao/balao_booze.png",
			"./img/balao/balao_cambio.png",
			"./img/balao/balao_chaveiro.png",
			"./img/balao/balao_coffee.png",
			"./img/balao/balao_comida.png",
			"./img/balao/balao_comida24h.png",
			"./img/balao/balao_farmacia.png",
			"./img/balao/balao_hospital.png",
			"./img/balao/balao_impressora.png",
			"./img/balao/balao_lan.png",
			"./img/balao/balao_lavanderia.png",
			"./img/balao/balao_lugarparadormir.png",
			"./img/balao/balao_mecanico.png",
			"./img/balao/balao_mercado.png",
			"./img/balao/balao_policia.png",
			"./img/balao/balao_posto.png",
			"./img/balao/balao_tomada.png",
			"./img/balao/balao_wc.png",
			"./img/balao/balao_wifi.png");
	
		for(i = 0; i < 10; i++){
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng($scope.position.latitude + Math.random()/50-Math.random()/50,$scope.position.longitude + Math.random()/50-Math.random()/50),
				map: $scope.map,
				title: 'AAAAH!',
				icon: tipos[Math.floor(Math.random()*tipos.length)]
				});
			google.maps.event.addListener(marker, 'click', function() {
				marker.setMap(null);
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
		$location.path('/combiniFormSelect');
	}
	
	$scope.logout = function() {
		$location.path('/login');
        return UserService.logout();
	}
	
});



app.controller("showUserController", function($scope) {

});





