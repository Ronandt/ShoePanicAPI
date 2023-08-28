require("dotenv").config();
const express = require("express");
const display = require("./misc/display");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/v1/retailer/login", (req, res) => {
    if (
        loginCredentials.some(
            (cred) =>
                cred.username === req.body.username &&
                cred.password === req.body.password
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



// Route to customer login
app.post("/api/v1/customer/login", (req, res) => {
    const { username, pwd } = req.body;

    const user = customerLoginCredentials.find(cred => cred.username === username && cred.pwd === pwd);

    if (user) {
        return res.status(200).json({status: "success", message: "Login successful."});
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
        customerLoginCredentials.push({ username, pwd});
        return res.status(201).json({status:"error", message: "Registration successful."});
    }
});


app.post("/api/v1/customer/joinQueue/:id", (req, res) => {
    const queueId = parseInt(req.params.id);  
    const username = req.body.username;
    const reason = req.body.reason;

    if (isNaN(queueId) || queueId < 0 || queueId >= queues.queues.length) {
        return res.status(400).json({status: "error", message: "Invalid queue ID"});
    }

    queues.queues[queueId].people.push({"username": username, "reason": reason, "status": "Queueing"});
    
    return res.json({status: "success", message: "Joined queue successfully"});
});



app.post("/api/v1/retailer/addEvent", (req, res) => {
    if(queues.queues.findIndex(x => x.date == req.body.date) === -1) {
        queues.queues.push({ id: queues.queues.length -1, "type": "Special", people: [], waitTime: 5, date: req.body.date, stock: req.body.stock})
        return res.status(200).json({
            status: "success",
            message: "Event added",
        })
    }
    return res.status(400).json({
        status: "error",
        message: "Event already added on this date"
    })
})

app.post("/api/v1/retailer/setWaitingTime", (req, res) => {
    const queueId = req.body.id;
    const waitingTime = req.body.waitingTime;

    if (isNaN(queueId) || queueId < 0 || queueId >= queues.queues.length) {
        return res.status(400).json({ status: "error", message: "Invalid queue ID" });
    }

    queues.queues[queueId].waitTime = waitingTime;

    return res.json({ status: "success", message: "Waiting time updated successfully" });
});

app.get("/api/v1/retailer/statistics", (req, res) => {
    const mockStatistics = {
        "date": "2023-08-25",
        "statistics": {
            "10:00 AM": 15,
            "11:00 AM": 25,
            "12:00 PM": 30,
            "1:00 PM": 22,
            "2:00 PM": 18,
            "3:00 PM": 12,
            "4:00 PM": 9,
            "5:00 PM": 14,
            "6:00 PM": 20,
            "7:00 PM": 28,
            "8:00 PM": 32,
            "9:00 PM": 26,
            "10:00 PM": 18,
            "11:00 PM": 10
        },
        "longestQueueToday": {
            "time": "8:00 PM",
            "queueSize": 32
        },
        "shortestQueueToday": {
            "time": "4:00 PM",
            "queueSize": 9
        },
        "totalNumberOfPeopleToday": 380,
        "specialEvent": true
    };

    return res.json({
        status: "success",
        message: "Queue statistics retrieved successfully",
        data: mockStatistics
    });
});

app.post("/api/v1/retailer/setPhysicalQueueEligibility", (req, res) => {
    const queueId = req.body.id;
    const usernameToTransfer = req.body.username;

    if (isNaN(queueId) || queueId < 0 || queueId >= queues.queues.length) {
        return res.status(400).json({ status: "error", message: "Invalid queue ID" });
    }

    const queueToUpdate = queues.queues[queueId];
    const personToTransfer = queueToUpdate.people.find(person => person.username === usernameToTransfer);

    if (!personToTransfer) {
        return res.status(400).json({ status: "error", message: "Person not found in the queue" });
    }

    personToTransfer.status = "Physical"; // Update the status

    return res.json({ status: "success", message: "User status is now eligible for physical queue" });
});

app.get("/api/v1/retailer/retrieveQueues", (req, res) => {
   
    return res.status(200).json({
        status: "success",
        message: "Events retrieved",
        data: {
            queues: queues
        }
    })

})

app.post("/api/v1/customer/removeFromQueue", (req, res) => {
    const queueId = req.body.id;
    const usernameToLeave = req.body.username;

    if (isNaN(queueId) || queueId < 0 || queueId >= queues.queues.length) {
        return res.status(400).json({ status: "error", message: "Invalid queue ID" });
    }

    const queueToUpdate = queues.queues[queueId];
    const personIndex = queueToUpdate.people.findIndex(person => person.username === usernameToLeave);

    if (personIndex === -1) {
        return res.status(400).json({ status: "error", message: "Person not found in the queue" });
    }

    queueToUpdate.people.splice(personIndex, 1); // Remove the person from the queue

    return res.json({ status: "success", message: "Successfully left the queue" });
});

app.post("/api/v1/customer/joinPhysicalQueue", (req, res) => {
    const queueId = req.body.id;
    const usernameToRemove = req.body.username;

    if (isNaN(queueId) || queueId < 0 || queueId >= queues.queues.length) {
        return res.status(400).json({ status: "error", message: "Invalid queue ID" });
    }

    const queueToUpdate = queues.queues[queueId];
    const personIndex = queueToUpdate.people.findIndex(person => person.username === usernameToRemove);

    if (personIndex === -1) {
        return res.status(400).json({ status: "error", message: "Person not found in the queue" });
    }

    const personToRemove = queueToUpdate.people[personIndex];
    
    if (personToRemove.status !== 'Physical') {
        return res.status(400).json({ status: "error", message: "Person's is not eligible to join physical queue" });
    }

    queueToUpdate.people.splice(personIndex, 1); // Remove the person from the queue

    return res.json({
        status: "success",
        message: `${personToRemove.username} has successfully joined the physical queue`
    });
});







app.listen(port, () => {
    display(port);
});
