// Admin middleware
const adminMiddleware = (req, res, next) => {
    // Check if the user is an admin
    if (req.user && req.user.role === 'admin') {
        // Admin logic here
        next(); // Proceed to the next middleware or route handler
    } else {
        // If not an admin, handle unauthorized access
        res.status(401).send('Unauthorized');
    }
};

// User middleware
const userMiddleware = (req, res, next) => {
    // Check if the user is authenticated
    if (req.user) {
        // User logic here
        next(); // Proceed to the next middleware or route handler
    } else {
        // If not authenticated, handle unauthorized access
        res.status(401).send('Unauthorized');
    }
};