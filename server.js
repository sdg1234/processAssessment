var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var request=require('request');
var logger = require('morgan');
var path = require('path');
var formidable = require('formidable');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var PDFDocument = require('pdfkit');
var pdf = require('html-pdf');
var app = express();
var cors = require('cors');
// app.use(cors({origin: 'http://localhost:5678'}));
var url = 'mongodb://localhost:27017/Formsrpa55';
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
var port = 5678;
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
    console.log("user navigated");
});
app.use(function (req, res, next) {
    
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
    
        // Pass to next layer of middleware
        next();
    });


// usersJson();
function usersJson(){
     fs.readFile('./dbJsons/users.json', 'utf8', function (err, userData) {
        if (err) throw err;
        else {
            var userData = JSON.parse(userData);
            console.log(userData);
            usersJsontoDB(userData);
        }
    });
}
app.post('/gettingLOBData', function (req, res) {
    console.log("gettingLOBData");
    fs.readFile('./dbJsons/lob.json', 'utf8', function (err, lobData) {
        if (err) throw err;
        else {
            var lobData = JSON.parse(lobData);
           res.send(lobData);
        }
    });

});
function usersJsontoDB(data){
  MongoClient.connect(url, function (err, db) {
        db.collection('users').insertMany(data, function (err, result) {
            console.log("am result");
            console.log(data);
        });
    })
}
app.post('/userValidation', function (req, res) {
    console.log("userValidation");
      var data = req.body.userDetails;
      console.log(data.name);
      MongoClient.connect(url, function (err, db) {
          var callback = function (userArray) {
              console.log("am in callback");
            for(var i=0;i<userArray.length;i++){
                if(userArray[i].name==data.name &&userArray[i].password==data.password){
                    res.send("success");
                }
                else{
                    res.send("fail");
                }
            }
        }
        var userArray = [];
        var cursor = db.collection('users').find({
              "name": data.name
        });
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                //  console.dir(doc);
                console.log("am in if");
                userArray.push(doc);
                
            } else{
               callback(userArray);
            }
        });
    });
});
app.post('/praticedo', function (req, res) {
    fs.readFile('./dbJsons/mainform.json', 'utf8', function (err, formdata) {
        if (err) throw err;
        else {
            var forms = JSON.parse(formdata);
            
            res.send(forms);
        }
    });

});

app.post('/sendingformdata', function (req, res) {
    console.log("IT HAS BEEN Inserted");
      var data = req.body.formData;
      console.log(data);
      var loginName=req.body.loginName;
      var accountName=req.body.accountName;
      var processName=req.body.processName;
      var businessArea=req.body.businessArea;
      var processArea=req.body.processArea;
      var lob=req.body.lob;
      var type=req.body.type;
      var processDesc=req.body.processDesc;
    
    var form_id;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        retrievingformdata(callback1, db);
    });
    var callback1 = function (datas) {
        if (datas.length == 0) {
            form_id = 1001;
        } else {
            form_id = parseInt(datas[datas.length - 1].form_id) + 1;
        }
//        formdatas(data,form_id,callback2);
        if(type=="save"){
          formdatas(data,loginName,accountName,processName,lob,processDesc,businessArea,processArea,type,form_id,callback2);
        }else{
            var view={"sectionName":"View Reports","total":[]}
            data.push(view);
            automationScore(data,sendingFormtoDB)
        }
    }
     
    var callback2 = function (form_id,data) {
        form_id=form_id.toString();
        res.send(data);
    }
    var sendingFormtoDB = function (score) {
    data[data.length-1].total=score;
    formdatas(data,loginName,accountName,processName,lob,processDesc,businessArea,processArea,type,form_id,callback2);
//        res.send(data);
    }
   
});

