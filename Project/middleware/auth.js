const {user} = require('../models/user');

let auth = (req, res, next) => 
{
    //클라이언트 쿠키에서 토큰을 가져오고
    let token = req.cookies.x_auth;

    //토큰 생성시 사용했던 문자열로 토큰을 복호하면 유저 아이디가 나온다
    user.findByToken(token, (err, userInfo) => {
        if(err) throw err;
        if(!userInfo)
        {
            return res.json({isAuth : false, error : true})
        }
        
        //user와 token정보를 이후에 사용할 수 있도록 넣어줌
        req.token = token;
        req.user = userInfo;

        //미들웨어에 갇히지 않고 다음 함수로 넘어갈 수 있도록
        next();
    });
}

module.exports = { auth };