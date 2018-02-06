exports.Topdf = function (req, res) {
console.log("ENTERED INTO TO TOPDF");
 var info = {
 "Company": "ABC",
 "Team": "JsonNode",
 "Number of members": 4,
"Time to finish": "1 day"
}
res.render('path to your tempalate', {
    info: info,
}, function (err, HTML) {
    pdf.create(HTML, options).toFile('./downloads/employee.pdf', function (err, result) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
    })
  })
 }