const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const jwtAuthMiddleware = (req, res, next) => {
    
    // first check request headers has authorization or not
    const authorization = req.headers.cookie;
    
    if(!authorization) return res.render('login'); //status(401).json({ error: 'Token Not Found' })

    // Extract the jwt token from the request headers
    // const token = req.headers.cookie.split(' ')[1].split('=')[1];;  //split(' ')[1].split('=')[1];
    const garbageCookies = authorization.split(';');   //in the raw cookies there are token as well as multiple attributes like 'ext_name' and 'ext_val' etc so we need to split them to find the token

  //  console.log(garbageCookies);

    let token = '';
    garbageCookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token') {
            token = value;
        }
    });
    

   // console.log(token);
    
    if(!token) return res.render('login'); // res.status(401).json({ error: 'Unauthorized' });

    try{
        // Verify the JWT token
        const decoded = jwt.verify(token, 'secretcode' );

        // Attach user information to the request object
        req.user = decoded
        next();
    }catch(err){
        //if the token gets expired
        console.error("error: 'Invalid token'");
        res.render('login');
        // res.status(401).json({ error: 'Invalid token' });
    }
}


// Function to generate JWT token
const generateToken = (userData) => {
    // Generate a new JWT token using user data
    return jwt.sign(userData, 'secretcode', { expiresIn: '1h' });
}

module.exports = {jwtAuthMiddleware, generateToken};