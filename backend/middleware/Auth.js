const jwt = require("jsonwebtoken");

const jwtToken = process.env.JWT_TOKEN;
// const jwtToken = 'eyJzdWIiOiI1NmEyZDk3MWQwZDg2OThhMTYwYTBkM2QiLCJleHAiOjE0NTYxOTEyNzQsImlhdCI6MTQ1NTMyNzI3NH0';

// const verifyToken = (req, res, next) => {
//     const token = req.body.token || req.query.token || req.headers["x-access-token"];
//     console.log(token);

//     if (!token) {
//         return res.status(403).send("A token is required for authentication");
//     }
//     try {
//         console.log('ddddddddddddd', jwt.verify(token, jwtToken));
//         const decoded = jwt.verify(token, jwtToken);
//         req.user = decoded;
//     } catch (err) {
//         return res.status(401).send("Invalid Token");
//     }
//     return next();
// };

// module.exports = verifyToken;

const verifyJWT = (req, res, next) => {
    // const token = req.headers['authorization'];
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    console.log('token', token);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, jwtToken, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyJWT;