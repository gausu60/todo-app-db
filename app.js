const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const app = express();
var items = [];
const PORT = 5000;
app.set("view engine","ejs")
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = {
    name: String
};
const Item = new mongoose.model("Item",itemsSchema);
const item1 = new Item({
    name: "Welcome to ToDo List App."
});
const item2 = new Item({
    name: "Hit the + button to aff a new item."
});
const item3 = new Item({
    name: "Happy Coding!"
});
const defaulItems = [item1,item2,item3];
// Item.insertMany(defaulItems,(err)=>{
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Successfully Saved Default items to DB");
//     }
// })



app.get("/", (req, res) => {
    var today = new Date();
    var option = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = today.toLocaleDateString("en-US",option);
    Item.find({},(err,items)=>{
        res.render("list",{kindOfDay:day,newListItem:items})
    })
    
});
app.post("/",(req,res)=>{
    const itemName = req.body.newItem;
    const item = new Item({
        name: itemName,
    });

    item.save();
    res.redirect("/");
})
app.post("/delete",(req,res)=>{
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId,(err)=>{
        if (!err) {
            console.log("Successfully Deleted Item!")
            res.redirect('/')   
        }
    })
})

app.listen(PORT, () => console.log("Server running on port " + PORT));