app.controller('detailCtrl', function($scope,$rootScope, $state, $http, $timeout,$mdDialog, $mdSidenav,dataFactory) {
    console.log("detailCtrl loaded..");
   
    $scope.gettingLOBData=function(){
        var req = {
            method: 'POST',
            url: '/gettingLOBData'
        }
        var res = $http(req);
        res.success(function(data, status, headers, config) {
            console.log("am in lobdata");
            console.log(data);
            $scope.lobData=data;
        });
    }
    $scope.gettingLOBData();
    $scope.filterBusiness=function(){
        $scope.businessData=[];
        for(var i=0;i<$scope.lobData.length;i++){

            if($scope.selectedItem==$scope.lobData[i].lob){
                $scope.businessData.push($scope.lobData[i].values);
            }
           
        }
       
    }
    $scope.filterProcess=function(){
        console.log("am in process filter");
        console.log($scope.businessArea);
        $scope.processData=[];
        for(var j=0;j<$scope.lobData.length;j++){
            if($scope.selectedItem==$scope.lobData[j].lob){
                for(var i=0;i<$scope.lobData[j].values.length;i++){

                     if($scope.businessArea==$scope.lobData[j].values[i].businessArea){
                         console.log($scope.lobData[j].values[i]);
                         console.log($scope.businessArea);
                         console.log("hi");
                        $scope.processData.push($scope.lobData[j].values[i].values);
                     }
                }
            }
        }
        console.log($scope.processData);
    }
	$scope.ok= function(){
        console.log($scope.processName);
        var formDetails={
            'processName' :$scope.processName,
            'accountName':$scope.accountName,
            'LOB': $scope.selectedItem,
            'processDesc':$scope.processDesc
        }
        $rootScope.accountNames=$scope.accountName;
         $rootScope.processNames=$scope.processName;
        $rootScope.LOBs=$scope.selectedItem;
        $rootScope.businessArea=$scope.businessArea;
        $rootScope.processArea=$scope.processArea;
         $mdDialog.hide();
        $state.go("main.form",{ 'accountName':$scope.accountName,'processName':$scope.processName,'LOB': $scope.selectedItem,'businessArea':$scope.businessArea,'processArea':$scope.processArea,'processDesc':$scope.processDesc});
     }
});
