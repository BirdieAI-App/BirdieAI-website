export const redirectFrontend = (path, req, res) => {
    // Set CORS headers for the redirect response
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Redirect to the frontend's /chat route
    console.log(`Redirecting to ${path}`);
    return res.redirect(path)
}