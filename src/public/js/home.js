console.log("JavaScript en el Front End");

// Socket del Cliente
const socketClient = io();

// Capturar elemento
const userName = document.getElementById("userName");

// Capturar elemento del form
const inputMsg = document.getElementById("inputMsg");

// Capturar acción del click del botton
const sendMsg = document.getElementById("sendMsg");

// Capturar chatPanel y luego mostrarlos
const chatPanel = document.getElementById("chatPanel");

// Variable de ID del usuario
let user;

// Uso de SW2
Swal.fire({
    title:"Chat",
    text: "Ingrese su nombre de usuario:",
    input: "text",
    // Para validar lo que se ingresa en el input
    inputValidator: (value) => {
        return !value && 'Debes ingresar tu nombre de usuario'
    },
    // Si el usuario puede dar click fuera del modal
    allowOutsideClick: false,
    // Si el usuario apreta ESC y se salta el modal
    allowEscapeKey: false,
}).then((inputValue) => {
    user = inputValue.value;
    userName.innerHTML = user;
    // Cuando ingrese un usuario, alertar a los demás
    socketClient.emit("authenticated", user);
});

// Me envia al SV lo capturado por el Form
sendMsg.addEventListener("click", () => {
    const msg4Sv = {user: user, message: inputMsg.value};
    // Mensaje al Socket del SV
    // Este es el mensaje que envía el cliente al SV
    socketClient.emit("msgChat", msg4Sv);
    inputMsg.value = "";
});

// Recibir mensaje del SV
socketClient.on("chatHistory", (dataServer) =>{
    console.log(dataServer);
    // Replicar mensajes que llegan en el HTML
    let msgElements = "";
    dataServer.forEach((item) => {
        msgElements += `<p>Usuario: ${item.user}</p> >>>>>> ${item.message}`
    });
    // Mostrarlos en un Panel
    chatPanel.innerHTML = msgElements;
});

socketClient.on("newUser", (data) => {
    if(user){ //Si el usuario ya se autenticó
        Swal.fire({
            text: `Nuevo Usuario: ${data}`,
            toast: true,
            position: "top-right"
        });
    }
});