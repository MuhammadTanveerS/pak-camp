const { default: mongoose } = require("mongoose");

mongoose.connect('mongodb://localhost:27017/farmStand')
.then(()=>{
    console.log("CONNECTION STARTED")
}).catch(err =>{
    console.log("OOPS ERROR!!")
    console.log(err)
})
