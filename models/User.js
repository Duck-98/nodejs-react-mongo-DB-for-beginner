const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

userSchema.pre("save",function(next){
    var user = this;
    if(user.isModified('password')){ //모델의 비밀번호가 변환 될때만 암호화 함수가 실행되게 설정.
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err) // 에러가 나면 next함수 바로 실행.
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err)
            user.password = hash
            next()
        })
    })
  }
}); // 유저모델의 정보를 저장하기 전에 함수실행을 위한 코드

const User = mongoose.model('User',userSchema);

module.exports = {User}