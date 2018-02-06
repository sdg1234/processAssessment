app.controller('worklistCtrl', function($scope, $state, $http, $timeout, $mdSidenav,dataFactory) {
	console.log("worklistCtrl loaded..");
    console.log(dataFactory.loginName);
	$scope.allScores=[];
	var roiYearArray=[];
	$scope.edit=function(form_id,score){
        var id=form_id;
        var score=score;
        console.log("am in edit"+id);
		$state.go("main.edit", {'value1':'false','form_id': id,'score':'false'});
	}
	$scope.view=function(form_id,score){
         var id=form_id;
        var score=score;
		$state.go("main.edit", {'value1':'true','form_id': id,'score':'fasle'});
	}
    
    
    
//	$scope.retrievingAllData = function(){
//        var formid="1001";
//         formid=parseInt(formid);
//         var data={ "form_id": formid};
//      var req = {
//          method: 'POST',
//          url: '/retrievingformdata',
//          data:data
//      }
//      var res = $http(req);
//      res.success(function(data, status, headers, config) {
//          console.log(data);
//        $scope.data=data;
//        console.log($scope.data);
//
//      });
//      res.error(function(data, status, headers, config) {
//          alert("failure message: " + JSON.stringify({
//              data: data
//          }));
//      });
//    }
//	$scope.retrievingAllData();
//	
     $scope.retrievingWorklist=function(){
         var data={ "name": dataFactory.loginName};
      var req = {
          method: 'POST',
          url: '/retrievingWorklist',
          data:data
      }
      var res = $http(req);
      res.success(function(data, status, headers, config) {
          console.log(data);
           $scope.data=data;
        console.log($scope.data);
      });
      res.error(function(data, status, headers, config) {
          alert("failure message: " + JSON.stringify({
              data: data
          }));
      });

    }
	// $scope.retrievingAllData();
    $scope.retrievingWorklist();
    
    
});