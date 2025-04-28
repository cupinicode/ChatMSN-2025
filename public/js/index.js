// Websocket del lado del CLIENTE
const socket = io(); // Conexión al servidor de WebSocket
// iniciamos la conexión desde el cliente
// socket es una instancia de la clase Socket que representa la conexión entre el cliente y el servidor de websockets

const main = () => {
    //ocket.emit('new message', { message: 'Saludos desde el cliente'}); // Emitimos un evento. Enviamos el mensaje al servidor de WebSocket
    socket.on('welcome', (data) => { // Escuchamos el evento 'welcome' que se emite desde el servidor
        console.log(data); // Imprimimos el mensaje de bienvenida en la consola
    });



    // Formulario

    const formChat = document.getElementById('formChat'); // Obtenemos el formulario por su id
    const inputUsername = document.getElementById('inputUsername'); // Obtenemos el input por su id
    const inputChat = document.getElementById('inputChat'); // Obtenemos el input por su id
    formChat.addEventListener('submit', (event) => { // Agregamos un evento al formulario
        event.preventDefault(); // Prevenimos el comportamiento por defecto del formulario (recargar la página)
        const username = inputUsername.value; // Obtenemos el valor del input del formulario
        const message = inputChat.value; // Obtenemos el valor del input del formulario
        if (!message) return; // Si el input está vacío, no hacemos nada
        // Enviamos el mensaje al servidor de WebSocket
        socket.emit('new message', { message, username }); // Emitimos el evento 'message' al servidor de WebSocket, con el texto leido del formulario
        inputChat.value = ''; // Limpiamos el input del formulario
        inputChat.focus(); // Enfocamos el input del formulario
    });


    // Escuchamos el evento 'Broadcast new message' que se emite desde el servidor
    socket.on('Broadcast new message', (dataMessage) => { // Escuchamos el evento 'message' que se emite desde el servidor
        const chatBox = document.getElementById('chatBox'); // Obtenemos el elemento por su id desde el DOM
        chatBox.innerHTML += `<p>${dataMessage.username} - ${dataMessage.message}</p>`; 
        //const messageElement = document.createElement('div'); // Creamos un nuevo elemento div
        //messageElement.innerHTML = `<strong>${dataMessage.userName}</strong>: ${dataMessage.message}`; // Agregamos el mensaje al nuevo elemento div
        //chatBox.appendChild(messageElement); // Agregamos el nuevo elemento div al chatBox
    });

    socket.on('message history', (messages) => { // Escuchamos el evento 'message history' que se emite desde el servidor
        const chatBox = document.getElementById('chatBox'); // Obtenemos el elemento por su id desde el DOM
        messages.forEach((message) => { // Iteramos sobre el array de mensajes
            chatBox.innerHTML += `<p>${message.username} - ${message.message}</p>`; // Agregamos el mensaje al chatBox
        });
    });
};

main(); // Llamamos a la función main para iniciar la aplicación