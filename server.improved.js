const http = require('http'),
  fs = require('fs'),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require('mime'),
  dir = 'public/',
  port = 3000

let appData = []

const server = http.createServer(function (request, response) {
  if (request.method === 'GET') {
    handleGet(request, response)
  } else if (request.method === 'POST') {
    handlePost(request, response)
  }
})

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1)

  if (request.url === '/') {
    sendFile(response, 'public/index.html')
  } else {
    sendFile(response, filename)
  }
}

const handlePost = function (request, response) {
  
  let dataString = ''
  
  request.on('data', function (data) {
    dataString += data
  })

  if (request.url === '/submit') {

    request.on('end', function () {
      const formData = JSON.parse(dataString)
      let year = formData.year
      let d = new Date()
      let age = d.getFullYear() - year
      formData.age = String(age);

      appData.push(formData)

      console.log("json: " + JSON.stringify(formData))

      response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
      response.end(JSON.stringify(formData))
    })
  }

  else if(request.url === '/remove') {
    request.on('end', function() {
      const newArr = appData.filter(car => car.plateNum != dataString.slice(1,-1))
      appData = newArr
      
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end(dataString)
    })
  }
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename)

  fs.readFile(filename, function (err, content) {

    // if the error = null, then we've loaded the file successfully
    if (err === null) {

      // status code: https://httpstatuses.com
      response.writeHeader(200, { 'Content-Type': type })
      response.end(content)

    } else {

      // file not found, error code 404
      response.writeHeader(404)
      response.end('404 Error: File Not Found')

    }
  })
}

server.listen(process.env.PORT || port)
