const UserSchema = {
    __id:{
        type:String,
        required:true
    },
    UserName:{
        type:String,
        required:true
    },
    UserEmail:{
        type:String,
        required:true,
        unique:true
    },
    UserPassword:{
        type:String,
        required:true
    },
    UserRole:{
        type:String,
        enum:['user','vendor','admin'],
        default:'user'
    },
    UserPhone:{
        type:String,
        required:true
    },
    CreatedAt:{
        type:Date,
        default:Date.now
    },
    UserProfilePic:{
        Type:String,
        default:"https://www.vecteezy.com/png/19879186-user-icon-on-transparent-background"
    }
}

export { UserSchema }