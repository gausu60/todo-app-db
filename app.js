const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const _ = require('lodash')
const app = express();
var items = [];
const PORT = process.env.PORT || 5000;
app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb+srv://gausu-admin:Gausu123@cluster0.eykn3.mongodb.net/todolistDB");
const itemsSchema = {
    name: String
};
const Item = new mongoose.model("Item", itemsSchema);
const item1 = new Item({
    name: "Welcome to ToDo List App."
});
const item2 = new Item({
    name: "Hit the + button to aff a new item."
});
const item3 = new Item({
    name: "Happy Coding!"
});
const defaulItems = [item1, item2, item3];
const listSchema = {
    name: String,
    items: [itemsSchema]
};
const List = new mongoose.model("list",listSchema);

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
    var day = today.toLocaleDateString("en-US", option);
    Item.find({}, (err, items) => {
        res.render("list", { kindOfDay: day, newListItem: items })
    })

});
app.post("/", (req, res) => {
    var today = new Date();
    var option = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = today.toLocaleDateString("en-US", option);
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemName,
    });
    if (listName === day) {
        item.save();
        res.redirect("/");
        
    } else {
        List.findOne({name:listName},(err,foundList)=>{
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        })
    }

    
})
app.get("/:customListName",(req,res)=>{
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name:customListName},(err,foundList)=>{
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaulItems
                });
                list.save();
                
            } else {
                res.render("list",{ kindOfDay: foundList.name, newListItem: foundList.items });
                
            }  
        } 
    })
    
})
app.post("/delete", (req, res) => {
    var today = new Date();
    var option = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = today.toLocaleDateString("en-US", option);
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === day) {
        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (!err) {
                console.log("Successfully Deleted Item!")
                res.redirect('/')
            }
        })

    } else {
        List.findOneAndUpdate({name: listName},{$pull:{items:{_id: checkedItemId}}},(err,foundList)=>{
            if (!err) {
                res.redirect("/"+listName);
            }
        })
        
    }
    
})

app.listen(PORT, () => console.log("Server running on port " + PORT));