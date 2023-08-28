let loginCredentials = [
    {username: "Retailer1", pwd: "P@55w0rd"},
    {username: "Retailer2", pwd: "P@55w0rd"}
]

// Sample login credentials
//Unqueued, Queued, Physical
let customerLoginCredentials = [
    { username: "Shopper1", pwd: "P@55w0rd"},
    { username: "Shopper2", pwd: "P@55w0rd"}
    // ... Add more credentials here
];

let statistics = {
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
}

let queues = {
    queues: [
        {id: 0, "type": "Main", people: [], date: null, waitTime: 5}
    ]
}


const stock = 30