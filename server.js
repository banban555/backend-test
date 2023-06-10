const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key.js");
const { user, Lecture } = require("./models/user"); // Lecture 모델 추가
const { auth } = require("./middleware/auth.js");
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// mongoose로 DB연결
mongoose
  .connect(config.mongo_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Port 연결 및 server 오픈
app.listen(8080, function () {
  console.log("listening on 8080");
});

app.get("/application/count", auth, async (req, res) => {
  try {
    const userToken = req.query.token;
    const userInfo = await new Promise((resolve, reject) => {
      user.findByToken(userToken, (err, userInfo) => {
        if (err) {
          reject(err);
        } else {
          resolve(userInfo);
        }
      });
    });

    const userId = userInfo._id;

    const userCollectionName = "user_" + userId;
    const userCollection =
      mongoose.connection.db.collection(userCollectionName);

    // 유저 고유의 컬렉션 내의 학점 정보 count를 받아오는 변수를 선언한다.
    const userData = await userCollection.findOne({
      _id: mongoose.Types.ObjectId(userId),
    });
    let count = userData.count;
    res.status(200).json({
      count: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.post("/signup", async (req, res) => {
  const userInfo = new user(req.body);

  const { studentNum } = req.body;

  // 입력한 학번의 유저가 이미 존재하는지 확인
  const existingUser = await user.findOne().or([{ studentNum: studentNum }]);

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "이미 가입된 학번입니다.",
    });
  }

  // 회원가입 시 유저의 컬렉션 생성
  const collectionName = "user_" + userInfo._id; // 회원의 고유 ID를 사용하여 컬렉션 이름 생성

  // 유저 콜렉션에 대한 스키마 정의
  const userCollectionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lectureIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }], // 여러 강의 ID를 저장하기 위해 배열로 변경
    count: { type: Number, default: 24 }, // count 변수 추가
  });

  // UserCollection 모델 생성
  const UserCollection = mongoose.model(
    collectionName,
    userCollectionSchema,
    collectionName
  );

  // userInfo 저장
  userInfo.save((err, userInfo) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, err });
    }

    // MongoDB에 컬렉션 생성
    mongoose.connection.db.createCollection(collectionName, (err) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, err });
      }
      // 새로 만든 컬렉션에 문서 삽입
      const userCollection = mongoose.connection.db.collection(collectionName);
      userCollection.insertOne(
        {
          _id: mongoose.Types.ObjectId(userInfo._id),
          lectureIds: [],
          count: 24, // count 변수 추가 및 기본값 설정
        },
        (err) => {
          if (err) {
            console.log(err);
            return res.json({ success: false, err });
          }
          return res.status(200).json({ success: true });
        }
      );
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

        // 토큰을 쿠키에 저장하고, 유효기간을 30분으로 설정
        res
          .cookie("x_auth", userInfoWithToken.token, {
            maxAge: 1800000,
            sameSite: "None",
            secure: true,
          })
          .status(200)
          .json({
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

app.get("/application/userInfo", auth, function (req, res) {
  // 쿠키에 저장된 토큰 가져오기
  let token = req.cookies.x_auth;

  // 토큰을 디코드하여 유저 정보 가져오기
  user.findByToken(token, (err, userInfo) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }

    if (!userInfo) {
      return res.json({ isAuth: false, error: true });
    }
    return res.status(200).json({ success: true, data: userInfo });
  });
});

