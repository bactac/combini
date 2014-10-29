// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('combini', ['ionic', 'controllers', 'services', 'ngCordova']);

app.config(function($stateProvider, $urlRouterProvider) {


  $stateProvider.state('login', {
    templateUrl: 'templates/login.html',
    url: '/login',
	controller: 'LoginController'});
  
  $stateProvider.state('combinis', {
    templateUrl: 'templates/combinis.html',
    url: '/combinis',
	controller: 'CombinisController'});
	
   $stateProvider.state('combiniFormSelect', {
    templateUrl: 'templates/combiniFormSelect.html',
    url: '/combiniFormSelect/:latitude/:longitude',
	controller: 'CombiniFormSelectController'});
	
   $stateProvider.state('combiniFormSend', {
    templateUrl: 'templates/combiniFormSend.html',
    url: '/:typegroup_id/:type_id/:type_name/combiniFormSend/:latitude/:longitude',
	controller: 'CombiniFormSendController'});
	
	$stateProvider.state('showUser', {
    templateUrl: 'templates/showUser.html',
    url: '/showUser',
	controller: 'showUserController'});
	
    $stateProvider.state('signup', {
    templateUrl: 'templates/signup.html',
    url: '/signup',
	controller: 'SignupController'});
  
    $stateProvider.state('editProfile', {
    templateUrl: 'templates/editProfile.html',
    url: '/editProfile',
	controller: 'editProfileController'});
	
	$stateProvider.state('store', {
    templateUrl: 'templates/store.html',
    url: '/store',
	controller: 'storeController'});
	
	$stateProvider.state('showCombini', {
    templateUrl: 'templates/showCombini.html',
    url: '/showCombini',
	controller: 'showCombiniController'});
	
	
	
    $urlRouterProvider.otherwise('combinis');
});

app.config(function( $compileProvider ){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});














