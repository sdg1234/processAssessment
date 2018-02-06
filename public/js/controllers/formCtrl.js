app.controller('formCtrl', function($scope, $rootScope, $state, $http, $timeout, $mdDialog, $mdSidenav, $stateParams, dataFactory) {
    console.log("formCtrl loaded..");
     $scope.barArray=[];
    //$scope.isrequired=true;
    $scope.blurThis=function(id){
        console.log(id);
        $('#'+id).addClass('md-input-has-value');
    }
     $scope.estimation= function(){
         var req = {
            method: 'POST',
            url: '/readingEstimation',
        }
        var res = $http(req);
        res.success(function(data, status, headers, config) {
            console.log(data);
                $scope.estimateData=data;
            }
        )}
     $scope.estimation();
    $scope.retrievingFormData = function() {
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
            console.log(data);
            $scope.formData = data;
            $scope.type = "insert";
            for (var i = 0; i < $scope.formData.length; i++) {
                var questionsLength = $scope.formData[i].questions.length;
                if (questionsLength % 8 == 0) {
                    $scope.formData[i].cards = new Array(questionsLength / 8);
                    console.log("if cards" + $scope.formData[i].cards);
                } else {
                    $scope.formData[i].cards = new Array(Math.ceil(questionsLength / 8));
                    console.log("else cards" + $scope.formData[i].cards);
                }
            }
            console.log($scope.formData);
        });
        res.error(function(data, status, headers, config) {
            alert("failure message: " + JSON.stringify({
                data: data
            }));
        });
    }




    $scope.retrievingresult = function(formid) {
        formid = parseInt(formid);

        var data = {
            "form_id": formid
        };
        var req = {
            method: 'POST',
            url: '/retrievingformdata',
            data: data
        }
        var res = $http(req);
        res.success(function(data, status, headers, config) {
            console.log(data);
            $scope.type = data[0].type;
            $scope.AccountName = data[0].accountName;
            $scope.ProcessName = data[0].processName;
            $scope.lob = data[0].lob;
            $scope.businessArea=data[0].businessArea;
            $scope.processArea=data[0].processArea;
            $rootScope.accountNames = $scope.AccountName;
            $rootScope.processNames = $scope.ProcessName;
            $rootScope.LOBs = $scope.lob;
            $rootScope.businessArea= $scope.businessArea;
            $rootScope.processArea=$scope.processArea;
            $scope.processDesc = data[0].processDesc;
            $scope.formData = data[0].formData;
            for(var i = 0; i < $scope.formData.length; i++){
                if($scope.formData[i].sectionName=="Interfacing Systems Details"){
                    for(var j=0;j<$scope.formData[i].questions.length;j++){
                         if($scope.formData[i].questions[j].id==16){
                             console.log("jsdbhfhjfjkbgfkjbgjkg");
                             var ocr = $scope.formData[i].questions[j].answer.name;
                             console.log(ocr);
                             if(ocr=="No"){
                                 console.log(ocr);
                                 $scope.InferenceEstimation(ocr);
                             }
                             else if(ocr=="Yes, Hand written Images"){
                                 $scope.inference5="RPA NOT APPLICABLE";
                             }
                             else if(ocr=="Yes, Printed Images"){
                                 $scope.inference5="Complex";
                                 console.log("hi am inthe printed ");
                                 console.log($scope.estimateData[0].low[0]);
                                  $scope.barArray.push($scope.estimateData[0].low[0]);
                                 $timeout(function() {
                            $scope.generateBarGraph2();
                                }, 200);

                             }
                         }
                    }
                }
            }
            for (var i = 0; i < $scope.formData.length; i++) {
                if ($scope.formData[i].questions != null) {
                    var questionsLength = $scope.formData[i].questions.length;
                    if (questionsLength % 8 == 0) {
                        $scope.formData[i].cards = new Array(questionsLength / 8);
                        console.log("if cards" + $scope.formData[i].cards);
                    } else {
                        $scope.formData[i].cards = new Array(Math.ceil(questionsLength / 8));
                        console.log("else cards" + $scope.formData[i].cards);
                    }
                } else {
                    console.log("Has Entered View Report");
                }

            }
            console.log($scope.formData);
            if ($scope.formData[$scope.formData.length - 1].sectionName == "View Reports") {
                $scope.selectedIndex = data[0].formData.length - 1;


                $scope.val = $scope.formData[$scope.formData.length - 1].total[3].value;
                $scope.inference1 = $scope.formData[$scope.formData.length - 1].total[0].inference;
                $scope.inference2 = $scope.formData[$scope.formData.length - 1].total[1].inference;
                $scope.inference3 = $scope.formData[$scope.formData.length - 1].total[2].inference;
                $scope.inference4 = $scope.formData[$scope.formData.length - 1].total[3].inference;


                $scope.generateGuage = function(val) {
                    console.log(val);
                    var gauge1 = loadLiquidFillGauge("fillgauge1", val);
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

                $timeout(function() {
                    console.log("Entered the guage");
                    $scope.generateGuage($scope.val);
                    
                }, 100);

            }
        });
        res.error(function(data, status, headers, config) {
            alert("failure message: " + JSON.stringify({
                data: data
            }));
        });
    }
    $scope.InferenceEstimation=function(ocr){
       
         console.log("amkjhkjhjkjkh isdbhvfsdjk"+ocr);
for(var i = 0; i < $scope.formData.length; i++){
    if($scope.formData[i].sectionName=="View Reports"){
            for(var j=0;j<$scope.formData[i].total.length;j++){
                 if($scope.formData[i].total[j].name=="automation"){
                     console.log($scope.estimateData);
                    for(var k=0;k<$scope.estimateData.length;k++){
                        console.log("hlsdfjfsdkahk"+$scope.formData[i].total[j].value);
                        if($scope.formData[i].total[j].value>$scope.estimateData[k].high[0].value){
                                $scope.inference5=$scope.estimateData[k].high[0].name;
                                console.log($scope.estimateData[k].high[0].name);
                                 $scope.barArray.push($scope.estimateData[k].high[0]);
                                  $timeout(function() {
//                                    $scope.generateBarGraph();
                                      $scope.generateBarGraph2();
                                    }, 100);
                                
                        }
                        else if($scope.estimateData[k].medium[0].value<$scope.formData[i].total[j].value<$scope.estimateData[k].high[0].value)
                        {
                                  $scope.inference5=$scope.estimateData[k].medium[0].name;
                            console.log($scope.estimateData[k].medium[0].name);
                             $scope.barArray.push($scope.estimateData[k].medium[0]);
                              $timeout(function() {
//                            $scope.generateBarGraph();
                                    $scope.generateBarGraph2();
                                }, 100);

                            
                        }
                        else if($scope.formData[i].total[j].value<$scope.estimateData[k].low[0].value){
                                 $scope.inference5=$scope.estimateData[k].low[0].name;
                                     console.log($scope.estimateData[k].low[0].name);
                                     $scope.barArray.push($scope.estimateData[k].low[0]);
                                      $timeout(function() {
//                        $scope.generateBarGraph();
                                          $scope.generateBarGraph2();
                                        }, 100);

                            }
                    }     
                 }
            }
        }
    }
 }



   var index1 = $stateParams.value1;
   
    var formid = $stateParams.form_id;
    $scope.score = $stateParams.score;
    console.log("hi am log");
    console.log($scope.index1);
    if ($scope.score != null) {
        console.log("Edit Controller/View controller entered");
         $scope.result = (index1.toLowerCase() === 'true');
        $scope.retrievingresult(formid);
        $rootScope.details = true;


    } else {
        $scope.retrievingFormData();
    }

    dataFactory.id = true;

    var accountName = $stateParams.accountName;
    var processName = $stateParams.processName;
    var lob = $stateParams.LOB;
    var businessArea= $stateParams.businessArea;
    var processArea= $stateParams.processArea;
    var processDesc = $stateParams.processDesc;
    console.log(accountName);

    $scope.dialog = function(ev) {
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

    $scope.save = function(indicator) {
        console.log("Entered Save Function");
        if (formid == null) {
            $scope.sendingFormData($scope.formData, indicator);
        } else {
            $scope.updatingFormData($scope.formData, formid);
        }
    }

    $scope.submit = function(type) {
        console.log("am in submit" + type);
        console.log($scope.formData);
        $scope.type = type;
        $scope.tester = true;
        if ($scope.tester == true && $scope.type != "update") {
            $scope.tester = false;
            $scope.tester1 = false;
            for (var i = 0; i < $scope.formData.length; i++) {
                for (var j = 0; j < $scope.formData[i].questions.length; j++) {
                    if (($scope.formData[i].questions[j].type == 'mandatory') && ($scope.formData[i].questions[j].answer.name == "")) {

                        console.log($scope.formData[i].questions[j].type);
                        $scope.tester1 = true;
                        $scope.tester = true;
                    }
                }
            }
        }
        if ($scope.tester1 == true) {
            console.log("swal");
            swal({
                    title: "Oops!",
                    text: "Mandatory Fields to be Filled",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#1e88e5",
                    confirmButtonText: "Okay!",
                    closeOnConfirm: true
                },
                function() {
                    console.log("swal function");
                });
        }
        if ($scope.tester == false || $scope.type == "update") {
            console.log("original function");
            $scope.answerfixing($scope.formData, type);
        }



    }



    $scope.answerfixing = function(formData, type) {
        console.log(formData);

        if ((formData[formData.length - 1].sectionName != "View Reports" && $scope.type == "save") || ($scope.type != "save" && (formid != null && $scope.type != "update"))) {
            console.log("Entered the if Condoition");
            for (var i = 0; i < formData.length; i++) {
                for (var j = 0; j < formData[i].questions.length; j++) {

                    if (formData[i].questions[j].values.length > 0) {

                        for (var k = 0; k < formData[i].questions[j].values.length; k++) {
                            if (formData[i].questions[j].answer.name == formData[i].questions[j].values[k].name) {
                                formData[i].questions[j].answer.value = formData[i].questions[j].values[k].value;
                            }
                        }
                    } else if (formData[i].questions[j].values.length == 0) {

                        formData[i].questions[j].answer.value = formData[i].questions[j].answer.name


                    }
                }


            }


            $scope.updatingFormData(formData, formid);

        } else if (formData[formData.length - 1].sectionName == "View Reports") {
            console.log("Entered the elseif Condoition");
            for (var i = 0; i < formData.length - 1; i++) {
                for (var j = 0; j < formData[i].questions.length; j++) {

                    if (formData[i].questions[j].values.length > 0) {

                        for (var k = 0; k < formData[i].questions[j].values.length; k++) {
                            if (formData[i].questions[j].answer.name == formData[i].questions[j].values[k].name) {
                                formData[i].questions[j].answer.value = formData[i].questions[j].values[k].value;
                            }
                        }
                    } else if (formData[i].questions[j].values.length == 0) {

                        formData[i].questions[j].answer.value = formData[i].questions[j].answer.name


                    }
                }


            }


            $scope.updatingFormData(formData, formid);

        } else {
            console.log("Entered the else Condoition");
            for (var i = 0; i < formData.length; i++) {
                for (var j = 0; j < formData[i].questions.length; j++) {
                    if (formData[i].questions[j].values.length > 0) {
                        for (var k = 0; k < formData[i].questions[j].values.length; k++) {
                            if (formData[i].questions[j].answer.name == formData[i].questions[j].values[k].name) {
                                formData[i].questions[j].answer.value = formData[i].questions[j].values[k].value;
                            }
                        }
                    } else if (formData[i].questions[j].values.length == 0) {

                        formData[i].questions[j].answer.value = formData[i].questions[j].answer.name


                    }
                }


            }

            $scope.sendingFormData(formData, type);

        }



    }

    $scope.sendingFormData = function(result, type) {



        var req = {
            method: 'POST',
            url: '/sendingformdata',
            data: {
                formData: result,
                loginName: dataFactory.loginName,
                "accountName": accountName,
                "processName": processName,
                "lob": lob,
                "processDesc": processDesc,
                "businessArea": businessArea,
                "processArea": processArea,
                "type": type
            }
        }
        var res = $http(req);
        res.success(function(data, status, headers, config) {
            console.log(data);
            if (data[data.length - 1].sectionName == "View Reports") {
                var scoreArray = [{
                    "totalscore": data[data.length - 1].total[3].value,
                    "inference1": data[data.length - 1].total[0].inference,
                    "inference2": data[data.length - 1].total[1].inference,
                    "inference3": data[data.length - 1].total[2].inference,
                    "inference4": data[data.length - 1].total[3].inference,

                }]
                $scope.showDialog = function() {

                    $mdDialog.show({
                        controller: "scoreDialog",
                        templateUrl: 'pages/scoreDialog.html',
                        parent: angular.element(document.body),
                        // targetEvent: event,
                        clickOutsideToClose: true,
                        locals: {
                            score: scoreArray
                        }

                    }).then(function(answer) {
                        console.log(answer);
                    }, function() {
                        console.log("dialog cancelled");
                    });
                }
                $scope.showDialog();

            }
        });
        res.error(function(data, status, headers, config) {
            alert("failure message: " + JSON.stringify({
                data: data
            }));
        });

    }




    $scope.updatingFormData = function(result, id) {

        console.log(result);
        console.log(id);

        var req = {
            method: 'POST',
            url: '/updateData',
            data: {
                formData: result,
                id: id,
                type: $scope.type
            }
        }
        var res = $http(req);
        res.success(function(data, status, headers, config) {
            console.log(data);
            if (data[data.length - 1].sectionName == "View Reports") {
                var scoreArray = [{
                    "totalscore": data[data.length - 1].total[3].value,
                    "inference1": data[data.length - 1].total[0].inference,
                    "inference2": data[data.length - 1].total[1].inference,
                    "inference3": data[data.length - 1].total[2].inference,
                    "inference4": data[data.length - 1].total[3].inference,

                }]
                $scope.showDialog = function() {

                    $mdDialog.show({
                        controller: "scoreDialog",
                        templateUrl: 'pages/scoreDialog.html',
                        parent: angular.element(document.body),
                        // targetEvent: event,
                        clickOutsideToClose: true,
                        locals: {
                            score: scoreArray
                        }

                    }).then(function(answer) {
                        console.log(answer);
                    }, function() {
                        console.log("dialog cancelled");
                    });
                }
                $scope.showDialog();
            }
        });
        res.error(function(data, status, headers, config) {
            alert("failure message: " + JSON.stringify({
                data: data
            }));
        });

    }




    $scope.i = 0;
$scope.tabClick= function(){
     $scope.i = 0;
}

    $scope.nextv = function(outerindex, tabindex) {
        
        console.log($scope.formData);
        $scope.selectedIndex = tabindex;
        if (outerindex == $scope.formData[tabindex].cards.length - 1) {
            console.log($scope.selectedIndex);
            $scope.selectedIndex = tabindex + 1;
            console.log("after" + $scope.selectedIndex);
            $scope.i = 0;
        } else {
            console.log("else" + $scope.i + outerindex);
            $scope.i = outerindex + 1;
        }

    }
    
    
    
    $scope.prev = function(outerindex, tabindex) {
        
        console.log(" previos outerIndex"+outerindex);
        
        $scope.selectedIndex = tabindex;
        if(outerindex ==0) {
           
            console.log($scope.selectedIndex);
            console.log(" previostabIndex"+tabindex);
            $scope.selectedIndex = tabindex - 1;
            console.log("after" + $scope.selectedIndex);
            $scope.i = 0;
        }else if (outerindex == $scope.formData[tabindex].cards.length - 1) {
             console.log(" previoselse" + $scope.i + outerindex);
            $scope.i = outerindex - 1;
        } 
        else{
             $scope.i = outerindex - 1;
        }
    }

    $scope.k = 0;
    $scope.go = function(viewIndex) {
        console.log("viewIndex" + viewIndex);
        if (viewIndex == $scope.formData.length - 2) {
            $scope.k = 0;
            console.log("viewIndex" + viewIndex);
        } else {
            viewIndex = viewIndex + 1
            $scope.k = viewIndex;
            $scope.viewSectionIndex = viewIndex;
            console.log("viewIndex" + viewIndex);
        }

    }

    // $scope.generatePDF = function() {
    //     var imgData = new Image();
    //     console.log("hi am download");
    //     console.log($scope.formData);
    //     html2canvas($("#pdfScore"), {
    //         onrendered: function(canvas) {
    //             var doc = new jsPDF('l', 'mm');
    //             var imgData = canvas.toDataURL(
    //                 'image/png');

    //             var section1 = [];
    //             var section2 = [];
    //             var section3 = [];

    //             for (var i = 0; i < $scope.formData.length; i++) {
    //                 if ($scope.formData[i].sectionName == "Interfacing Systems Details") {
    //                     section1.push($scope.formData[i].questions);
    //                     console.log("hdfsksdkfsd");
    //                 } else if ($scope.formData[i].sectionName == "Return on Investment Analysis") {
    //                     section2.push($scope.formData[i].questions);
    //                 } else if ($scope.formData[i].sectionName == "Process Criticality") {
    //                     section3.push($scope.formData[i].questions);
    //                 }
    //             }
    //             console.log(section1);
    //             console.log(section2);
    //             console.log(section3);
    //             //        for(var i=0;i<16;i++){
    //             //            names.push($scope.formData[i]);
    //             //        }
    //             var lMargin = 25; //left margin in mm
    //             var rMargin = -10; //right margin in mm
    //             var pdfInMM = 210;
    //             var rectMargin = 20;
    //             var text = $scope.processDesc;
    //             var splitTitle = doc.splitTextToSize(text, (pdfInMM - lMargin - rMargin));
    //             var doc = new jsPDF('l', 'mm', [200, 210]);
    //             var dim = doc.getTextDimensions('text');
    //             console.log(dim.h);
    //             doc.setDrawColor(78, 132, 196);
    //             doc.setFillColor(78, 132, 196);
    //             doc.rect(0, 0, 297, 12, 'F');
    //             doc.setTextColor(255, 255, 255);
    //             doc.setFontType("bold");
    //             doc.setFont("'Open Sans', san-serif");
    //             doc.text(80, 10, 'Process Assessment Report');
    //             doc.rect(rectMargin, 20, 170, 70 + (dim.h));
    //             doc.setFontType("bold");
    //             doc.setFontSize(14);
    //             doc.setTextColor(0, 0, 0);
    //             doc.text(lMargin, 40, 'Process Name:');
    //             doc.text(lMargin, 50, 'Line of Business:');
    //             doc.text(lMargin, 60, 'Bussiness Area:');
    //             doc.text(lMargin, 70, 'Process Area:')
    //             doc.text(lMargin, 80, 'Account Name:');
                
    //             doc.text(lMargin, 90, 'Process Description:');
    //             //        doc.line(lMargin, 63, 200, 63);
    //             doc.setFont('helvetica');
    //             doc.setFontSize(12);
    //             doc.setFontType('normal');
    //             doc.text(140, 40, $scope.ProcessName);
    //             doc.text(140, 50, $scope.lob);
    //             doc.text(140,60,$scope.businessArea);
    //             doc.text(140,70,$scope.processArea);
    //             doc.text(140, 80, $scope.AccountName);
              
                
    //             //        doc.text(80, 60, splitTitle);
    //             doc.text(lMargin, 100, splitTitle);
    //             doc.addPage();
    //             doc.setDrawColor(78, 132, 196);
    //             doc.setFillColor(78, 132, 196);
    //             doc.rect(0, 0, 297, 12, 'F');
    //             doc.setTextColor(255, 255, 255);
    //             doc.setFontType("bold");
    //             doc.setFont("'Open Sans', san-serif");
    //             doc.setFontSize(14);
    //             doc.text(80, 10, 'i.Interfacing Systems Details');
    //             doc.setTextColor(0, 0, 0);
    //             doc.setFontType('normal');
    //             doc.setFont('helvetica');
    //             doc.setFontSize(12);
    //             for (var i = 0; i < section1.length; i++) {
    //                 section1[i].forEach(function(employee, i) {
    //                     //            console.log(employee);
    //                     var question = employee.question;
    //                     console.log(employee.answer.name);
    //                     doc.text(20, 30 + (i * 10), employee.id + "." + question);
    //                     doc.text(150, 30 + (i * 10), employee.answer.name);
    //                 });
    //             }


    //             doc.addPage();
    //             doc.setDrawColor(78, 132, 196);
    //             doc.setFillColor(78, 132, 196);
    //             doc.rect(0, 0, 297, 12, 'F');
    //             doc.setTextColor(255, 255, 255);
    //             doc.setFontType("bold");
    //             doc.setFont("'Open Sans', san-serif");
    //             doc.setFontSize(14);
    //             doc.text(80, 10, 'ii.Return on Investment Analysis');
    //             doc.setTextColor(0, 0, 0);
    //             doc.setFontType('normal');
    //             doc.setFont('helvetica');
    //             doc.setFontSize(12);
    //             // for(var i=16;i<29;i++){
    //             //     doc.text(20, 30 + (i * 10), 
    //             // i+ $scope.result[i].question +": " +$scope.result[i].value);
    //             // }
    //             for (var i = 0; i < section2.length; i++) {
    //                 section2[i].forEach(function(employee, i) {
    //                     console.log(employee);
    //                     var question = employee.question;
    //                     console.log(employee.answer.name);
    //                     doc.text(20, 30 + (i * 10), employee.id + "." + question);
    //                     doc.text(150, 30 + (i * 10), employee.answer.name);
    //                 });
    //             }

    //             doc.addPage();
    //             doc.setDrawColor(78, 132, 196);
    //             doc.setFillColor(78, 132, 196);
    //             doc.rect(0, 0, 297, 12, 'F');
    //             doc.setTextColor(255, 255, 255);
    //             doc.setFontType("bold");
    //             doc.setFontSize(14);
    //             doc.setFont("'Open Sans', san-serif");
    //             doc.text(80, 10, 'iii.Process Criticality');
    //             doc.setTextColor(0, 0, 0);
    //             doc.setFontType('normal');
    //             doc.setFont('helvetica');
    //             doc.setFontSize(12);
    //             for (var i = 0; i < section3.length; i++) {
    //                 section3[i].forEach(function(employee, i) {
    //                     console.log(employee);
    //                     var question = employee.question;
    //                     console.log(employee.answer.name);
    //                     doc.text(20, 30 + (i * 10), employee.id + "." + question);
    //                     doc.text(150, 30 + (i * 10), employee.answer.name);
    //                 });
    //             }
    //             doc.addPage();
    //             doc.setDrawColor(78, 132, 196);
    //             doc.setFillColor(78, 132, 196);
    //             doc.rect(0, 0, 297, 12, 'F');
    //             doc.setTextColor(255, 255, 255);
    //             doc.setFontType("bold");
    //             doc.setFontSize(14);
    //             doc.setFont("'Open Sans', san-serif");
    //             doc.text(80, 10, 'Inferences');
    //             doc.setFontSize(20);
    //             doc.text(60, 40, 'Inferences');
    //             doc.setFontSize(13);
    //             doc.setTextColor(0, 0, 0);
    //             doc.setFont('helvetica');
    //             doc.setFontType('normal');
    //             for(var k=0;k<$scope.formData[3].total.length;k++){
    //                 doc.text(20, 30 + (k * 10), $scope.formData[3].total[k].inference);
    //             }
    //             // doc.addImage(imgData, 'PNG', 30, 70, 150, 80);
    //             doc.addImage(imgData, 'PNG',10, 70, 180, 110);
    //             doc.save('sample-file.pdf');
    //         }
    //     });

    // }
    $scope.generatePDF = function() {
        var imgData = new Image();
        console.log("hi am download");
        console.log($scope.formData);
        html2canvas($("#pdfScore"), {
            onrendered: function(canvas) {
                var doc = new jsPDF('l', 'mm');
                var imgData = canvas.toDataURL(
                    'image/png');

                var section1 = [];
                var section2 = [];
                var section3 = [];

                for (var i = 0; i < $scope.formData.length; i++) {
                    if ($scope.formData[i].sectionName == "Interfacing Systems Details") {
                        section1.push($scope.formData[i].questions);
                        console.log("hdfsksdkfsd");
                    } else if ($scope.formData[i].sectionName == "Return on Investment Analysis") {
                        section2.push($scope.formData[i].questions);
                    } else if ($scope.formData[i].sectionName == "Process Criticality") {
                        section3.push($scope.formData[i].questions);
                    }
                }
                console.log(section1);
                console.log(section2);
                console.log(section3);
                //        for(var i=0;i<16;i++){
                //            names.push($scope.formData[i]);
                //        }
                var lMargin = 25; //left margin in mm
                var rMargin = -10; //right margin in mm
                var pdfInMM = 210;
                var rectMargin = 20;
                var text = $scope.processDesc;
                var splitTitle = doc.splitTextToSize(text, (pdfInMM - lMargin - rMargin));
                var doc = new jsPDF('l', 'mm', [200, 210]);
                var dim = doc.getTextDimensions('text');
                console.log(dim.h);
                doc.setDrawColor(78, 132, 196);
                doc.setFillColor(78, 132, 196);
                doc.rect(0, 0, 297, 12, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontType("bold");
                doc.setFont("'Open Sans', san-serif");
                doc.text(80, 10, 'Process Assessment Report');
                doc.rect(rectMargin, 50, 170, 50 + (dim.h));
                doc.setFontType("bold");
                doc.setFontSize(14);
                doc.setTextColor(0, 0, 0);
                doc.text(lMargin, 60, 'Process Name:');
                doc.text(lMargin, 70, 'Account Name:');
                doc.text(lMargin, 80, 'Line of Business:');
                doc.text(lMargin, 90, 'Process Description');
                //        doc.line(lMargin, 63, 200, 63);
                doc.setFont('helvetica');
                doc.setFontSize(12);
                doc.setFontType('normal');
                doc.text(140, 60, $scope.ProcessName);
                doc.text(140, 70, $scope.AccountName);
                doc.text(140, 80, $scope.lob);
                //        doc.text(80, 60, splitTitle);
                doc.text(lMargin, 100, splitTitle);
                doc.addPage();
                doc.setDrawColor(78, 132, 196);
                doc.setFillColor(78, 132, 196);
                doc.rect(0, 0, 297, 12, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontType("bold");
                doc.setFont("'Open Sans', san-serif");
                doc.setFontSize(14);
                doc.text(80, 10, 'i.Interfacing Systems Details');
                doc.setTextColor(0, 0, 0);
                doc.setFontType('normal');
                doc.setFont('helvetica');
                doc.setFontSize(12);
                for (var i = 0; i < section1.length; i++) {
                    section1[i].forEach(function(employee, i) {
                        //            console.log(employee);
                        var question = employee.question;
                        console.log(employee.answer.name);
                        doc.text(20, 30 + (i * 10), employee.id + "." + question);
                        doc.text(150, 30 + (i * 10), employee.answer.name);
                    });
                }


                doc.addPage();
                doc.setDrawColor(78, 132, 196);
                doc.setFillColor(78, 132, 196);
                doc.rect(0, 0, 297, 12, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontType("bold");
                doc.setFont("'Open Sans', san-serif");
                doc.setFontSize(14);
                doc.text(80, 10, 'ii.Return on Investment Analysis');
                doc.setTextColor(0, 0, 0);
                doc.setFontType('normal');
                doc.setFont('helvetica');
                doc.setFontSize(12);
                // for(var i=16;i<29;i++){
                //     doc.text(20, 30 + (i * 10), 
                // i+ $scope.result[i].question +": " +$scope.result[i].value);
                // }
                for (var i = 0; i < section2.length; i++) {
                    section2[i].forEach(function(employee, i) {
                        console.log(employee);
                        var question = employee.question;
                        console.log(employee.answer.name);
                        doc.text(20, 30 + (i * 10), employee.id + "." + question);
                        doc.text(150, 30 + (i * 10), employee.answer.name);
                    });
                }

                doc.addPage();
                doc.setDrawColor(78, 132, 196);
                doc.setFillColor(78, 132, 196);
                doc.rect(0, 0, 297, 12, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontType("bold");
                doc.setFontSize(14);
                doc.setFont("'Open Sans', san-serif");
                doc.text(80, 10, 'iii.Process Criticality');
                doc.setTextColor(0, 0, 0);
                doc.setFontType('normal');
                doc.setFont('helvetica');
                doc.setFontSize(12);
                for (var i = 0; i < section3.length; i++) {
                    section3[i].forEach(function(employee, i) {
                        console.log(employee);
                        var question = employee.question;
                        console.log(employee.answer.name);
                        doc.text(20, 30 + (i * 10), employee.id + "." + question);
                        doc.text(150, 30 + (i * 10), employee.answer.name);
                    });
                }
                doc.addPage();
                doc.setDrawColor(78, 132, 196);
                doc.setFillColor(78, 132, 196);
                doc.rect(0, 0, 297, 12, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontType("bold");
                doc.setFontSize(14);
                doc.setFont("'Open Sans', san-serif");
                doc.text(80, 10, 'Inferences');
                doc.setFontSize(20);
                doc.text(60, 40, 'Inferences');
                doc.setFontSize(13);
                doc.setTextColor(0, 0, 0);
                doc.setFont('helvetica');
                doc.setFontType('normal');
                for(var k=0;k<$scope.formData[3].total.length;k++){
                    doc.text(20, 30 + (k * 10), $scope.formData[3].total[k].inference);
                }
                // doc.addImage(imgData, 'PNG', 30, 70, 150, 80);
                doc.addImage(imgData, 'PNG',10, 70, 180, 110);
                doc.save('sample-file.pdf');
            }
        });

    }
     $scope.generateBarGraph=function()
    {
         console.log("am complex");
         console.log($scope.barArray);
//        console.log("am bar graph");
//        console.log($scope.barArray);
//        data = [
//        {label:"Category 1", value:5},
//        {label:"Category 2", value:2}
//    ];
//
//    var div = d3.select("my-id").append("div").attr("class", "toolTip");
//
//    var axisMargin = 20,//20
//            margin = 50,//40
//            valueMargin = 4,
//            width = parseInt(d3.select('#my-id').style('width'), 10),
//            height = parseInt(d3.select('#my-id').style('height'), 10),
//            barHeight = (height-axisMargin-margin*1)* 0.4/data.length,
//            barPadding = (height-axisMargin-margin*1)*0.6/data.length,
//            data, bar, svg, scale, xAxis, labelWidth = 0;
//            console.log(width);
//    max = d3.max(data, function(d) { return d.value; });
//
//    svg = d3.select('#my-id')
//            .append("svg")
//            .attr("width", width)
//            .attr("height", height);
//
//    bar = svg.selectAll("g")
//            .data(data)
//            .enter()
//            .append("g");
//
//    bar.attr("class", "bar")
//            .attr("cx",0)
//            .attr("transform", function(d, i) {
//                return "translate(" + margin + "," + (i * (barHeight + barPadding) +          barPadding) + ")";
//            });
//
//    bar.append("text")
//            .attr("class", "label")
//            .attr("y", barHeight / 5)
//            .attr("dy", ".25em") //vertical align middle
//            .text(function(d){
//                return d.label;
//            }).each(function() {
//        labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
//    });       
//    scale = d3.scale.linear()
//            .domain([0,max])
//            .range([0, width - margin*5 - labelWidth]);
//
////    xAxis = d3.svg.axis()
////            .scale(scale)
////            .tickSize(-height + 5*margin + axisMargin)
////            .orient("bottom");
//        
//        
////    var x = d3.scale.ordinal()
////    .domain(["0","5","10","15","20","25"])
////    .rangeRoundBands([20, 280], .1);
////    var xAxis = d3.svg.axis()
////    .scale(x)
////    .orient("bottom");
//var o = d3.scale.ordinal()
//    .domain([1, 2, 3])
//    .rangeRoundBands([0, 100]);
//    o.rangeExtent();
// var xAxis = d3.svg.axis()
//    .scale(0)
//    .orient("bottom");
//    bar.append("rect")
//            .attr("transform", "translate("+labelWidth+", 0)")
//            .attr("height", barHeight)
//						.attr("width", 0)
//						.transition()
//						.duration(1500)
//						.delay(function(d,i){ return i*250})
//            .attr("width", function(d){
//                return d.value;
//            });
//
//    bar.append("text")
//            .attr("class", "value")
//            .attr("y", barHeight / 5)
//            .attr("dx", -valueMargin + labelWidth) //margin right
//            .attr("dy", ".35em") //vertical align middle
//            .attr("text-anchor", "end")
//            .text(function(d){
//                return (d.value+"%");
//            })
//            .attr("x", function(d){
//                var width = this.getBBox().width;
//                return Math.max(width + valueMargin, scale(d.value));
//         
//            });
//      
//
//    bar
//            .on("mousemove", function(d){
//                div.style("left", d3.event.pageX+10+"px");
//                div.style("top", d3.event.pageY-25+"px");
//                div.style("display", "inline-block");
//                div.html((d.label)+"<br>"+(d.value)+"%");
//      
//            });
//    bar
//            .on("mouseout", function(d){
//                div.style("display", "none");
//            });
//
//    svg.insert("g",":first-child")
//            .attr("class", "axisHorizontal")
//            .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin)+")")
//            .call(xAxis);
        
        
        
        
        
        /////*****************************
//         var data=
//             {
//                 name:"Category 1", 
//                 value:5
//              }
// 			var fullwidth = 1000,
// 				fullheight = 500;
// 			var margin = {top: 10, right: 25, bottom: 45, left: 50};

// 			var width = fullwidth - margin.left - margin.right,
//     		height = fullheight - margin.top - margin.bottom;
// 			var widthScale = d3.scale.linear()
// 								.range([0, width]);
// 			var heightScale = d3.scale.ordinal()
// 								.rangeRoundBands([ 0, height], 0.2);

// 			var xAxis = d3.svg.axis()
// 							.scale(widthScale)
// 							.orient("bottom");
// 			var yAxis = d3.svg.axis()
// 							.scale(heightScale)
// 							.orient("left")
// 							.innerTickSize(0);

// 			var svg = d3.select("#my-id")
// 						.append("svg")
// 							.attr("width", fullwidth)
// 							.attr("height", fullheight)
// 						.append("g")
// 							.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
//                 console.log(data);
// 				widthScale.domain([2, 50]);
// 				heightScale.domain(["hi","hello"]);
// //d3.map(function(data) { return data.name; } )
// 				var rects = svg.selectAll("rect")
// 						.data(data)
// 						.enter()
// 						.append("rect");

// 					rects
// 					.attr("x", 0)
// 					.attr("y", function(d) {
// 						return heightScale(d.name); // because we mapped to the names!
// 					})
// 					.attr("width", function(d) {
// 						return widthScale(d.name);
// 					})
// 					.attr("height", heightScale.rangeBand()) // the height is a rangeband!
// 					.append("title")
// 					.text(function(d) {
// 						return d.name + "'s access to good water: " + d.year2015 + "%";
// 					});

// 				svg.append("g")
// 					.attr("class", "x axis")
// 					.attr("transform", "translate(0," + height + ")")
// 					.call(xAxis)

// 				svg.append("g")
// 				.attr("class", "y axis")
// 					.call(yAxis);
        
// //				svg.append("text")
// //					.attr("class", "xlabel")
// //        	.attr("transform", "translate(" + width/2 + " ," +
// //        				height + ")")
// //        	.style("text-anchor", "middle")
// //        	.attr("dy", "35")
// //        	.text("Percent");



        ////************************** */
    //  var data = [{name: "One", value:12},
    //         {name: "Two", value:18}
    //        ];
//    var data = [{name: "One", value:[40, 30]},
//            {name: "Two", value:[30, 25]}
//           ];
//
//
//var colours = ["#FFAAAA", "#00FF99", "#6699FF"];
//var pieData = [];
//pieData.totals = [];
//
//
//var chart = d3.select(".chart");
//var margin = {bottom: 40, left: 35};
//var width = 500 - margin.left;
//var height = 500 - margin.bottom;
//var barWidth = width / data.length;
//var y = d3.scale.linear()
//  .range([height, 0])
//  .domain( [2,50 ] );
//
//var yAxis = d3.svg.axis()
//  .scale(y)
//  .orient("left");
//
//var x = d3.scale.ordinal()
//  .domain(data.map(function (d){ return d.name;}))
//  .rangeBands([0,200]);
//
//var xAxis = d3.svg.axis()
//  .scale(x)
//  .orient("bottom");
//
//chart.attr("height", height)
//  .attr("width", width);
///////////////////////////////////////////////////////////////
//
//var bars = chart.selectAll("g")
//  .data(data)
//  .enter().append("g")
//  .attr("transform", function(d, i) { 
//        if(i==0){
//            return "translate(" + ((i * barWidth) +25+ margin.left) + ",0)";
//       }
//        else if(i==1){
//             return "translate(" + ((i * barWidth)- margin.left-40) + ",0)";
//    } });
//for(var j=0;j<data.length;j++){
//     for (var i=0; i<=data[j].value.length; i++){
//        console.log("man y  a times");
//         bars.append("rect")
//        .attr("width", 50)
//        .attr("height", function(d, j){
//            console.log("am height");
//        console.log(d);
//        console.log(j);
//        return height - y(d.value[i]);
//    })
//    .attr("x",0)
//    .attr("y", function(d,j) { 
//        return y(d.value[i]);
//    })
//    .attr("style", "fill: " + colours[i-1]);
//     
//}
//}


 
 ////orignal
//  chart.selectAll("bar")
//       .data(data)
//     .enter().append("rect")
//       .style("fill", "steelblue")
//       .attr("x", function(d,j) {
//    console.log("am new  d");
//    console.log(d.value);
//    return x(d.value); })
//       .attr("width", 50)
//       .attr("y", function(d) { return y(d.value); })
//       .attr("height", function(d) { return height - y(d.value); })
//       .attr("transform", function(d, i) {
//          if(i==0){
//             return "translate(" + ((i * barWidth) +25+ margin.left) + ",0)";
//        }
//         else if(i==1){
//              return "translate(" + ((i * barWidth)- margin.left-40) + ",0)";
//     }
//      });
//// original
// bars.append("text")
//   .attr("x", (barWidth / 2) - 0.5)
//   .attr("y", function(d) { return y(d.value[0]); })
//   .attr("dy", "0.85em")
//   .text(function(d) { return "total: " + d.value[0]; });

//var yAxisSVG = chart.append("g")
//  .attr("class", "y axis")
//  .attr("transform", "translate(35, 0)")
//  .call(yAxis);
//
//yAxisSVG.append("text")
//  .text("Frequency")
//  .attr("transform", "translate(-30, 8)");
//
//var xAxisSVG = chart.append("g")
//  .attr("class", "x axis")
//  .attr("transform", "translate(" + margin.left + "," + height + ")")
//  .call(xAxis);

// xAxisSVG.append("text")
//   .text("Group")
//   .attr("transform", "translate(" + width/2 + ",20)");





var width  = 200,
    height = 150,
    radius = 75,
    colors = d3.scale.category20c()
    console.log("am colrs");
//         console.log(colors);

var piedata = [
  { 
    label: '',
    value: 30
  },{
    label: '18 weeks',
    value: 18
  }
]

var pie = d3.layout.pie()
  .value(function(d) { return d.value; })

var arc = d3.svg.arc()
  .outerRadius(radius)

var myChard = d3.select('.chart').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate('+ (width - radius) +', '+ (height - radius) +')')
  .selectAll('path').data(pie(piedata))
  .enter().append('g')
    .attr('class', 'slice')

var slices = d3.selectAll('g.slice')
  .append('path')
  .attr('fill', function(d, i) {
     return colors(i);
   })

   .attr('d', arc)
   .on('mouseover', function() {
     d3.select(this)
      .style('opacity', 0.8)
   })
  .on('mouseout', function() {
     d3.select(this)
      .style('opacity', 1)
   })

var text = d3.selectAll('g.slice')
  .append('text')
  .text(function(d) { return d.data.label; }) //slice = d, so we the slice's data.
  .attr('text-anchor', 'middle')
  .attr('fill', 'white')
  .attr('transform', function(d) {
    d.innerRadius = 0;
    d.outerRadius = radius;
    return 'translate('+arc.centroid(d)+')';//puts text at center of slice
  })


    }
     
     
     
     
     $scope.generateBarGraph2=function(){
         console.log("am bar2");
         console.log($scope.barArray);
//         console.log("am in graph2");
//
//var width  = 200,
//    height = 150,
//    radius = 75,
//    colors =  d3.scale.category20c()
//
//var piedata = [
//  { 
//    label: '',
//    value: 30
//  },{
//    label: '12 weeks',
//    value: 12
//  }
//]
//
//var pie = d3.layout.pie()
//  .value(function(d) { return d.value; })
//
//var arc = d3.svg.arc()
//  .outerRadius(radius)
//
//var myChart = d3.select('.chart2').append('svg')
//  .attr('width', width)
//  .attr('height', height)
//  .append('g')
//  .attr('transform', 'translate('+ (width - radius) +', '+ (height - radius) +')')
//  .selectAll('path').data(pie(piedata))
//  .enter().append('g')
//    .attr('class', 'slice')
//
//var slices = d3.selectAll('g.slice')
//  .append('path')
//  .attr('fill',function(d, i) {
//      console.log("am d");
//      console.log(d);
//      
//     return colors(i);
//   })
//   .attr('d', arc)
//   .on('mouseover', function() {
//     d3.select(this)
//      .style('opacity', 0.8)
//   })
//  .on('mouseout', function() {
//     d3.select(this)
//      .style('opacity', 1)
//   })
//
//var text = d3.selectAll('g.slice')
//  .append('text')
//  .text(function(d) { return d.data.label; }) //slice = d, so we the slice's data.
//  .attr('text-anchor', 'middle')
//  .attr('fill', 'white')
//  .attr('transform', function(d) {
//    d.innerRadius = 0;
//    d.outerRadius = radius;
//    return 'translate('+arc.centroid(d)+')';//puts text at center of slice
//  })
         var ctx = document.getElementById("myChart").getContext('2d');
ctx.canvas.width = 400;
ctx.canvas.height = 230;
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [""],
    datasets: [{
      label: 'Implementation effort',
      data: [$scope.barArray[0].effort.value,5],
      backgroundColor: "rgba(153,255,51,1)"
    }, {
      label: 'Implementation schedule',
      data: [$scope.barArray[0].schedule.value,25],
      backgroundColor: "rgba(255,153,0,1)"
    }]
  },

  options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize : 5,
                }
              
            }],
            xAxes: [{
                // Change here
            
            	categoryPercentage: 0.5,
            barPercentage: 0.5
              
            }]
        },
    maintainAspectRatio: false,
    events: false,
    tooltips: {
        enabled: false
    },
    hover: {
        animationDuration: 0
    },
    animation: {
        duration: 1,
        onComplete: function () {
            var chartInstance = this.chart,
                ctx = chartInstance.ctx;
                ctx.fillStyle = "black"
                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            this.data.datasets.forEach(function (dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                meta.data.forEach(function (bar, index) {
                    var data = dataset.data[index];                            
                    ctx.fillText(data, bar._model.x, bar._model.y - 5);
                });
            });
        }
    }
    }
     
           
});
     }


});