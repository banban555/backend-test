const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key.js');
const {user} = require('./models/user');
const Lecture = require('./models/lecture');
const { auth } = require('./middleware/auth.js');
const { send } = require('process');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

//mongoose로 DB연결
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
  console.log('로그인 함수 실행');
  //요청한 이메일이 데이터베이스 있는지 확인
  user.findOne({ studentNum : req.body.studentNum }, (err, userInfo) => 
  {
    if(!userInfo){
      return res.json({
        loginSuccess: false,
        message: '학번을 확인해주세요'
      })
    } 
    //요청한 이메일이 db에 있다면 비밀번호도 똑같은지 확인
    userInfo.comparePassword(req.body.password, (err, isMatched) => {
      if(!isMatched) return res.json({loginSuccess: false, message: '비밀번호를 확인해주세요'})

      userInfo.generateToken((err, userInfo) => {
        if(err) return res.status(400).send(err); 

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
    email: req.user.email,
    name : req.user.name,
    studentNum: req.user.studentNum
  })
});

//react 파일 불러오기
app.use(express.static(__dirname + "/react-web/build/"));

//serach API
app.get('/application/search', async (req, res) => {
  const { major = '', keyword = '' } = req.query;
  const result = await Lecture.findLectures(major, keyword);
  try {
    const lectures = await Lecture.findLectures(major, keyword);
    res.status(200).json(lectures)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//강의 신청하는 서버 코드
app.post('/application/add', (req, res) => {
  console.log('사용자가 신청한 강의는: ')
  console.log(req.body);
  res.status(200).send('Successfully added application');
});

app.delete('/application/delete', (req, res) => {
  console.log('사용자가 삭제한 강의는: ')
  console.log(req.body);
  res.status(200).send('Successfully added application');
});


app.get("*", function (요청, 응답) {
  응답.sendFile(__dirname + "/react-web/build/index.html");
});