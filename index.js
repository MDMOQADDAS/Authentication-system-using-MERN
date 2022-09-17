const express = require('express')
const { default: mongoose } = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/user')
const session = require('express-session')


app = express()

app.set("view engine" , "ejs")
app.set("views" , "views")

app.use(express.urlencoded({extended: true}))
app.use(session({ secret: "notgoodsecrete" }))

mongoose.connect('mongodb://192.168.43.171:27017/authDemo' , {useNewUrlParser: true , })
.then(()=>{
    console.log("Mongo Connection Open")
})
.catch(err=>{
    console.log("Oh No mongoo connection error")
    console.log(err)
})

app.get('/register' , (req, res)=>{
    res.render("register")
})

app.get('/' , (req ,res)=>{
    res.send("This is Home Page")
})

app.post('/register' , async (req, res)=>{
    //here we can use bcrypt and can store in the database

    const {password, username} = req.body;
    const hash = await bcrypt.hash(password , 12)

    const user = new User({
        username,
        password: hash
    })
    await user.save()
    req.session.user_id = user._id;
    res.redirect('/')
})


app.get('/login' , (req, res)=>{
    res.render("login")
})
app.post('/login' , async (req, res)=>{
    const {username , password} = req.body;

    const user = await User.findOne({username})

    const validPassword =  await bcrypt.compare(password , user.password)
    if(validPassword){
        req.session.user_id = user._id;

        res.redirect('/secret')
    } else{
        res.redirect('/login')
    }
})

app.post('/logout' ,(req ,res)=>{
   // req.session.user_id = null;
    req.session.destroy(); //to destory the entire session
    res.redirect("/login")
})
app.get('/secret' , (req, res)=>{
    if(!req.session.user_id)return res.redirect('/login')

    res.render("secret")
})

app.listen(3000 , ()=> console.log("Serving Your Application"))