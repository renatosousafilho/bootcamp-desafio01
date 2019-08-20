const express = require('express')

const server = express()
server.use(express.json())

var requests = 0
const projects = []

server.use((req, res, next) => {
    requests += 1
    console.log(`Requisições realizadas: ${requests}`)
    next()
})

function checkProjectExists(req, res, next) {
    const { id } = req.params
    const project = projects.find(p => p.id === id)
    if (!project) {
        return res.status(400).json({error: 'Project not found'})
    }

    req.project = project
    next()
}

server.get("/projects", (req, res) => {
    res.json(projects)
})

server.post('/projects', (req, res) => {
    const { id, title } = req.body
    projects.push({id, title, tasks: []})
    return res.json(projects)
})

server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { title } = req.body
    
    const { project } = req

    project.title = title
    res.json(project)
})

server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const index = projects.findIndex(p => p.id == req.project.id)
    projects.splice(index, 1)
    res.status(200).send() 
})

server.put('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { title } = req.body
    const { project } = req
    project.tasks.push(title)
    res.json(project)
})

server.listen(3000)