/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
const fetch = require("node-fetch");
var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


/**********************
 * Example get method *
 **********************/

app.get('/api/noti', function (req, res) {

  res.json({ success: 'x', url: req.url });
});

app.get('/api/noti/*', function (req, res) {
  // Add your code here
  res.json({ success: 'get call succeed!', url: req.url });
});

/****************************
* Example post method *
****************************/

app.post('/api/noti', async function (req, res) {
  // Add your code here
  // Add your code here
  console.log(req.body.id)
  var body = {
    "operation": "add",
    "notification_key_name": "appUser",
    'notification_key': 'APA91bG94VKLkzp32pqYPdXVqHTQMLwQCL9wUw1tnZ-cdw5Sf7h2M9qI-EL3qpoo8noaJkeKY4HboEC7iILbuN0-138xGkSwMCZbOdo32iizyhRIOF8JrOA',
    "registration_ids": [req.body.id]
  }
  var x = await fetch('https://fcm.googleapis.com/fcm/notification', {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'project_id': '811672300760',
      'Authorization': 'key=AAAAvPtwbNg:APA91bH2Y65KSnu5zU-bXfZGv64nbCDQ2YNIdZQP5vUkQN2pRkb2lwu6LKn8933bU85QXLTcHhvaNJmrZVot61DYEWnD7KMROCKsmNWKrb9083cn2lIMdI0Zy2X1PyGuoKYZ49BXiq02'
    },
  }).then(res => res.json())
  console.log(x)
  res.json({ success: x, url: req.url, body: req.body })
});

app.post('/api/noti/*', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
});

/****************************
* Example post method *
****************************/

app.put('/api/noti', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

app.put('/api/noti/*', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

/****************************
* Example delete method *
****************************/

app.delete('/api/noti', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.delete('/api/noti/*', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
