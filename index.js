require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const jwt = require('jsonwebtoken');
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  category: { type: String, enum: ["To-Do", "In Progress", "Done"], required: true },
  createDate: { type: Date, default: Date.now },
  deadline: { type: Date, required: true },
  priorityLevel: { type: String, enum: ["High", "Medium", "Low"], required: true },
  name: { type: String, required: true },
  userEmail: { type: String, required: true },
})
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  photoUrl: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
})
const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  userEmail: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})

// connection 
const Activity = mongoose.model("Activity", activitySchema)
const Task = mongoose.model("Task", taskSchema)
const Users = mongoose.model("Users", userSchema)

//set jwt 
app.post("/jwt", (req, res) => {
  const user = req.body 
  const token = jwt.sign(user, process.env.PRIVATE_KEY, {
     expiresIn: '7d'
  })
  res.send({token})
})

// Verify token
const verifyToken = (req, res, next) => {
  if(!req.headers.authorization){
    return res.status(401).send({message: "Unauthorize Access..."})
  }
  const token = req.headers.authorization.split(" ")[1]
  jwt.verify(token, process.env.PRIVATE_KEY, (err, decode) => {
    if(err){
      return res.status(401).send({message: "Unauthorize Access..."})
    }
    req.decode = decode
    next()
  })
}

// Create a new user
app.post("/users", async (req, res) => {
  const {userInfo} = req.body
  const user = new Users({
    name: userInfo.name,
    email: userInfo.email,
    photoUrl: userInfo.photoUrl,
    createAt: userInfo.createAt,
  })

  try {
    const isExist = await Users.findOne({ email: user.email });
    if(isExist) {
      return res.send({message: "User alreay exit is database", insertedId: null})
    } 
    const newUser = await user.save()
    res.status(201).json({ message: "User created successfully", user: newUser })

  } catch (error) {
    res.status(400).json({ message: "Failed to creating user" })
  }
})

// Get all tasks
app.get("/tasks/:email", verifyToken, async (req, res) => {
  const email = req.params.email
  const search = req.query.search ? String(req.query.search).trim() : "";
  const query = {   
    title: {
        $regex: search,
        $options: "i",
    },
    userEmail: email
  }
  try {
    const tasks = await Task.find(query)
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create a new task
app.post("/tasks", verifyToken, async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    deadline: req.body.deadline,
    priorityLevel: req.body.priorityLevel,
    name: req.body.name,
    userEmail: req.body.userEmail,
  })
  console.log(task)
  try {
    const newTask = await task.save()

    await new Activity({
      title: `New task '${req.body.title}' was added to ${req.body.category}`,
      userEmail: req.body.userEmail,
    }).save()

    res.status(201).json({task: newTask, insertedCount: 1 })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update a task
app.put("/tasks/:id", verifyToken, async (req, res) => {
  const {userEmail, title} = req.body
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        deadline: req.body.deadline,
        priorityLevel: req.body.priorityLevel,
      },
      { new: true },
    )

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" })
    }

    await new Activity({
      title: `Task '${title}' was updated`,
      userEmail,
    }).save()

    return res.json(updatedTask)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})

// Delete a task
app.delete("/tasks/:id", verifyToken, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id)

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" })
    }
    await new Activity({
      title: `Task '${deletedTask.title}' was deleted`,
      userEmail: deletedTask.userEmail,
    }).save()

    res.json({ message: "Task deleted successfully", deletedCount: 1 })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// Get activities
app.get("/activities/:email", verifyToken, async (req, res) => {
  const email = req.params.email
  try {
    const activities = await Activity.find({userEmail: email}).sort("-timestamp").limit(50)
    res.json(activities)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// Root End point 
app.get("/", (req, res) => {
  res.send("Server is ready for deliver API's")
})

// app listen 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