function formdatas(data,loginName,accountName,processName,lob,processDesc,businessArea,processArea,type,form_id,callback2) {
    MongoClient.connect(url, function (err, db) {
        var callback = function (form_id,data,callback2) {
            console.log('its completed');
            callback2(form_id,data);
        }
        db.collection('formData6').insertOne({
            "loginname": loginName,
            "form_id": form_id,
            "accountName":accountName,
            "processName":processName,
            "lob":lob,
            "businessArea":businessArea,
            "processArea":processArea,
            "processDesc":processDesc,
            "type":type,
            "formData": data
        }, function (err, result) {
            assert.equal(err, null);
            callback(form_id,data,callback2);
        });
    })
}


app.post('/retrievingWorklist', function (req, res) {
    console.log("Am workist");
    var loginName=req.body.name;
    console.log(loginName);
    MongoClient.connect(url, function (err, db) {
        var callback = function (data) {
            console.log('its completed');
            res.send(data);
        }
        var retrieveresultArray = [];
        var cursor = db.collection('formData6').find({
              "loginname": loginName
        });
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                //  console.dir(doc);
                retrieveresultArray.push(doc);
            } else {
                callback(retrieveresultArray);
            }
        });
    });
});

function retrievingformdata(callback1, db) {
    console.log("retreving...");
    MongoClient.connect(url, function (err, db) {
        var callback = function (data) {
            console.log('its completed');
            callback1(data);
        }
        var retrieveresultArray = [];
        var cursor = db.collection('formData6').find({

        });
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                //  console.dir(doc);
                retrieveresultArray.push(doc);
            } else {
                callback1(retrieveresultArray);
            }
        });
    });
}

app.post('/retrievingformdata', function (req, res) {
    console.log("IT HAS BEEN retrieved");
    var form_id=req.body.form_id;
    MongoClient.connect(url, function (err, db) {
        var callback = function (data) {
            console.log('its completed');
            res.send(data);
        }
        var retrieveresultArray = [];
        var cursor = db.collection('formData6').find({
              "form_id": form_id
        });
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                //  console.dir(doc);
                retrieveresultArray.push(doc);
            } else {
                callback(retrieveresultArray);
            }
        });
    });
});

function retrievingformdata(callback1, db) {
    console.log("retreving...");
    MongoClient.connect(url, function (err, db) {
        var callback = function (data) {
            console.log('its completed');
            callback1(data);
        }
        var retrieveresultArray = [];
        var cursor = db.collection('formData6').find({

        });
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                //  console.dir(doc);
                retrieveresultArray.push(doc);
            } else {
                callback1(retrieveresultArray);
            }
        });
    });
}

app.post('/updateData', function (req, res) {
    console.log("am in update");
    var formData = req.body.formData;
    var form_id =  req.body.id;
    var type = req.body.type;
    console.log(formData);
    console.log(form_id);
    
     var callback4 = function (data) {
       
        res.send(data);
    }
    var updatingFormtoDB = function (score) {
    formData[formData.length-1].total=score;
        updateData(formData,form_id,type,callback4);        
    }
    if(type=="save"){
           updateData(formData,form_id,type,callback4);
        }else{
            if(formData[formData.length-1].sectionName!="View Reports"){
                var view={"sectionName":"View Reports","total":[]}
            formData.push(view);
             automationScore(formData,updatingFormtoDB);
            }else{
                automationScore(formData,updatingFormtoDB);
            }
            
        }
//    automationScore(formData,updatingFormtoDB)
    
     
    
    
  
});
var updateData = function (formData, form_id,type,callback4) {
    
    console.log(form_id);
   
    console.log("UPDATED FUNCTION ENTERED");
   


        MongoClient.connect(url, function (err, db) {
            db.collection('formData6').update({
                    "form_id": form_id
                }, {
                    $set: {
                         "formData": formData,
                         "type" : type
                    }
                },
                function (err, results) {
                    assert.equal(err, null);
                    db.close();

                });
        });
    
    callback4(formData);

}



////////////SCORE CALCULATION///////////////////////////////////////////////////////////////////////////////

