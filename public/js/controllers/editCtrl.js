app.controller('editCtrl', function($scope,$rootScope, $state, $http, $timeout, $mdSidenav,$stateParams) {
	console.log("editCtrl loaded..");
    $scope.selectedIndex=3;
    $rootScope.details=true;
     $scope.div1=true;
     $scope.div2=false;
     $scope.div4=true;
     $scope.div3=false;
     var index1= $stateParams.value1;
     var formid= $stateParams.form_id;
     $scope.score=$stateParams.score;
     console.log("am id"+ formid);
     console.log("am index" +index1);
      var toUpdate = {
            "form_id":formid,
            "updated":[
            ]
        }
     $scope.result = (index1.toLowerCase() === 'true');
     $scope.retrievingFormData = function(){
	console.log("vastundi");
      var req = {
          method: 'POST',
          url: '/praticedo',
          headers: {
              'Content-Type': 'text/plain'
          }
		  
      }
      var res = $http(req);
      res.success(function(data, status, headers, config) {
        $scope.formData=data;
        console.log($scope.formData);
      });
      res.error(function(data, status, headers, config) {
          alert("failure message: " + JSON.stringify({
              data: data
          }));
      });
    }
    $scope.generatePDF=function(){
        console.log("hi am download");
        console.log($scope.result2);
        for(var i=0;i<16;i++){
            
        }
        var names=[];
        // var names = $scope.result2;
        for(var i=0;i<16;i++){
            names.push($scope.result2[i]);
        }
        console.log(names);
        var doc=new jsPDF('l', 'mm', [200, 210]);
        doc.setDrawColor(78, 132, 196);
        doc.setFillColor(78, 132, 196);
        doc.rect(0, 0, 297, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontType("bold");
        doc.setFont("'Open Sans', san-serif");
        doc.setFontSize(14);
        doc.text(20, 10, 'Interfacing Systems Details');
        doc.setTextColor(0,0,0);
        doc.setFontType('normal');
        doc.setFont('helvetica');
        doc.setFontSize(12);
        names.forEach(function(employee, i){
          var question= employee.question;
          var option=0;
          if(i!=15){
              option= employee.option;
          }
          else
          option= employee.value.name;
        // doc.text(20, 30 + (i * 10), 
        //  i+1+ "." +question + " : " +option);
        doc.text(20,30+(i*10),i+1+ "." +question);
        doc.text(150,30+(i*10),option);
    });
    var names2=[];
     for(var i=16;i<29;i++){
            names2.push($scope.result2[i]);
        }
        doc.addPage();
         doc.setDrawColor(78, 132, 196);
         doc.setFillColor(78, 132, 196);
        doc.rect(0, 0, 297, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontType("bold");
         doc.setFont("'Open Sans', san-serif");
        doc.text(20, 10, 'Return on Investment Analysis');
         doc.setTextColor(0,0,0);
        doc.setFontType('normal');
        doc.setFont('helvetica');
        doc.setFontSize(12);
        // for(var i=16;i<29;i++){
        //     doc.text(20, 30 + (i * 10), 
        // i+ $scope.result[i].question +": " +$scope.result[i].value);
        // }
        names2.forEach(function(employee, i){
          var question= employee.question;
          var value=0;  
          if(i!=12){
              value= employee.value;
          }
          else
          value= employee.option;
         doc.text(20, 30 + (i * 10), 
        i+17+"."+ question);
       doc.text(150,30+(i*10),value);
         });
        var names3=[];
        for(var i=29;i<33;i++){
            names3.push($scope.result2[i]);
        }
        doc.addPage();
        doc.setDrawColor(78, 132, 196);
        doc.setFillColor(78, 132, 196);
        doc.rect(0, 0, 297, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontType("bold");
        doc.setFontSize(14);
         doc.setFont("'Open Sans', san-serif");
        doc.text(20, 10, 'Process Criticality');
        doc.setTextColor(0,0,0);
        doc.setFontType('normal');
        doc.setFont('helvetica');
        doc.setFontSize(12);
         names3.forEach(function(employee, i){
         doc.text(20, 30 + (i * 10), 
        i+30+"."+ employee.question);
        doc.text(150,30+(i*10),employee.option);
         });
         
        doc.save('Test.pdf');
    // var pdf = new jsPDF('p', 'pt', 'letter');
    // pdf.addHTML($('#content')[0], function () {
    //      pdf.save('test.pdf');
    //      });
    //  html2canvas($("#content"), {
    //             onrendered: function(canvas) {
    //                 var imgData = canvas.toDataURL(
    //                     'image/png');
    //                 var doc = new jsPDF('l', 'mm');
    //                 doc.addImage(imgData, 'PNG', 0, 0);
    //                  doc.save('sample-file.pdf');
    //             }
    //  });

    }
//   $scope.generatePDF= function(){
//       console.log("Hi");
//       var doc=new jsPDF();
//        doc.fromHTML($('#first-page').get(0), 10, 10, {'width': 180});
//        doc.addPage();
//         doc.fromHTML($('#second-page').get(0), 10, 10, {'width': 180});
//          doc.addPage();
//          doc.fromHTML($('#third-page').get(0), 10, 10, {'width': 180});
//        doc.save('gotit.pdf');
//   }
	$scope.retrievingFormData();
      $scope.changes= function(){
        $scope.div1=!$scope.div1;
        $scope.div2=!$scope.div2;
    }
    $scope.changess= function(){
       $scope.div3=!$scope.div3;
        $scope.div4=!$scope.div4;
    }
    $scope.retrievingEdit=function(){
        var data={ "form_id": formid};
        var req = {
          method: 'GET',
          url: '/retrievingEdit',
		  params: data
      }
      var res = $http(req);
      res.success(function(data, status, headers, config) {
		console.log(data);
        $scope.AccountName=data[0].accountName;
        $scope.ProcessName=data[0].processName;
        $scope.lob=data[0].lob;
          $rootScope.accountNames=$scope.AccountName;
          $rootScope.processNames=$scope.ProcessName;
          $rootScope.LOBs=$scope.lob;
        $scope.processDesc=data[0].processDesc;
         $scope.result2=data[0].questions;
        $scope.populateData($scope.result2);
      });
      res.error(function(data, status, headers, config) {
          alert("failure message: " + JSON.stringify({
              data: data
          }));
      });
    }
    $scope.retrievingEdit();
    $scope.populateData= function(data){
        console.log(data);
        console.log(data[0].option);
        $scope.formmodel1=data[0].option;
        $scope.formmodel2=data[1].option;
        $scope.formmodel3=data[2].option;
        $scope.formmodel4=data[3].option;
        $scope.formmodel5=data[4].option;
        $scope.formmodel6=data[5].option;
        $scope.formmodel7=data[6].option;
        $scope.formmodel8=data[7].option;
        $scope.formmodel9=data[8].option;
        $scope.formmodel10=data[9].option;
        $scope.formmodel11=data[10].option;
        $scope.formmodel12=data[11].option;
        $scope.formmodel13=data[12].option;
        $scope.formmodel14=data[13].option;
        $scope.formmodel15=data[14].option;
        $scope.formmodel16=data[15].value.name;
        $scope.formmodel17=data[16].value;
        $scope.formmodel18=data[17].value;
        $scope.formmodel19=data[18].value;
        $scope.formmodel20=data[19].value;
        $scope.formmodel21=data[20].value;
        $scope.formmodel22=data[21].value;
        $scope.formmodel23=data[22].value;
        $scope.formmodel24=data[23].value;
        $scope.formmodel25=data[24].value;
        $scope.formmodel26=data[25].value;
        $scope.formmodel27=data[26].value;
        $scope.formmodel28=data[28].option;
        $scope.formmodel29=data[27].value;
        $scope.formmodel30=data[29].option;
        $scope.formmodel31=data[30].option;
        $scope.formmodel32=data[31].option;
        $scope.formmodel33=data[32].option;
                           
        console.log("am formmodel1"+ $scope.formmodel15);
    }
    
    $scope.changed=function(data,element){
        var value=0;
        console.log("change Function");
        console.log(data);
        console.log(data.id+element);
        console.log(data.values);
        if(data.values.length>0){
            for(var i=0;i<data.values.length;i++){
            if(data.values[i].name==element){
                 value=data.values[i].value;
            }
        }
    }
    else{
        
        value=element;
        element=null;

    }   
        var objs={
            "qid":data.id,
            "option":element,
             "value":value
        }
        toUpdate.updated.push(objs);
        console.log("update array");
        console.log(toUpdate);
    }
    $scope.update=function(){
        console.log("am in update");
         var req = {
          method: 'POST',
          url: '/updateData',
          params : toUpdate
      }
      var res = $http(req);
      res.success(function(data, status, headers, config) {
            console.log("sucess");
            swal({
                            title: "Okay!",
                            text: "Form has been Updated!",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonColor: "#1e88e5",
                            confirmButtonText: "Okay!",
                            closeOnConfirm: true
                        },
                        function() {
                            console.log("swal function");
                            $state.go('main.worklist');
                            $rootScope.details=false;
                        });
      });
      res.error(function(data, status, headers, config) {
          alert("failure message: " + JSON.stringify({
              data: data
          }));
      });
    }
    $scope.view1=false;
    $scope.view2=true;
    $scope.view3=true;
    $scope.firstpage=function(){
        console.log("true false true false");
        $scope.view1=!$scope.view1;
        $scope.view2=!$scope.view2;
    }
    $scope.secondpage=function(){
        $scope.view3=!$scope.view3;
        $scope.view2=!$scope.view2;
        console.log( $scope.view1);
        console.log( $scope.view2);
        console.log( $scope.view3);
    }
    $scope.thirdpage=function(){
         $scope.view2=!$scope.view2;
         $scope.view3=!$scope.view3;
    }

    $scope.val = 77;
	
   
	 $scope.generateGuage = function(val) {
         console.log(val);
	 	var gauge1 = loadLiquidFillGauge("fillgauge1",val);
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
           $scope.generateGuage($scope.score);
        }, 100 );
	
	 
});