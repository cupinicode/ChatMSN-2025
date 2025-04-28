import express from 'express';
import http from 'http';
import { engine } from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io'; // Clase SERVER para crear un servidor de WebSocket

const app = express();
const server = http.createServer(app);
const io = new Server(server); // Instancia de socket.io

//Todas las solicitudes de websockets se manejan con io   (socket.io)
//y las solicitudes de http se manejan con app    (express)

// Handlebars configuration
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.static('public'));

const PORT = 8080;

// EndPoints
app.use('/', viewsRouter);

//persistencia de mensajes en memoria
const messages = [];  //Array de mensajes que se van a enviar a los clientes conectados

//websocket del lado del SERVIDOR
io.on('connection', (socket) => { //socket es un onjeto que representa la conexión entre el cliente y el servidor
  console.log('New client connected'); //io.on('connection') se ejecuta cada vez que un cliente se conecta al servidor de websockets
  //io es el servidor de websockets y socket es la conexión entre el cliente y el servidor
  socket.emit('welcome', { greeting: 'Welcome to the WebSocket server!' }); //Enviamos un mensaje al cliente que se acaba de conectar
  //Hora le vamos a enviar SOLO a ese cliente, el listado de mensajes que ya tenemos en memoria
  //Para eso usamos SOCKET en lugar de IO
  socket.emit('message history', messages); //Enviamos el ARRAY de mensajes al cliente que se acaba de conectar

  socket.on('new message', (dataMessage) => { //Escuchamos el evento 'message' que se emite desde el cliente
    //Cuando el servidor recibe el evento 'message' desde el cliente, ejecuta la función callback
    messages.push(dataMessage); //Agregamos el mensaje a la lista de mensajes
    //ocket.emit('response', 'Message received!'); //Enviamos una respuesta al cliente que envió el mensaje sólamente
    //socket.broadcast.emit('message', dataMessage); //Enviamos el mensaje a todos los clientes conectados, excepto al que lo envió
    io.emit('Broadcast new message', dataMessage); //Enviamos el  mensaje a todos los clientes conectados, incluyendo al que lo envió
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});




// la variable server sólo la usamos para iniciar el servidor y para decierle que acepte solicitudes websocket
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});