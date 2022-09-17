const mongoos = require('mongoose')

const userSchema = new mongoos.Schema(
    {
        username: {
            type: String,
            required: [true, "UserName cannot be optional"]
        },

        password: {
            type: String,
            required: [true ,"Password can't be blank"]
        }
    }
)

module.exports =  mongoos.model("User" , userSchema)

