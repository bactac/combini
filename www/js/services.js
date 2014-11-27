var app = angular.module("services", []);

// Servico para atribuir variaveis de sessao
app.factory("StorageService", function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        unset: function(key) {
            $window.localStorage[key] = null;
        }
    }
});


app.factory('CombiniService', function($http, StorageService){
    return {
        index: function(latitude, longitude, limit) {
            
            var input = { limit:limit};
            if (latitude) {
                input.lat = latitude;
            }
            if (longitude) {
                input.long = longitude;
            }

            return $http({
                    url: 'http://wickedvikings.herokuapp.com/combinis.json',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    params: input
                });    
        },

        show: function(id) {

            return $http({
                url: 'http://wickedvikings.herokuapp.com/combinis/' + id + '.json',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
                // params: input
            });
        },

        like: function(id, user_id, like) {
            var input = { user_id : user_id, like : like};
            return $http({
                url: 'http://wickedvikings.herokuapp.com/combinis/' + id + '/like.json',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: input
            });
        },


        liked: function(id, user_id) {
            var input = { user_id : user_id};
            return $http({
                url: 'http://wickedvikings.herokuapp.com/combinis/' + id + '/liked.json',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                params: input
            });
        },

        sendComment: function(id, user_id, comment) {
            var input = { user_id : user_id, comment : comment};
            return $http({
                url: 'http://wickedvikings.herokuapp.com/combinis/' + id + '/comment.json',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: input
            });
        },

        showComments: function(id) {
            return $http({
                url: 'http://wickedvikings.herokuapp.com/combinis/' + id + '/comments.json',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
                // params: input
            });
        },

        countLikes: function(id) {

            return $http({
                url: 'http://wickedvikings.herokuapp.com/combinis/' + id + '/likes_count.json',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
                // params: input
            });
        },

        create: function(combini) {
            return $http({
                url: 'http://wickedvikings.herokuapp.com/combinis.json',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: combini
            });
        }
        
    };

});

// Servico para conectar com o banco de Usuarios
app.factory('UserService', function($http, StorageService){
    var setUser   = function(data) {
        StorageService.set('authenticated', true);
        StorageService.setObject('user', data);
    };

    var unsetUser = function() {
        StorageService.set('authenticated',false);
        StorageService.unset('user');
    };

    return {

        login: function(credentials) {

            var login = $http({
                url: "http://wickedvikings.herokuapp.com/login.json",
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: credentials
            });
            login.success(function(data){
                setUser(data);
            });
            // login.success(FlashService.clear);
            // login.error(loginError);
            return login;
        },

        withoutLogin: function() {

            var login = $http({
                url: "http://wickedvikings.herokuapp.com/withoutLogin.json",
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: credentials
            });
            login.success(function(data){
                setUser(data);
            });
            // login.success(FlashService.clear);
            // login.error(loginError);
            return login;
        },

        logout: function() {
            // var input = { };


            // var logout = $http({
            //     url: "system/auth/logout.php",
            //     method: 'GET',
            //     headers: { 'Content-Type': 'application/json' },
            //     params: input
            // });
            // logout.success(uncacheStorage);
            // return logout;
            unsetUser();
        },

        isLoggedIn: function() {
            return StorageService.get('authenticated') == "true";
        },

        // index: function(value, search, status, limit, pag) {
        //     var input = { value : value, search : search, status : status, limit : limit, pag : pag };

        //     input.value = SanitizeService.sanitizeInput(input.value);

        //     input.csrf_token = CSRF_TOKEN;

        //     return $http({
        //             url: 'system/usuarios/index.php',
        //             method: 'GET',
        //             headers: { 'Content-Type': 'application/json' },
        //             params: input
        //         });    
        // },

        show: function(id) {
            return $http({
                    url: 'http://wickedvikings.herokuapp.com/users/' + id +'.json',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                    // params: input
                });    
        },


        search: function(name) {
            return $http({
                    url: 'http://wickedvikings.herokuapp.com/users/search.json',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    params: name
                });    
        },

        create: function(user) {

            return $http({
                url: 'http://wickedvikings.herokuapp.com/users.json',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: user
            }).success(function(data){
                setUser(data);
            });
        },

        update: function(user) {

            return $http({
                url: 'http://wickedvikings.herokuapp.com/users/' + user.user.id + '.json',
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                data: user
            });
        },

        getUser: function() {
            return StorageService.getObject('user');
        },

        updateMyUser: function(user) {
            return StorageService.setObject('user',user);
        },
        
    };
});

app.factory('TypegroupService', function($http){
    return {
        index: function() {

            return $http({
                    url: 'http://wickedvikings.herokuapp.com/typegroups.json',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                    // params: input
                });    
        },

        showTypes: function(id) {

            return $http({
                url: 'http://wickedvikings.herokuapp.com/typegroups/' + id + '/types.json',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
                // params: input
            });
        }
        
    };

});


app.factory('NeighborhoodService', function($http){
    return {
        index: function(lat,long) {

            var input = null;
            if (lat) {
                input = {lat : lat, long : long};
            }

            return $http({
                    url: 'http://wickedvikings.herokuapp.com/neighborhoods.json',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    params: input
                });    
        },

        show: function(id) {
            return $http({
                    url: 'http://wickedvikings.herokuapp.com/neighborhoods/' + id +'.json',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                    // params: input
                });    
        },

        showCombinis: function(id) {
            return $http({
                    url: 'http://wickedvikings.herokuapp.com/neighborhoods/' + id +'/combinis.json',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                    // params: input
                });    
        },

        countCombinis: function(id) {
            return $http({
                    url: 'http://wickedvikings.herokuapp.com/neighborhoods/' + id + '/combinis_count.json',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                    // params: input
                });    
        }
        
    };

});

app.factory('TitleService', function($http){
    return {
        index: function() {

            return $http({
                    url: 'http://wickedvikings.herokuapp.com/titles.json',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                    // params: input
                });    
        },

        show: function(id) {
            return $http({
                url: 'http://wickedvikings.herokuapp.com/titles/' + id + '.json',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                    // params: input
                });
        }
        
    };

});



app.factory('StoreService', function($http){
    return {
        index: function(product_category_id) {
            if (product_category_id) {
                return $http({
                    url: 'http://wickedvikings.herokuapp.com/product_categories/' + product_category_id + '/products.json',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                    // params: input
                });        
            }

            else {
                return $http({
                    url: 'http://wickedvikings.herokuapp.com/products.json',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                    // params: input
                });    
            }
            
        },

        buy: function(product_id, user_id) {
            var purchase = { purchase: {} };
            purchase.purchase.product_id = product_id;
            purchase.purchase.user_id = user_id;


            return $http({
                url: 'http://wickedvikings.herokuapp.com/buy.json',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: purchase
            });
        }
        
    };

});


app.factory('InventoryService', function($http){
    return {
        index: function(user_id) {
            return $http({
                url: 'http://wickedvikings.herokuapp.com/users/'+user_id+'/inventory_items.json',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
                // params: input
            });     

            
        }
        
    };

});

