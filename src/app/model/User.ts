import mongoose, {Schema, Document} from "mongoose"

export interface Message extends Document {
    content: string;
    CreatedAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({ 
    content:{
        type: String,
        required: true
        },
        CreatedAt: {
            type: Date,
            required: true,
            default: Date.now
        }

    
}) 

export interface User extends Document {
    userName: String;
    email: String;
    password: String;
    VerifyCode: String;
     VerifyCodeExpery: Date;
     isVarified: boolean;
     isAcceptingMessage: boolean;
     messages: Message[]
}







const UserSchema: Schema<User> = new Schema({ 
    userName :{
        type: String,
        required: [true,"Username is required"],
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: [true,"Email is required"],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],

    },
    password:{
        type: String,
        required: [true,"Password is required"],
        trim: true
        },
        VerifyCode:{
            type: String,
            required: [true,"VerifyCode is required"],
            
            },
            VerifyCodeExpery:{
                type: Date,
                required: [true,"VerifyCodeExpery is required"],
                default: Date.now
                },
                isVarified:{
                    type: Boolean,
                    default: false,
                },
                isAcceptingMessage:{
                    type: Boolean,
                    default: true,
                },
                messages:{
                    type: [MessageSchema],
                    default: []
                },
    
}) 

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel;