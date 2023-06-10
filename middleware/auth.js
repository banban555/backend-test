const { user } = require("../models/user");

let auth = (req, res, next) => {
  let token = req.body.token;

  //토큰 생성시 사용했던 문자열로 토큰을 복호하면 유저 아이디가 나온다
  user.findByToken(token, (err, userInfo) => {
    if (err) throw err;
    if (!userInfo) {
      return res.json({ isAuth: false, error: true });
    }
    //user와 token정보를 이후에 사용할 수 있도록 넣어줌
    req.token = token;
    req.user = userInfo;
    next();
  });
};

module.exports = { auth };
