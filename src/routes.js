import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from 'node:crypto'


const database = new Database()

export const routes = [
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