app.controller('scoreDialog', function($scope,$rootScope, $state, $http, $timeout,$mdDialog, $mdSidenav,dataFactory,score) {
 console.log(score);
    
   
    $scope.scoreDialog= function(){
         $mdDialog.hide();
        $rootScope.details=false;
        $state.go('main.worklist');
    }
    
 $scope.generateGuage = function(val) {
         console.log(val);
	 	var gauge1 = loadLiquidFillGauge("fillgauge2",val);
         console.log(gauge1);
     var config1 = liquidFillGaugeDefaultSettings();
     config1.circleColor = "#FF7777";
     config1.textColor = "#FF4444";
     config1.waveTextColor = "#FFAAAA";
     config1.waveColor = "#FFDDDD";
     config1.circleThickness = 0.2;
     config1.textVertPosition = 0.2;
     config1.waveAnimateTime = 1000;
	 }
     $timeout( function(){
           $scope.generateGuage(score[0].totalscore);
        }, 200 );
          $scope.inference1=score[0].inference1;
     $scope.inference2=score[0].inference2;
     $scope.inference3=score[0].inference3;
     $scope.inference4=score[0].inference4;
});