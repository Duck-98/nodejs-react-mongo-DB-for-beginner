const express = require('express')
const app = express()
const port = 4000
const bodyParser = require('body-parser');
const {User} = require("./models/User");
const config = require('./config/key');
// application / x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application / json type으로 갖고오기 위한 코드
app.use(bodyParser.json());

const mongoose = require('mongoose');

mongoose.connect(config.mongoURI,
    { 
        useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true
    }).then(() => console.log('MongoDB connected success'))
    .catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세요')
})

app.post('/register', (req, res) => {
    // 회원 가입할때 필요한 정보를 클라이언트에 가져오면, 데이터베이스에 넣어준다.
    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json({success : false, err})
        return res.status(200).json({
            success:true
        })
    })
}) //회원가입을 위한 라우터

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})