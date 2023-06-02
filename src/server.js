import http from 'node:http'
import { json } from '../src/middleware/json.js'
import { extractQueryParams } from './utils/extract-query-params.js'
import { routes } from './routes.js'


// criação server 
const server = http.createServer( async(request, response) => {

    //DESESTRUTURAÇÃO PARA EXTRAÇAO DO METODO E URL DA REQUISIÇÃO
    const { method, url } = request

    //PROCESSAMENTO DO CORPO DA SOLICITAÇÃO
    await json(request, response)

                  //ROTEAMENTO DA SOLICITAÇÃO
    const route = routes.find(route => {
      return route.method === method && route.path.test(url)
    })


    // MANIPULAÇÃO DA ROTA 
    if(route) {
      const routeParams = request.url.match(route.path)

      const { query, ...params } = routeParams.groups

      // console.log(extractQueryParams(routeParams.groups.query))

      request.params = params 
      request.query = query ? extractQueryParams(query): {}

      return route.handler(request, response)
    }
    
    return response.writeHead(404).end('Not Found')
})

server.listen(3333)