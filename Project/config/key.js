//서버를 배포했을 때와 개발할 때 각각 보안 정도가 다른 파일에서 정보를 가져옴.
if (process.env.NODE_ENV === 'production')
{
    module.exports = require('./prod.js')
}
else
{
    module.exports = require('./dev.js')
}