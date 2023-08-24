require('dotenv').config()
const express = require('express')
const display = require("./misc/display")
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.post("/api/v1/retailer/login", (req, res) => {
    if(loginCredentials.some(cred => cred.username === req.body.username && cred.password === req.body.password)) {
      
        res.status(200).json({
            message: "User successfully logged in",
            authenticatedUser: {
                username: req.body.username,
                password: req.body.password
            }
        })
    } else {
        return res.status(401).json({
            message: "No such user found"
        })
    }
})
// Route to change password
app.post('/api/v1/retailer/changePassword', (req, res) => {
    const { username, newPassword } = req.body;

    // Find the user in loginCredentials array
    const userIndex = loginCredentials.findIndex(cred => cred.username === username);

    if (userIndex !== -1 && newPassword !== "") {
        loginCredentials[userIndex].pwd = newPassword;
        res.status(200).json({message: "Password changed successfully"});
    } else {
        res.status(404).json({message: "Username not found or empty password"});
    }
});

// Route to reset password
app.post('/api/v1/retailer/resetPassword/:username', (req, res) => {
    const { username } = req.params;

    // Find the user in loginCredentials array
    const userIndex = loginCredentials.findIndex(cred => cred.username === username);

    if (userIndex !== -1) {
        loginCredentials[userIndex].pwd = "P@55w0rd"; // Reset password
        res.status(200).json({message: "Password reset successfully."});
    } else {
        res.status(404).json({message: "Invalid username."});
    }
});


app.listen(port, () => {
    display(port)
});