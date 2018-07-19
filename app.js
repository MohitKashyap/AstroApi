const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connection = require('./db');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// app.get("/formpost/:query", (req, res) => {
//     console.log(req.params.query);
//     res.status(200).send("Hello");
// });
app.get("/getUserQuery/:id", function (req, res) {
    connection
        .query(`select * from UserQuery where Id=${req.params.id}`, function (err, result) {
            if (err)
                throw err;
            res.send(JSON.stringify(result));
        });
});
app.post("/addQuery", (req, res) => {
    //console.log(req);
    connection.query(`insert into UserQuery (Subject, Description, CreatedOnUtc,CreatedBy,UpdatedOnUtc,UpdatedBy) 
    VALUES('${req.body.subject}', '${req.body.description}', '${req.body.createdOnUtc}', '${req.body.createdBy}', '${req.body.updatedOnUtc}', '${req.body.updatedBy}')`, function (err, query) {
            if (err) {
                console.log(err.sqlMessage);
                if (err.sqlMessage.includes("Duplicate")) {
                    return res
                        .status(500)
                        .send({ status: "Email or Phone No already exists" });
                }
                return res
                    .status(500)
                    .send("There was a problem registering the user");
            } else {
                console.log(query);
                var token = jwt.sign({
                    id: query.insertId
                }, secret, { expiresIn: 86400 });
            }
            res
                .status(200)
                .send({ auth: true, token: token });
        });
    res.status(200).send(req.body);
});

app.listen(process.env.PORT || 4043, () => {
    console.log("Server is listening on port 4043");
});