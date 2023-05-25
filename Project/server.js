const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key.js");
const { user } = require("./models/user");
const Lecture = require("./models/lecture");
const { auth } = require("./middleware/auth.js");
const { send } = require("process");

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// mongoose로 DB연결
mongoose
  .connect(config.mongo_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Port 연결 및 server 오픈
app.listen(3000, function () {
  console.log("listening on 8080");
});

app.post("/signup", (req, res) => {
  const userInfo = new user(req.body);

  // 회원가입 시 유저의 컬렉션 생성
  const collectionName = "user_" + userInfo._id; // 회원의 고유 ID를 사용하여 컬렉션 이름 생성

  // MongoDB에 컬렉션 생성
  const userCollection = mongoose.connection.db.collection(collectionName);

  userCollection.createIndex({ lectureId: 1 }, { unique: true }, (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, err });
    }

    // userInfo 저장
    userInfo.save((err, userInfo) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, err });
      }

      return res.status(200).json({ success: true });
    });
  });
});

/// 로그인 API
app.post("/signin", async (req, res) => {
  try {
    const userInfo = await user.findOne({ studentNum: req.body.studentNum });

    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: "학번을 확인해주세요",
      });
    }

    // 요청한 이메일이 db에 있다면 비밀번호도 똑같은지 확인
    userInfo.comparePassword(req.body.password, (err, isMatched) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ loginSuccess: false, message: "Internal server error" });
      }

      if (!isMatched) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호를 확인해주세요",
        });
      }

      // 토큰 생성
      userInfo.generateToken((err, userInfoWithToken) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ loginSuccess: false, message: "Internal server error" });
        }

        // 토큰을 쿠키에 저장
        res.cookie("x_auth", userInfoWithToken.token).status(200).json({
          loginSuccess: true,
          userId: userInfoWithToken._id,
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// 사용자 인증 API 이후 다양한 페이지에서 사용예정임.
app.post("/auth", auth, (req, res) => {
  // auth 함수 실행을 통과한 이후 실행될 코드
  // auth를 통과했다는 얘기는 authentication이 true라는 말
  res.status(200).json({
    _id: req.user._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    studentNum: req.user.studentNum,
  });
});

// react 파일 불러오기
app.use(express.static(__dirname + "/react-web/build/"));

// search API
app.get("/application/search", auth, async (req, res) => {
  const { major = "", keyword = "" } = req.query;
  try {
    const lectures = await Lecture.findLectures(major, keyword);
    res.status(200).json(lectures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 강의 신청하는 서버 코드
// app.post("/application/add", auth, async (req, res) => {
//   try {
//     console.log("사용자가 신청한 강의는: ");
//     console.log(req.body);

//     const { userId, lectureId } = req.body;
//     const userCollectionName = "user_" + userId;
//     const userCollection =
//       mongoose.connection.db.collection(userCollectionName);

//     // 유저의 개인 콜렉션에 강의 추가
//     const result = await userCollection.updateOne(
//       { _id: mongoose.Types.ObjectId(userId) },
//       { $push: { lectureId: lectureId } }
//     );

//     if (result.modifiedCount === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "강의 추가에 실패했습니다." });
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "강의 추가에 성공했습니다." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// });
app.post("/application/add", async (req, res) => {
  console.log("사용자가 신청한 강의는: ");
  console.log(req.body);
});

app.delete("/application/delete", auth, async (req, res) => {
  try {
    console.log("사용자가 삭제한 강의는: ");
    console.log(req.body);

    const { userId, lectureId } = req.body;
    const userCollectionName = "user_" + userId;
    const userCollection =
      mongoose.connection.db.collection(userCollectionName);

    // 유저의 개인 콜렉션에서 강의 삭제
    const result = await userCollection.updateOne(
      { _id: mongoose.Types.ObjectId(userId) },
      { $pull: { lectureId: lectureId } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(400)
        .json({ success: false, message: "강의 삭제에 실패했습니다." });
    }

    res
      .status(200)
      .json({ success: true, message: "강의 삭제에 성공했습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.get("*", function (req, res) {
  res.sendFile(__dirname + "/react-web/build/index.html");
});
