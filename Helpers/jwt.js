const { expressjwt: jwt } = require('express-jwt');
//jwt.io
function authJwt() {
    const secret = process.env.secret;
    const api = process.env.Api_URL;
    return jwt({
        secret,
        algorithms:['HS256']
    }).unless({
        path: [
            //  {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    });
}
async function isRevoked(req, payload, done) {
    console.log(payload.isAdmin);
    if(!payload.isAdmin) {
        done(null, true)
    }

    done();
}

module.exports=authJwt;