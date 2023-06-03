import http from 'node:http'
import { json } from '../src/middleware/json.js'
import { extractQueryParams } from './utils/extract-query-params.js'
import { routes } from './routes.js'


// Create a server
const server = http.createServer( async(request, response) => {

    // destructuring and extraction of URL and method from the request
    const { method, url } = request

    //Process the request body
    await json(request, response)

                  //Routing of the request
    const route = routes.find(route => {
      return route.method === method && route.path.test(url)
    })


    // Maniputaltion of the route
    if(route) {
      const routeParams = request.url.match(route.path)

      const { query, ...params } = routeParams.groups

      request.params = params 
      request.query = query ? extractQueryParams(query): {}

      return route.handler(request, response)
    }
    
    return response.writeHead(404).end('Not Found')
})

server.listen(3333)