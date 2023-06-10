const mongoose = require("mongoose");
const Lecture = require("./lecture");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  studentNum: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
  },
  major: {
    type: String,
  },
  grade: {
    type: String,
  },
  token: {
    type: String,
  },
  token_exp: {
    type: Number,
  },
});

//비밀번호 암호와 function
userSchema.pre("save", function (next) {
  var user = this;

  //유저가 비밀번호를 새로 만들거나 변경하면
  if (user.isModified("password")) {
    //hash생성을 위한 salt를 먼저 만들고
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      //hash를 이용하여 사용자가 입력한 비밀번호를 암호화하여 다시 저장한다.
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else next();
});

userSchema.methods.comparePassword = function (plainPassword, callBack) {
  //plainpassword를 암호화하여 db에 있는 암호화된 비밀번호와 똑같은지 확인
  bcrypt.compare(plainPassword, this.password, function (err, isMatched) {
    if (err) return callBack(err);
    callBack(null, isMatched);
  });
};

userSchema.methods.generateToken = function (callBack) {
  //json webtoken을 이용해서 token을 생성하기
  var user = this;
  //user._id와 secretToken을 결합하여 토큰생성
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;

  user.save(function (err, userInfo) {
    if (err) return callBack(err);
    //에러가 없다면 에러자리는 null이고 userInfo반환
    callBack(null, userInfo);
  });
};

userSchema.statics.findByToken = function (token, callBack) {
  var user = this;

  //토큰을 복호화한다.
  jwt.verify(token, "secretToken", function (err, decode) {
    //유저아이디를 이용해서 해당 user가 db에 있고, 클라이언트에서 받아온 토큰과 일치하는 토큰을 갖고 있는지 확인
    user.findOne({ _id: decode, token: token }, function (err, userInfo) {
      if (err) return callBack(err);
      callBack(null, userInfo);
    });
    //클라이언트에서 가져온 토큰과 데이터베이스에 있는 토큰이 일치하는지 확인
  });
};

userSchema.add({
  lectureId: [{ type: mongoose.Schema.Types.ObjectId, ref: "lecture" }],
});

const user = mongoose.model("user", userSchema, "user");

module.exports = { user, Lecture };
