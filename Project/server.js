const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
app.use(express.urlencoded({ extended: true }));

//========== 윤형님 코드 ===========
// var db;
// MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.2jx3ncv.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
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


//======================= 추가로 작성한 부분 =====================
//코드 돌리기 전에 아래 항목들을 install해주세요!
//npm install jsonwebtoken --save
//npm install body-parser --save
//npm install cookie-parser --save
//npm install bcrypt --save
//npm install mongoose@5.11.15

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key.js');
const {user} = require('./models/user');
const { auth } = require('./middleware/auth.js')
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

//mongoose로 DB연결
//각자 생성하신 local db에 연결하고 싶으신 경우에는 config > dev.js 파일에서 mongodb url을 수정해주시면 됩니다. 
//기존 url은 주석처리 부탁드려요!
mongoose.connect
(
  config.mongo_url,
  {
    useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true, useFindAndModify:true
  }
).then(() => console.log('MongoDB connect'))
 .catch(err => console.log(err))
  
//port연결 및 server 오픈
app.listen(8080, function() 
{
  console.log('listening on 8080');
})

//회원가입 API
app.post('/signup', (req, res) => 
{
  //signup으로 들어온 정보들을 userInfo에 저장
  const userInfo = new user(req.body);
  
  //userInfo가 잘들어왔는지 확인
  console.log(userInfo);
  
  //들어온 userInfo를 mongoDB에 저장
  userInfo.save((err, userInfo) => {
    if(err) return res.json({success : false, err});
    return res.status(200).json({success:true});
  });
});


//로그인 API
app.post('/signin', (req, res) => {
  //요청한 이메일이 데이터베이스 있는지 확인
  user.findOne({ email : req.body.email }, (err, userInfo) => 
  {
    if(!userInfo){
      return res.json({
        loginSuccess: false,
        message: '이메일을 확인해주세요'
      })
    }
    console.log('이메일 확인 성공!');

    //요청한 이메일이 db에 있다면 비밀번호도 똑같은지 확인
    userInfo.comparePassword(req.body.password, (err, isMatched) => {
      if(!isMatched) return res.json({loginSuccess: false, message: '비밀번호를 확인해주세요'})
      console.log('비밀번호 확인 성공');

      userInfo.generateToken((err, userInfo) => {
        if(err) return res.status(400).send(err); 
        console.log('로그인 완료!')
        //토큰을 쿠키에 저장함. 여러가지 방식으로 저장이 가능하지만, 쿠키에 저장할 것임
        res.cookie('x_auth', userInfo.token)
        .status(200).send({success : true, userId : userInfo._id})
      });
    });  
  });
});

//사용자 인증 API 이후 다양한 페이지에서 사용예정임.
app.post('/auth', auth, (req, res) => {
  // auth 함수 실행을 통과한 이후 실행될 코드
  // auth를 통과했다는 얘기는 authentication이 true라는 말
  res.status(200).json({
    _id : req.user._id,
    isAuth : true,
    eamil: req.user.eamail,
    firstName : req.user.firstName,
    lastName: req.user.lastName
  })
});

//react 파일 불러오기
app.use(express.static(__dirname + "/react-web/build/"));

app.get("*", function (요청, 응답) {
  응답.sendFile(__dirname + "/react-web/build/index.html");
});
