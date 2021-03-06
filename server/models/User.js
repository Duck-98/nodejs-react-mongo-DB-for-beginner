const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50,
    },
    email : {
        type:String,
        trim : true,
        unique : 1
    },
    password: {
        type : String,
        minlength : 5
    },
    lastname : {
        type :String,
        maxlength : 50
    },
    role : {
        type:Number,
        default:0
    },
    image : String,
    token :{//유효성검사
        type:String
    },
    tokenExp: {
        type:Number
    }
})

userSchema.pre("save", function(next){
    var user = this;
    if(user.isModified('password')) { //모델의 비밀번호가 변환 될때만 암호화 함수가 실행되게 설정.
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err) // 에러가 나면 next함수 바로 실행.

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err)
            user.password = hash
            next()
        })
    })
  } else {
      next()
  }
}); // 유저모델의 정보를 저장하기 전에 함수실행을 위한 코드

userSchema.methods.comparePassword = function(plainPassword, cb){
    // 플레인 패스워드와 암호화 비밀번호를 비교해야함.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){ // 플레인 패스워드를 bcrypt를 이용하여 암호화 한 후 비교를 하고 콜백함수를 이용한다.
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    //jsonwebtoken을 이용하여 토큰을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null, user)
    })
}
// 가져온 토큰 복호화 과정
userSchema.statics.findByToken = function(token, cb){
    var user = this;
    // 토큰 decode
    jwt.verify(token, 'secretToken', function(err,decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인.
        user.findOne({"_id": decoded, "token" : token}, function(err,user){

        if(err) return cb(err);
        cb(null, user)
        })
    });
}

const User = mongoose.model('User',userSchema);

module.exports = {User}