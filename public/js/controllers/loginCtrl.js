app.controller('loginCtrl', function($scope,$rootScope, $state, $http, $timeout,$mdDialog, $mdSidenav,$stateParams,dataFactory) {

console.log("LOGIN");

    $scope.authenticate = function(){
        console.log("entered the authenticate function");
         var userDetails={
			"name": $scope.userName,
			"password":$scope.password
		}
		console.log($scope.password);
		console.log($scope.userName);
		  var req = {
            method: 'POST',
            url: '/userValidation',
            data: {
               userDetails : userDetails
            }
        }
        var res = $http(req);
        res.success(function (data, status, headers, config) {
            console.log(data);
            if(data=="success"){
                dataFactory.loginName=$scope.userName;
                 $state.go('main.worklist');

            }
            else{
                 swal({
                            title: "Oops!",
                            text: "Invalid Credentials",
                            type: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#1e88e5",
                            confirmButtonText: "Okay!",
                            closeOnConfirm: true
                        },
                        function() {
                            console.log("swal function");
                            $state.go('login');
                            $rootScope.details=false;
                        });
            }
        
        
        });
        res.error(function (data, status, headers, config) {
            alert("failure message: " + JSON.stringify({
                data: data
            }));
        });
    }

});

		
        