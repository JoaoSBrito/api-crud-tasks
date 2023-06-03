import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from 'node:crypto'

// Creating Database instance
const database = new Database()


// Creating route array
export const routes = [

  // Search method for show the tasks list
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      
      const { search } = request.query

      const tasks = database.select('tasks', {
        title: search,
        description: search,
      })

      return response.end(JSON.stringify((tasks)))
    }
  },

  // Post method for post a specific task
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      if (!request.body || Object.keys(request.body).length === 0) {
        return response.writeHead(400).end(JSON.stringify('Empty request body'))
      }
      const { title, description } = request.body

      const task = {
        id: randomUUID(),
        title,
        description, 
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert('tasks', task)
        return response.writeHead(201).end()
    }
  },

  // Delete method for delete a specific task using the ID 
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params

      if(database.delete('tasks',id )) {
        return response.writeHead(204).end()
      } else {
        return response.writeHead(404).end(JSON.stringify('ID not found'))
      }
    }
  },

  // Put method for update a specific task using the ID
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      if (!request.body || Object.keys(request.body).length === 0) {
        return response.writeHead(400).end(JSON.stringify('Empty request body'))
      }
      const { id } = request.params
      const { title, description } = request.body

      if (database.update('tasks', id, { title, description, updated_at: new Date()})) {
        return response.writeHead(204).end()
      } else {
        return response.writeHead(404).end(JSON.stringify('ID not found'))
      }
    }
  },

  // Patch method for update a specific item from a specific task using the ID
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params

      if(database.update('tasks', id ,{completed_at: new Date()})) {
        return response.writeHead(204).end()
      } else {
        return response.writeHead(404).end(JSON.stringify('ID not found'))
      }
        
    }
  },
]