import express from 'express';
import { __dirname } from "./utils.js"
import path from 'path';
import { engine } from 'express-handlebars';
import { viewsRouter } from './routes/views.routes.js';
import {Server} from "socket.io";

// Crear puerto
    // Para Deployar
const port = process.env.PORT || 8080;

// Crear APP
const app= express();

// Poner escuchar el SV en el puerto
// Lo guardo en una variable para definir el servidor HTTP

const httpServer = app.listen(port, () => console.log("Servidor escuchando en el puerto", port));

// MiddleWare
    // Recibir info en formato JSON de los clientes
app.use(express.json());
    // Archivos accesisble desde cualquier lado
app.use(express.static(path.join(__dirname,"/public")));

// Configuración HandleBars
    // Indicar extensión de archivos de las vistas
app.engine('.hbs', engine({extname:'hbs'}))
    // Indicar al SV cual es el motor de plantilla (hbs)
app.set('view engine', '.hbs')
    // Indicar en que carpeta están las views
app.set('views', path.join(__dirname,"/views"));

// Enlazar viewsRouter del views.routes.js
app.use("/", viewsRouter);

// Servidor HTTP arriba
// Servidor WebSocket
    // Ahora conviven en la misma app
const io = new Server(httpServer);

// Guardar el chat 
let chat = []

// Socket Sv
// Escuchar al Front
io.on("connection", (socket) => {
    // Cuando un cliente se conecte,
    // Que le muestre todo el chat
    socket.emit("chatHistory", chat);
    // msgChat es el mismo que el del cliente
    socket.on("msgChat", (data) => {
        chat.push(data);
        // Enviar el chat completo a todos los conectados
        io.emit("chatHistory", chat)
    });

    // Recibirmos mensaje de conexión de nuevo cliente
    socket.on("authenticated", (data) => {
        // El SV le mandará el mensaje a todos menos al nuevo
        socket.broadcast.emit("newUser", `El usuario ${data} se acaba de conectar`);
    });
});

