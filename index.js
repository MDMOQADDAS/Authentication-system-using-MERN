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

mongoose.connect('mongodb://192.168.8.144:27017/authDemo' , {useNewUrlParser: true , })
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

//below adding middel ware for secure multiple end point
const requireLogin = (req, res , next)=>{
    if(! req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}

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
app.get('/secret' , requireLogin , (req, res)=>{
    if(!req.session.user_id)return res.redirect('/login')

    res.render("secret")
})

//just add requireLogin to the parameter, it is function we define above
//it will protect each route unless you logged in
//otherwise any body can access your other routes

app.get('/secret1' , requireLogin ,(req, res)=>{
    res.send("Hi i'm Secret 1 , to secure me unless login using middelware")
})

app.listen(3000 , ()=> console.log("Serving Your Application"))