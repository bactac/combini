var app = angular.module("services", []);

// Servico para atribuir variaveis de sessao
app.factory("SessionService", function() {
    return {
        get: function(key) {
            return sessionStorage.getItem(key);
        },
        set: function(key, val) {
            return sessionStorage.setItem(key, val);
        },
        unset: function(key) {
            return sessionStorage.removeItem(key);
        }
    }
});


app.factory('CombiniService', function($http, SessionService){
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
            combini.combini.user_id = SessionService.get('id');
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
app.factory('UserService', function($http, SessionService){
    var cacheSession   = function(data) {
        SessionService.set('authenticated', true);
        SessionService.set('name', data.name);
        SessionService.set('title', data.title);
        SessionService.set('id', data.id);
    };

    var uncacheSession = function() {
        SessionService.unset('authenticated');
        SessionService.unset('name');
        SessionService.unset('title');
        SessionService.unset('id');
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
                cacheSession(data);
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
                cacheSession(data);
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
            // logout.success(uncacheSession);
            // return logout;
            uncacheSession();
        },

        isLoggedIn: function() {
            return SessionService.get('authenticated');
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
                cacheSession(data);
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
            return {
                id: SessionService.get('id'),
                name: SessionService.get('name'),
                title: SessionService.get('title')
            };
        }
        
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