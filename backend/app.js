require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const todoListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
  },
  { timestamps: true }
);

const todoListModel = mongoose.model("todoList", todoListSchema);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Todo API is running" });
});

app.post("/addList", async (req, res) => {
  const { title, description } = req.body;

  if (!title?.trim() || !description?.trim()) {
    return res.status(400).json({
      message: "Title and description are required",
    });
  }

  try {
    const todoData = await todoListModel.create({
      title: title.trim(),
      description: description.trim(),
    });

    res.status(201).json(todoData);
  } catch (error) {
    console.error("Create todo error:", error);
    res.status(500).json({ message: "Failed to create todo" });
  }
});

app.get("/showList", async (req, res) => {
  try {
    const overallTodoList = await todoListModel.find().sort({ createdAt: -1 });
    res.json(overallTodoList);
  } catch (error) {
    console.error("Fetch todo error:", error);
    res.status(500).json({ message: "Failed to fetch todo list" });
  }
});

app.put("/updateList/:id", async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid todo ID" });
  }

  if (!title?.trim() || !description?.trim()) {
    return res.status(400).json({
      message: "Title and description are required",
    });
  }

  try {
    const updateTodo = await todoListModel.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateTodo) {
      return res.status(404).json({ message: "Todo is not found" });
    }

    res.json(updateTodo);
  } catch (error) {
    console.error("Update todo error:", error);
    res.status(500).json({ message: "Failed to update todo" });
  }
});

app.delete("/deleteList/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid todo ID" });
  }

  try {
    const deleteTodo = await todoListModel.findByIdAndDelete(id);

    if (!deleteTodo) {
      return res.status(404).json({ message: "Todo is not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Delete todo error:", error);
    res.status(500).json({ message: "Failed to delete todo" });
  }
});

const port = process.env.PORT || 3030;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected successfully");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });
