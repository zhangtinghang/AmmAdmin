const mongoose = require("mongoose");
var Schema = mongoose.Schema;
//用户表
const userSchema = new Schema({
    username: {
        type: String,
        index: 1
    },
    number: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    operator: {
        type: Schema.Types.ObjectId,
        ref: 'userObj'
    },
    avatar: {
        type: String,
        default: ''
    },
    token: {
        type: String,
        default: ''
    },
    roles: {
        type: Array,
        default: 'normal'
    },
    status:{
        type:Number,
        default:0
    },
    type:{
        type:Number,
        default:0
    },
    tag: {

    }
}, {
    versionKey: false, //去掉版本锁 __v0
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    } //自动管理修改时间

})

// 游客表
const touristSchema = new Schema({
    username: {
        type: String,
        index: 1,
        default:'游客'
    },
    number: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    intro: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    token: {
        type: String,
        default: ''
    },
    roles: {
        type: Array,
        default: ['tourist']
    },
    status:{
        type:Number,
        default:0
    },
    type:{
        type:Number,
        default:0
    },
    tag: {

    }
}, {
    versionKey: false, //去掉版本锁 __v0
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    } //自动管理修改时间

})

//博客记录表
const blogSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'userObj',
        required: true,
        index: true
    },
    title: {
        type: String,
        index: 1,
        required: true
    },
    intro: {
        type: String,
        default: ''
    },
    category:{
        type: Number,
        default: 0
    },
    blog: {
        type: String,
        default:''
    },
    status:{
        type:Number,
        default:0
    },
    isOpen:{
        type:Boolean,
        default:false
    },
    tag: {

    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    } //自动管理修改时间
})

//作品记录表
const portfolioSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'userObj',
        required: true,
        index: true
    },
    title: {
        type: String,
        index: 1,
        required: true
    },
    intro: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        default: ''
    },
    category:{
        type: Number,
        default: 0
    },
    team_name: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    links: {
        name:{
            type:String,
            default:''
        },
        url:{
            type:String,
            default:''
        }
    },
    technology: {
        type: String,
        default:''
    },
    testimonial: {
        name:{
            type:String,
            default:''
        },
        url:{
            type:String,
            default:''
        }
    },
    status:{
        type:Number,
        default:0
    },
    isOpen:{
        type:Boolean,
        default:false
    },
    tag:{
        type: Array,
        default: []
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    } //自动管理修改时间
})
//公告信息
const noticeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'userObj',
        required: true,
        index: true
    },
    title: {
        type: String,
        index: 1,
        required: true
    },
    intro: {
        type: String,
        default:''
    },
    content: {
        type: String,
        default: ''
    },
    startTime:{
        type:Date,
        default:''
    },
    endTime:{
        type:Date,
        default:''
    },
    links: {
        name:{
            type:String,
            default:''
        },
        url:{
            type:String,
            default:''
        }
    },
    status:{
        type:Number,
        default:0
    },
    isOpen:{
        type:Boolean,
        default:0
    },
    category:{
        type: Number,
        default: 0
    },
    tag:{
        type: Array,
        default: []
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    } //自动管理修改时间
})

//下载信息
const downloadSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'userObj',
        required: true,
        index: true
    },
    title: {
        type: String,
        index: 1,
        required: true
    },
    intro: {
        type: String,
        default:''
    },
    content: {
        type: String,
        default: ''
    },
    links: {
        name:{
            type:String,
            default:''
        },
        url:{
            type:String,
            default:''
        }
    },
    startTime:{
        type:Date,
        default:''
    },
    endTime:{
        type:Date,
        default:''
    },
    status:{
        type:Number,
        default:0
    },
    isOpen:{
        type:Boolean,
        default:0
    },
    category:{
        type: Number,
        default: 0
    },
    tag:{
        type: Array,
        default: []
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    } //自动管理修改时间
})

userSchema.statics.findAndModify = function (query, sort, doc, options, callback){
    return this.collection.findAndModify(query, sort, doc, options, callback);
}

const userObj = mongoose.model('userObj', userSchema);
const blogObj = mongoose.model('blogObj', blogSchema);
const portfolioObj = mongoose.model('portfolioObj', portfolioSchema);
const noticeObj = mongoose.model('noticeObj',noticeSchema);
const downloadObj = mongoose.model('downloadObj', downloadSchema);
const touristObj = mongoose.model('touristObj',touristSchema);
module.exports = {
    userObj,
    blogObj,
    portfolioObj,
    noticeObj,
    downloadObj,
    touristObj
}