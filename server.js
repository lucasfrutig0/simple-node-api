const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();

// Allow express work with json data format
app.use(express.json());

//Global Middleware to count requests
app.use((req, res, next) => {
  console.count("Número de requisições");
  return next();
});

// Initial data
let projects = [];

function countRequests(req, res, next) {
  let count = 0;

  next();

  count = count + 1;

  console.log(count);
}

// Middleware to check Project ID exists
function checkProjectID(req, res, next) {
  const { id } = req.params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  return next();
}

// Initial route
app.get("/", (req, res) => {
  return res.json({ message: "Hello dear =)" });
});

// Get all projects
app.get("/projects", (req, res) => {
  return res.json(projects);
});

// Create a project
app.post("/projects", (req, res) => {
  const { title, tasks } = req.body;

  projects.push({
    id: uuidv4(),
    title,
    tasks,
  });

  return res.json(projects);
});

// Create a task in project
app.post("/projects/:id/tasks", checkProjectID, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  const findProjectIndex = projects.findIndex((p) => p.id === id);

  projects[findProjectIndex].tasks.push(task);

  return res.json(projects[findProjectIndex]);
});

// Update a project
app.put("/projects/:id", checkProjectID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  if (!id) {
    return res.status(404).json({ error: "ID is required" });
  }

  const findProject = projects.filter((project) => project.id === id);
  findProject[0] ? (findProject[0].title = title) : "";

  return res.json(projects);
});

// Delete a project
app.delete("/projects/:id", checkProjectID, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex((p) => p.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

app.listen(3000);
