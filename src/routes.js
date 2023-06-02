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

      database.delete('tasks', id)

        return response.writeHead(204).end()
    }
  },

  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params
      const { title, description } = request.body

      database.update('tasks', id, {
        title,
        description,
      })

      database.delete('tasks', id)

        return response.writeHead(204).end()
    }
  },

  // {
  //   method: 'DELETE',
  //   path: buildRoutePath('/tasks/:id'),
  //   handler: (request, response) => {
  //     const { id } = request.params

  //     database.delete('tasks', id)

  //       return response.writeHead(204).end()
  //   }
  // },
]