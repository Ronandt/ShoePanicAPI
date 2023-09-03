require("dotenv").config();
const express = require("express");
const display = require("./misc/display");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let loginCredentials = [
    {username: "Retailer1", pwd: "P@55w0rd"},
    {username: "Retailer2", pwd: "P@55w0rd"}
]

// Sample login credentials
let customerLoginCredentials = [
    { username: "Shopper1", pwd: "P@55w0rd" },
    { username: "Shopper2", pwd: "P@55w0rd" }
    // ... Add more credentials here
];

const queueWaitTime = 5; // in minutes
const customerQueue = [];
const stock = 30

app.post("/api/v1/retailer/login", (req, res) => {
    console.log(req.body.username + "Username")
    console.log(req.body.password + "pwd")
    if (
        loginCredentials.some(
            (cred) =>
                cred.username === req.body.username &&
                cred.pwd === req.body.password
        )
    ) {
        return res.status(200).json({
            status: "success",
            message: "User successfully logged in",
            data: {
                authenticatedUser: {
                    username: req.body.username,
                    password: req.body.password,
                },
            },
        });
    } else {
        return res.status(401).json({
            status: "error",
            message: "No such user found",
        });
    }
});
// Route to change password
app.post("/api/v1/retailer/changePassword", (req, res) => {
    const { username, newPassword } = req.body;

    // Find the user in loginCredentials array
    const userIndex = loginCredentials.findIndex(
        (cred) => cred.username === username
    );

    if (userIndex !== -1 && newPassword !== "") {
        loginCredentials[userIndex].pwd = newPassword;
        return res.status(200).json({
            status: "success",
            message: "Password changed successfully",
        });
    } else {
        return res.status(404).json({
            status: "error",
            message: "Username not found or empty password",
        });
    }
});

// Route to reset password
app.post("/api/v1/retailer/resetPassword/:username", (req, res) => {
    const { username } = req.params;

    // Find the user in loginCredentials array
    const userIndex = loginCredentials.findIndex(
        (cred) => cred.username === username
    );

    if (userIndex !== -1) {
        loginCredentials[userIndex].pwd = "P@55w0rd"; // Reset password
        return res.status(200).json({
            status: "success",
            message: "Password reset successfully.",
        });
    } else {
        return res.status(404).json({
            status: "error",
            message: "Username cannot be found for reset.",
        });
    }
});


app.post("/api/v1/retailer/createEvent", (req, res) => {
    const { eventName } = req.body;
    if (!specialEvents[eventName]) {
        specialEvents[eventName] = [];
        return res.status(201).json({
            status: "success",
            message: `Special event "${eventName}" created successfully.`
        });
    } else {
        return res.status(400).json({
            status: "error",
            message: `Special event "${eventName}" already exists.`
        });
    }
});

// Route to customer login
app.post("/api/v1/customer/login", (req, res) => {
    const { username, password} = req.body;
    console.log(req.body)
    console.log(username)
    console.log(password)
    console.log(customerLoginCredentials[0].pwd == req.body.password)
    console.log(customerLoginCredentials[0].username == req.body.username)
    console.log(customerLoginCredentials[0].username )
    console.log(customerLoginCredentials[0].pwd)
    const user =customerLoginCredentials.find(cred => cred.username == req.body.username && cred.pwd == req.body.password);
   console.log(user)
    if (user) {
        return res.status(200).json({status: "success", message: "Login successful.", 
        data: {
            authenticatedUser: {
                username: req.body.username,
                password: req.body.password,
            },
        },});
    } else {
        return res.status(401).json({status: "error", message: "Invalid username or password."});
    }
});

// Route to customer registration
app.post("/api/v1/customer/register", (req, res) => {
    const { username, pwd } = req.body;
    if (customerLoginCredentials.find(cred => cred.username === username)) {
        return res.status(400).json({status: "error", message: "Username is already registered."});
    } else {
        customerLoginCredentials.push({ username, pwd });
        return res.status(201).json({status:"error", message: "Registration successful."});
    }
});


app.post("/api/v1/customer/joinQueue", (req, res) => {
    const { username, purpose } = req.body;

    const user = customerLoginCredentials.find(cred => cred.username === username);

    if (user) {
        customerQueue.push({ username, purpose, joinedAt: new Date() });

        const estimatedWaitTime = queueWaitTime * customerQueue.length;

        return res.status(200).json({
            status: "success",
            message: "Joined the queue successfully.",
            data: {
                estimatedWaitTime: estimatedWaitTime,
                acceptedPurpose: purpose
            }
        });
    } 
    
    else if (mainQueue.length >= stock) {
        return res.status(400).json({
            status: "error",
            message: "Shop is full. Please come back later.",
        });
     
    }
    else {
        return res.status(401).json({
            status: "error",
            message: "Invalid credentials.",
        });
    }
});

app.get("/api/v1/customer/queueStatus", (req, res) => {
    const currentQueueLength = customerQueue.length;

    const estimatedTimeToJoin = queueWaitTime * currentQueueLength;

    res.status(200).json({
        status: "success",
        message: "Queue status retrieved successfully.",
        data: {
            queueLength: currentQueueLength,
            estimatedTimeToJoin: estimatedTimeToJoin
        }
    });
});



app.post("/api/v1/customer/leaveQueue", (req, res) => {
    const { username } = req.body;

    const indexToRemove = customerQueue.findIndex(customer => customer.username === username);

    if (indexToRemove !== -1) {
        customerQueue.splice(indexToRemove, 1);

        res.status(200).json({
            status: "success",
            message: "Removed from the queue successfully."
        });
    } else {
        res.status(404).json({
            status: "error",
            message: "User not found in the queue.",
        });
    }
});


app.listen(port, () => {
    display(port);
});
