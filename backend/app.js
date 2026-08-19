require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();

// middleware  call

app.use(cors());

// this url is taken in mongodb and right click then copy string code

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB Connected Sucessfully");
    })
    .catch((err) => {
        console.log(err);
    });


// -------------To create a schema for collection--------------//
const todoListSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
});


// -----------------create a collectiom--------------

const todoListModel = mongoose.model('todoList', todoListSchema);

app.use(express.json());

//----------------Creating Todo List--------------//

app.post("/addList", async (req, res) => {
    const { title, description } = req.body;


    try {
        const todoData = new todoListModel({ title, description });
        await todoData.save();
        res.status(201).json(todoData); /*----------Sucess message status------------*/
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });/*----------Error  message status------------*/

    }


});
//--------------------Read Todo List------------------//

app.get("/showList", async (req, res) => {

    try {
        const overallTodoList = await todoListModel.find()
        res.json(overallTodoList);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }



});

//---------------------Update Todo List------------------//

app.put("/updateList/:abc", async (req, res) => {
    const { title, description } = req.body;
    const id = req.params.abc;
    try {
        const updateTodo = await todoListModel.findByIdAndUpdate(id, {
            title, description
        }, { new: true });
        if (!updateTodo) {
            return res.status(404).json({ message: "Todo is not found" })
        }
        res.json(updateTodo);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//----------------------Delete to-do list----------------------------//
app.delete("/deleteList/:bcd", async (req, res) => {

    let id = req.params.bcd;
    try {
        const deleteTodo = await todoListModel.findByIdAndDelete(id);
        if (!deleteTodo) {
            return res.status(404).json({
                message: "Todo is not found"
            })
        }

        res.status(200).json({
            message: "Todo Deleted Successfully"
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }


});


const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`Server Is Running On ${port} Port Number`);
});