var automationScore = function (data,callback) {
    console.log("I have Entered Automation");
    var interfeace=0;
    var interfaceArray=[1,2,3,4,5,6,7];
     var interfaceArray2=[8,9,10,11,12,13,14,15];
     var inferencesCallback=function(cSum,finalRoi,automation,callback){
            inferences(data,automation,finalRoi,cSum,callback);
     }
     var processCallback=function(finalRoi,automation,callback){
           
            processCalculation(data,inferencesCallback,finalRoi,automation,callback);
     }
    var interfaceCallback3=function(sum){
        console.log(interfeace);
        var complexitySum= (sum.sum+interfeace)*0.5;
        for(var j=0;j<data.length;j++){
            if(data[j].sectionName=="Interfacing Systems Details"){
                for(var k=0;k<data[j].questions.length;k++){
                    if(data[j].questions[k].id==16){
                            var ocr=data[j].questions[k].answer.value;
                    }
                }
            }
        }
        var automation=parseInt(complexitySum*ocr);
     
        roiScore(data,processCallback,automation,callback);
    }
    var interfaceCallback2=function(sum){
        interfeace=sum.sum*0.35;
       interfaceCalculation(data[0],interfaceCallback3,interfaceArray2);
    }
    interfaceCalculation(data[0],interfaceCallback2,interfaceArray);
    
}
function interfaceCalculation(data,callback,interfaceArray){
    console.log("am interface calculation");
    var sum={"sum":0,"roiArr":[]};
    function InterfaceCallback(id){
             if(data.sectionName=="Interfacing Systems Details" || data.sectionName=="Process Criticality"){
                for(var j=0;j<data.questions.length;j++){
                    if(id==data.questions[j].id){
                        if(data.questions[j].answer.name=="")
                        {
                            data.questions[j].answer.value=0;
                            sum.sum=sum.sum+parseInt(data.questions[j].answer.value);
                            // console.log(data.questions[j].answer.value);
                            // console.log("am in inner loop"+id);
                            undefinedQuestions.push(data.questions[j]);
                        }
                    else{
                         sum.sum=sum.sum+parseInt(data.questions[j].answer.value);
                        //   console.log(data.questions[j].answer.value);
                        //   console.log("am in inner loop else"+id);
                        }
                    }
                }
               
             }

             if(data.sectionName=="Return on Investment Analysis"){
                
                for(var j=0;j<data.questions.length;j++){
                    if(id==data.questions[j].id){
                            sum.roiArr.push(data.questions[j]);
                    }
                }
                // callback(roiCalculationArray);
            }

    }
     interfaceArray.some(InterfaceCallback);
     callback(sum);
}
function roiScore(data,processCallback,automation,callback) {
    var automation=parseInt(automation);
    var roiYearData=[];
    var i=1;
    var finalRoi=0;
    console.log(data[data.length-1].total.length);
     if(data[data.length-1].total.length==0){
          var automationSteps={
      "id":21,
      "question": "Automation scope (% of steps can be automated)",
      "values": [],
      "answer":{"name":""}
    }
        data[1].questions.push(automationSteps);
     for(var j=0;j<data[0].questions.length;j++){
            if(data[0].questions[j].id==15){
                for(var k=0;k<data[1].questions.length;k++){
                    if(data[1].questions[k].id==21){
                        data[1].questions[k].answer.name=data[0].questions[j].answer.name;
                        data[1].questions[k].answer.value=data[0].questions[j].answer.name;
                        console.log( data[1].questions[k].answer.value);
                    }
                }
            }
        }
    
    
    
     
       var botCreationCost= {
      "id":22,
      "question": "Bot creation cost per bot (Person Hours)",
        "type":"non-mandatory",
      "values": [{"name":"Simple",
                 "value":"480"},
                {"name":"Medium",
                 "value":"560"},
                {"name":"Complex",
                 "value":"800"}],
      "answer":{"name":""}
    };
        var botMaintainence={
      "id":23,
      "question": "Bot Maintenance Costs (Hours per Month)",
        "type":"mandatory",
      "values": [{"name":"Simple",
                 "value":"60"},
                {"name":"Medium",
                 "value":"75"},
                {"name":"Complex",
                 "value":"90"}],
      "answer":{"name":""}
    };
      
        data[1].questions.push(botCreationCost);
        data[1].questions.push(botMaintainence);
       
        if(automation>40){
            console.log("greater than 40");
            for(var i=0;i<data[1].questions.length;i++){
                if(data[1].questions[i].id==22){
                    data[1].questions[i].answer.name="Simple";
                    data[1].questions[i].answer.value="360";
                }
                if(data[1].questions[i].id==23){
                    data[1].questions[i].answer.name="Simple";
                    data[1].questions[i].answer.value="60";
                }
            }

        }
        else  if(automation>25 && automation<40 ){
            console.log("greater than 25");
            for(var i=0;i<data[1].questions.length;i++){
                if(data[1].questions[i].id==22){
                    data[1].questions[i].answer.name="Medium";
                    data[1].questions[i].answer.value="450";
                }
                if(data[1].questions[i].id==23){
                    data[1].questions[i].answer.name="Medium";
                    data[1].questions[i].answer.value="75";
                }
            }

        }
        else  if(automation<25 ){
            console.log("greater than 0");
            for(var i=0;i<data[1].questions.length;i++){
                if(data[1].questions[i].id==22){
                    data[1].questions[i].answer.name="Complex";
                    data[1].questions[i].answer.value="550";
                }
                if(data[1].questions[i].id==23){
                    data[1].questions[i].answer.name="Complex";
                    data[1].questions[i].answer.value="90";
                }
            }
         
        }
     }
    else if(data[data.length-1].total.length!=0){
        for(var j=0;j<data[0].questions.length;j++){
            if(data[0].questions[j].id==15){
                for(var k=0;k<data[1].questions.length;k++){
                    if(data[1].questions[k].id==21){
                        data[1].questions[k].answer.name=data[0].questions[j].answer.name;
                        data[1].questions[k].answer.value=data[0].questions[j].answer.name;
                        console.log( data[1].questions[k].answer.value);
                    }
                }
            }
        }
        
         if(automation>40){
            console.log("greater update than 40");
            for(var i=0;i<data[1].questions.length;i++){
                if(data[1].questions[i].id==22){
                    data[1].questions[i].answer.name="Simple";
                    data[1].questions[i].answer.value="360";
                }
                if(data[1].questions[i].id==23){
                    data[1].questions[i].answer.name="Simple";
                    data[1].questions[i].answer.value="60";
                }
            }

        }
        else  if(automation>25 && automation<40 ){
            console.log("greater update than 25");
            for(var i=0;i<data[1].questions.length;i++){
                if(data[1].questions[i].id==22){
                    data[1].questions[i].answer.name="Medium";
                    data[1].questions[i].answer.value="450";
                }
                if(data[1].questions[i].id==23){
                    data[1].questions[i].answer.name="Medium";
                    data[1].questions[i].answer.value="75";
                }
            }

        }
        else  if(automation<25 ){
            console.log("greater update than 0");
            for(var i=0;i<data[1].questions.length;i++){
                if(data[1].questions[i].id==22){
                    data[1].questions[i].answer.name="Complex";
                    data[1].questions[i].answer.value="550";
                }
                if(data[1].questions[i].id==23){
                    data[1].questions[i].answer.name="Complex";
                    data[1].questions[i].answer.value="90";
                }
            }
         
        }
    }
    
    console.log("roicalculation");
    
    
    
     var roiCallback=function(roiCalculationData){
//         console.log("am array of roiCalculationData");
//         console.log(roiCalculationData.roiArr[0].answer.value);
//         console.log(roiCalculationData.roiArr[1].answer.value);
//         console.log(roiCalculationData.roiArr[2].answer.value);
//         console.log(roiCalculationData.roiArr[3].answer.value);
//         console.log(roiCalculationData.roiArr[4].answer.value);
//         console.log(roiCalculationData.roiArr[5].answer.value);
//         console.log(roiCalculationData.roiArr[6].answer.value);
//         console.log(roiCalculationData.roiArr[7].answer.value);
//         console.log(roiCalculationData.roiArr[8].answer.value);
//         console.log(roiCalculationData.roiArr[9].answer.value);
         
        var costBeforeAutomation = parseInt(roiCalculationData.roiArr[0].answer.value) * 12;
    var costAfterAutomation = (parseInt(roiCalculationData.roiArr[3].answer.value) * parseInt(roiCalculationData.roiArr[6].answer.value) * 12) +
        (parseInt(costBeforeAutomation) * (100 - parseInt(roiCalculationData.roiArr[4].answer.value)) / 100);
    var effortSavings = costBeforeAutomation - costAfterAutomation;
    var yearlySavings = effortSavings * (parseInt(roiCalculationData.roiArr[7].answer.value));
    var yearInvestment = (parseInt(roiCalculationData.roiArr[5].answer.value) * parseInt(roiCalculationData.roiArr[3].answer.value) * parseInt(roiCalculationData.roiArr[7].answer.value)) 
    + (parseInt(roiCalculationData.roiArr[9].answer.value) * parseInt(roiCalculationData.roiArr[3].answer.value)) 
    + (parseInt(roiCalculationData.roiArr[8].answer.value) * parseInt(roiCalculationData.roiArr[3].answer.value));
    var remainingInvestment = yearInvestment - yearlySavings;
//     console.log("am remaining"+remainingInvestment);
//         console.log(costBeforeAutomation);
//          console.log(costAfterAutomation);
//         console.log(effortSavings);
//         console.log(yearlySavings);
//         console.log(yearInvestment);
    var year = "year1";
    var yearData = {
        "year": year,
        "costBeforeAutomation": costBeforeAutomation,
        "costAfterAutomation": costAfterAutomation,
        "effortSavings": effortSavings,
        "yearlySavings": yearlySavings,
        "yearInvestment": yearInvestment,
        "remainingInvestment": remainingInvestment
    }
    roiYearData.push(yearData);
    while(remainingInvestment>0){
            costBeforeAutomation = costBeforeAutomation * ((100 + parseInt(roiCalculationData.roiArr[2].answer.value)) / 100);
            var costAfterAutomation = (parseInt(roiCalculationData.roiArr[3].answer.value) * parseInt(roiCalculationData.roiArr[6].answer.value) * 12) +
            (parseInt(costBeforeAutomation) * (100 - parseInt(roiCalculationData.roiArr[4].answer.value)) / 100);
            var effortSavings = costBeforeAutomation - costAfterAutomation;
            var yearlySavings = effortSavings * (parseInt(roiCalculationData.roiArr[7].answer.value));
            yearInvestment = remainingInvestment + (parseInt(roiCalculationData.roiArr[8].answer.value) * parseInt(roiCalculationData.roiArr[3].answer.value));
            remainingInvestment = yearInvestment - yearlySavings;
//             console.log("am year investment"+yearInvestment);
            i++;
            year = "year" + i;
            var yearData = {
                "year": year,
                "costBeforeAutomation": costBeforeAutomation,
                "costAfterAutomation": costAfterAutomation,
                "effortSavings": effortSavings,
                "yearlySavings": yearlySavings,
                "yearInvestment": yearInvestment,
                "remainingInvestment": remainingInvestment
            }
            roiYearData.push(yearData);
        }
        fs.readFile('./dbJsons/roiScore.json', 'utf8', function (err, roiScore) {
        if (err) throw err;
        else {
            var roiIndicators = JSON.parse(roiScore);
        }
        for(var k=0;k<roiIndicators.length;k++){
            if(roiIndicators[k].roiIndicator==roiYearData.length){
                    finalRoi=roiIndicators[k].score;
//                console.log(finalRoi);
                     processCallback(finalRoi,automation,callback);
            }
        }
    });
        // console.log("am roiYearData");
        // console.log(roiYearData);
        // console.log("am i"+i);
       
    }
    var roiArray=[17,18,19,20,21,22,23,24,25,26];
    interfaceCalculation(data[1],roiCallback,roiArray);
}
function processCalculation(data,inferencesCallback,finalRoi,automation,callback){
     var processArray=[30,31,32];
     var criticalSum =function(sum){
        // for(var j=0;j<data.length;j++){
        //     if(data[j].sectionName=="Process Criticality"){
        //         for(var k=0;k<data[j].questions.length;k++){
        //             if(data[j].questions[k].id==33){
        //                     var finalValue=data[j].questions[k].answer.value;
        //             }
        //         }
        //     }
        // }
        var processCriticality= sum.sum*0.2;
        inferencesCallback(processCriticality,finalRoi,automation,callback);
     }
    interfaceCalculation(data[2],criticalSum,processArray);
}
function inferences(data,automation,finalRoi,cSum,callback){
    var totalFinalArray=[];
    var finalRoi
    totalFinalArray.push({"name":"roiScore","value":finalRoi});
    totalFinalArray.push({"name":"processCriticality","value":cSum});
    totalFinalArray.push({"name":"automation","value":automation});
    for(var j=0;j<data.length;j++){
            if(data[j].sectionName=="Process Criticality"){
                for(var k=0;k<data[j].questions.length;k++){
                    if(data[j].questions[k].id==33){
                            var finalValue=data[j].questions[k].answer.value;
                    }
                }
            }
        }
        var totalScore=automation+finalRoi+cSum+parseInt(finalValue);
         totalFinalArray.push({"name":"ProcessAminabilityScore","value":totalScore});
    fs.readFile('./dbJsons/inference.json', 'utf8', function (err, inferenceJson) {
        if (err) throw err;
        else {
            var inferenceJson = JSON.parse(inferenceJson);
            individualInference(inferenceJson,totalFinalArray);
        }
    });
    var individualInference=function(inferenceJson,totalFinalArray){
        for(var j=0;j<totalFinalArray.length;j++){
         for(var k=0;k<inferenceJson.length;k++){
                if(inferenceJson[k].inference==totalFinalArray[j].name){
                    if(totalFinalArray[j].value>inferenceJson[k].high[0].value){
                        totalFinalArray[j].inference=inferenceJson[k].high[0].name;
                    }
                    else if(inferenceJson[k].medium[0].value<totalFinalArray[j].value<inferenceJson[k].high[0].value){
                        totalFinalArray[j].inference=inferenceJson[k].medium[0].name;
                    }
                    else{
                       totalFinalArray[j].inference=inferenceJson[k].low[0].name;
                    }
                }
            }
        }
         console.log(totalFinalArray);
        callback(totalFinalArray);
    }
   
}






