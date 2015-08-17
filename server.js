var fs=require('fs');
var http = require('http');
var path = require('path');
var express=require('express');
var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');

var app=express();


app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

var users={
    alice: "password1",
    bob: "password2",
    charlie: "password3",
    dan: "password4"
};

var states;
fs.readFile("states.json", function(err, data) {
    states = JSON.parse(data.toString());
});

var msgs=[
    {user:"kilroy", phone: "123 555 1212", message:"was here!"}
];

app.use(express.static(__dirname+'/public'));

function sendUnauthorized(response) {
    response.status(401);
    response.send("Unauthorized");
}

app.post('/login', function(request, response) {
    var user = request.body.username;
    console.log(user);
    if (users[user] === undefined) {
        return sendUnauthorized(response);
    }
    if (users[user] !== request.body.password) {
        return sendUnauthorized(response);
    }
    response.cookie('login', user);
    response.json({result: true});
});

app.get('/states',function(request, response) {
    var sort = request.query.sort;
    var result = states;
    if (sort) {
        result.sort(propSort(sort));
    }
    var offset = request.query.offset;
    if (offset === undefined) {
        offset=0;
    } else {
        offset = +offset;
    }
    var limit = request.query.limit;
    if (limit === undefined) {
        limit = 10;
    } else {
        limit = +limit;
    }
    if (limit > 10) {
        limit = 10;
    }
    result = result.slice(offset, offset+limit);
    response.json(result);
});
app.get('/states/:abbrev', function(request, response) {
    var abbrev = request.params.abbrev;

    for (var ind=0; ind<states.length; ind++) {
        if (states[ind].abbreviation == abbrev) {
            response.json(states[ind])
        }
    }
    response.status(404);
    response.send("Not Found");
});

app.post('/write', function(request, response) {
    var user = request.cookies.login;
    if (users[user] === undefined) {
        return sendUnauthorized(response);
    }
    var msg = request.body.message;
    var phone = request.body.phone;
    if (msg === undefined || phone === undefined) {
        response.status(400);
        response.send("Bad request");
        return;
    }
    msgs.push({user:user, phone:phone, message: msg});
    response.json(msgs);
});

app.get('/logout', function(request, response) {
    response.clearCookie('login');
    response.json({result: true});
});
http.createServer(app).listen(8888, function() {
    console.log("We have started our server at http://localhost:8888");
});