// 클라이언트에서 '/application/seclectedCourse'에 대한 GET 요청 처리
app.get("/application/seclectedCourse", auth, async (req, res) => {
  try {
    const userToken = req.query.token;

    // 토큰을 이용하여 유저 정보 가져오기
    const userInfo = await new Promise((resolve, reject) => {
      user.findByToken(userToken, (err, userInfo) => {
        if (err) {
          reject(err);
        } else {
          resolve(userInfo);
        }
      });
    });

    const userId = userInfo._id;

    const userCollectionName = "user_" + userId;
    const userCollection =
      mongoose.connection.db.collection(userCollectionName);

    // 유저의 컬렉션에서 해당 사용자의 강의 정보 조회
    const userCourseInfo = await userCollection.findOne({
      _id: mongoose.Types.ObjectId(userId),
    });

    // 강의 ID들을 배열로 받아옴
    const lectureIds = userCourseInfo.lectureIds;

    // 각각의 강의 정보를 가져오는 비동기 함수들의 배열 생성
    const getLectureInfoPromises = lectureIds.map((lectureId) =>
      Lecture.findById(lectureId)
    );

    // Promise.all을 이용하여 모든 강의 정보를 한 번에 가져옴
    const lectureInfos = await Promise.all(getLectureInfoPromises);

    // 모든 강의 정보를 반환
    res.status(200).json(lectureInfos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.put("/mypage/userInfo", auth, async (req, res) => {
  try {
    const { name, studentNum, email, password, major, grade } = req.body;
    const userToken = req.cookies.x_auth;

    const userInfo = await user.findOneAndUpdate(
      { token: userToken },
      {
        $set: {
          name: name,
          studentNum: studentNum,
          email: email,
          password: password,
          major: major,
          grade: grade,
        },
      },
      { new: true }
    );

    if (!userInfo) {
      return res.status(400).json({
        success: false,
        message: "해당 사용자를 찾을 수 없습니다.",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "회원정보 수정에 성공했습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.post("/application/add", auth, async (req, res) => {
  try {
    const selectLectureId = req.body.lectureId;
    const userToken = req.body.userToken;

    const userInfo = await new Promise((resolve, reject) => {
      user.findByToken(userToken, (err, userInfo) => {
        if (err) {
          reject(err);
        } else {
          resolve(userInfo);
        }
      });
    });

    const userId = userInfo._id;

    const userCollectionName = "user_" + userId;
    const userCollection =
      mongoose.connection.db.collection(userCollectionName);

    // 중복 체크
    const existingLecture = await userCollection.findOne({
      _id: mongoose.Types.ObjectId(userId),
      lectureIds: selectLectureId,
    });

    if (existingLecture) {
      return res
        .status(401)
        .json({ success: false, message: "이미 추가된 강의입니다." });
    }

    // 유저 고유의 컬렉션 내의 학점 정보 count를 받아오는 변수를 선언한다.
    const userData = await userCollection.findOne({
      _id: mongoose.Types.ObjectId(userId),
    });
    let count = userData.count;

    // 신청한 강의의 lectureID를 기반으로 lecture 컬렉션에서 해당 강의의 학점을 받아온다.
    const lecture = await Lecture.findById(selectLectureId);
    const credit = lecture.학점;

    // 신청한 강의의 학점만큼 count 변수에서 차감하여 유저 고유의 컬렉션을 저장한다.
    count -= credit;

    if (count < 0) {
      count = 0;
      return res.status(402).json({
        success: false,
        message: "더 이상 강의를 추가할 수 없습니다.",
        count: count,
      });
    }

    const result = await userCollection.updateOne(
      { _id: mongoose.Types.ObjectId(userId) },
      { $push: { lectureIds: selectLectureId }, $set: { count: count } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(400)
        .json({ success: false, message: "강의 추가에 실패했습니다." });
    }
    res.status(200).json({
      success: true,
      message: "강의 추가에 성공했습니다.",
      count: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.delete("/application/delete", auth, async (req, res) => {
  try {
    const selectLectureId = req.body.lectureId;
    const userToken = req.body.userToken;

    const userInfo = await new Promise((resolve, reject) => {
      user.findByToken(userToken, (err, userInfo) => {
        if (err) {
          reject(err);
        } else {
          resolve(userInfo);
        }
      });
    });

    const userId = userInfo._id;

    const userCollectionName = "user_" + userId;
    const userCollection =
      mongoose.connection.db.collection(userCollectionName);

    // 유저 고유의 컬렉션 내의 학점 정보 count를 받아오는 변수를 선언한다.
    const userData = await userCollection.findOne({
      _id: mongoose.Types.ObjectId(userId),
    });
    let count = userData.count;

    // 신청한 강의의 lectureID를 기반으로 lecture 컬렉션에서 해당 강의의 학점을 받아온다.
    const lecture = await Lecture.findById(selectLectureId);
    const credit = lecture.학점;

    // 신청한 강의의 학점만큼 count 변수에서 차감하여 유저 고유의 컬렉션을 저장한다.
    count += credit;

    if (count > 24) {
      count = 24;
    }

    const result = await userCollection.updateOne(
      { _id: mongoose.Types.ObjectId(userId) },
      { $pull: { lectureIds: selectLectureId }, $set: { count: count } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(400)
        .json({ success: false, message: "강의 삭제에 실패했습니다." });
    }

    res.status(200).json({
      success: true,
      message: "강의 삭제에 성공했습니다.",
      count: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.get("*", function (req, res) {
  res.sendFile(__dirname + "/react-web/build/index.html");
});