////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/download', function (req, res) {
    console.log("pdf download");
    var doc = new PDFDocument;
    doc.pipe(fs.createWriteStream('output.pdf'));
    doc.fontSize(15);
    doc.text('HI!');
    doc.addPage()
        .fontSize(25)
        .text('Hello', 100, 100)
    doc.end();
});
app.get('/jsontoPDF', function (req, res) {
    //    var html = fs.readFileSync('public/pages/edit.html', 'utf8');
    //    var options = { format: 'Letter' };
    //    pdf.create(html, options).toFile('./output.pdf', function(err, res) {
    //   if (err) return console.log(err);
    //   console.log(res); 
    // });
    var options = {
        format: 'Letter'
    };
    var HTML = fs.readFileSync('public/pages/edit.html', 'utf8');
    var info = {
        "Company": "ABC",
        "Team": "JsonNode",
        "Number of members": 4,
        "Time to finish": "1 day"
    }
    res.render('path to your tempalate', {
        info: info,
    }, function (err, HTML) {
        pdf.create(HTML, options).toFile('./employee.pdf', function (err, result) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
        })
    });

});
app.post('/readingEstimation', function (req, res) {
    
    
     fs.readFile('./dbJsons/Complexity.json', 'utf8', function (err, estimation) {
        if (err) throw err;
        else {
            var estimation = JSON.parse(estimation);
            res.send(estimation);
        }
    });
    
});

app.listen(port, function () {
    console.log('listening on port: ' + port);
});
