const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient

app.use(express.urlencoded({ extended: true }));

var db;
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.2jx3ncv.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
  if (에러) return console.log(에러)
  db = client.db('serverprac');

  app.listen(8080, function() {
    console.log('listening on 8080');
  })
})




app.post('/signup', function(요청, 응답){
  응답.send('전송완료');
  console.log(요청.body.FirstName);
  console.log(요청.body.LastName);
  console.log(요청.body.EmailAddress);
  console.log(요청.body.Password);
  db.collection('post').insertOne({이름: 요청.body.FirstName, 성: 요청.body.LastName, 이메일주소: 요청.body.EmailAddress, 비밀번호: 요청.body.Password},function(){
    console.log("저장완료");
  })
})

app.use(express.static(__dirname + "/react-web/build/"));

app.get("*", function (요청, 응답) {
  응답.sendFile(__dirname + "/react-web/build/index.html");
});
