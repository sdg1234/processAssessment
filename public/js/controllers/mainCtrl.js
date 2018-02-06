app.controller('mainCtrl', function($scope,$rootScope, $state, $http, $mdDialog,$timeout, $mdSidenav,dataFactory) {
	console.log("mainCtrl loaded..");
	$rootScope.accountNames="";
	$rootScope.LOBs="";
	$scope.navigateTo = function(state,ev) {
		if(state=='main.form'){
			console.log("am in form dialog");
			$rootScope.details=true;
			$scope.dialog(ev);
		}
		else{
			$state.go(state);
			$rootScope.details=false;
			$rootScope.accountNames="";
			$rootScope.LOBs="";
		}
		$mdSidenav('left').close()
	}
	// $scope.navigateTo("main.worklist");
	$scope.sideNavData = [{
		"state":"main.worklist",
		"name":"Worklist"
	},{
		"state":"main.form",
		"name":"New Assessment"
	},{
		"state":"login",
		"name":"Log Out"
	}]
	$scope.toggleLeft = buildToggler('left');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      }
    }	
		 $scope.dialog=function(ev) {
            $mdDialog.show({
                controller: "detailCtrl",
                templateUrl: 'pages/detailDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
                
            }).then(function(answer) {
                console.log(answer);
            }, function() {
                console.log("dialog cancelled");
            });
        }
});