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