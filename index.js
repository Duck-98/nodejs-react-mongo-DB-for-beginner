    const express = require('express')
    const app = express()
    const port = 4000
    const bodyParser = require('body-parser');
    const {User} = require("./models/User");
    const cookieParser = require('cookie-parser');
    const config = require('./config/key');
    const {auth} = require('./middleware/auth');
    // application / x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

// application / json type으로 갖고오기 위한 코드
app.use(bodyParser.json());
app.use(cookieParser());
const mongoose = require('mongoose');

mongoose.connect(config.mongoURI,
    { 
        useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true
    }).then(() => console.log('MongoDB connected success'))
    .catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세요')
})

app.post('/api/users/register', (req, res) => {
    // 회원 가입할때 필요한 정보를 클라이언트에 가져오면, 데이터베이스에 넣어준다.
    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json({success : false, err})
        return res.status(200).json({
            success:true
        })
    })
}) //회원가입을 위한 라우터

app.post('/api/users/login', (req,res) => {
// 요청된 이메일이 데이터베이스에 있는지 찾는다.


  User.findOne({email: req.body.email} ,(err, user) => {
      if(!user){
          return res.json({
              loginSuccess : false,
              message : '제공된 이메일에 해당하는 유저가 없습니다.'
          })
      }
// 이메일이 있다면 비밀번호가 맞는지 확인한다.
      user.comparePassword(req.body.password, (err, isMatch)=>{
          if(!isMatch) return res.json({loginSuccess : false, message: '비밀번호가 틀렸습니다.'})
// 비밀번호까지 같으면 token 생성
          user.generateToken((err, user) => {
              if(err) return res.status(400).send(err);
              // 토큰저장
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess : true, userId : user._id })          
               
          })
      })
  })
})

// role 1 어드민 role 2 특정 부서 어드민
// role 0 일반유저
app.get('/api/users/auth',auth,(req,res)=>{
    // 여기까지 미들웨어를 통과했다는 말은 authentication이 true라는 말.
    res.status(200).json({
        _id : req.user._id,
        isAdmin : req.user.role === 0? false : true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        role : req.user.role,
        image : req.user.image
    })
}) //auth 라우터

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})