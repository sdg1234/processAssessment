app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: 'pages/login.html',
      controller: 'loginCtrl'
    })
	.state('main', {
      url: "/main",
	  abstract:true,
      templateUrl: 'pages/main.html',
      controller: 'mainCtrl'
    })
	.state('main.form', {
        url: "/form",
      params: {'accountName': null,'processName': null,'LOB': null,'businessArea': null,'processArea':null,'processDesc': null,'value1': null,'form_id': null,'score':null},
      templateUrl: 'pages/form.html',
      controller: 'formCtrl'
    })
    .state('main.edit', {
         url: "/edit",
     params: {'value1': null,'form_id': null,'score':null},
      templateUrl: 'pages/form.html',
    controller: 'formCtrl'
    })
	.state('main.worklist', {
      url: "/worklist",
      templateUrl: 'pages/worklist.html',
      controller: 'worklistCtrl'
    });
    $urlRouterProvider.otherwise("/login");
});