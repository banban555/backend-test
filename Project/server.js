const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/key.js')

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


var db;

mongoose.connect
(
  config.mongo_url,
  {
    useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true, useFindAndModify:true
  }
).then(() => console.log('MongoDB connect'))
 .catch(err => console.log(err))
  
  
app.listen(8080, function() 
{
  console.log('listening on 8080');
})

// MongoClient.connect('mongodb+srv://root:1234@3plus.bnxjpfd.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
//   if (에러) return console.log(에러)
//   db = client.db('serverprac');

//   app.listen(8080, function() {
//     console.log('listening on 8080');
//   })
// })

// app.post('/signup', function(요청, 응답){
//   응답.send('전송완료');
//   console.log(요청.body.FirstName);
//   console.log(요청.body.LastName);
//   console.log(요청.body.EmailAddress);
//   console.log(요청.body.Password);
//   db.collection('post').insertOne({이름: 요청.body.FirstName, 성: 요청.body.LastName, 이메일주소: 요청.body.EmailAddress, 비밀번호: 요청.body.Password},function(){
//     console.log("저장완료");
//   })
// })

const {user} = require('./models/user');
app.post('/register', (req, res) => 
  {
    //console.log(req.body)
    const userInfo = new user(req.body);
    console.log(userInfo);
    
    //정보들을 user모델에 저장
    userInfo.save((err, userInfo) => {
      if(err) return res.json({success : false, err});
      return res.status(200).json({success:true});
    });
  });

app.use(express.static(__dirname + "/react-web/build/"));

app.get("*", function (요청, 응답) {
  응답.sendFile(__dirname + "/react-web/build/index.html");
});
