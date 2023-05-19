const jwt = require("jsonwebtoken");

const jwtToken = process.env.JWT_TOKEN;
// const jwtToken = 'eyJzdWIiOiI1NmEyZDk3MWQwZDg2OThhMTYwYTBkM2QiLCJleHAiOjE0NTYxOTEyNzQsImlhdCI6MTQ1NTMyNzI3NH0';

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['authorization'] || req.headers["x-access-token"];
    console.log('token', token);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, jwtToken, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;