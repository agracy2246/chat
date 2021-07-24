window.onload = () => {
    var socket = io();

    var form = document.getElementById('form');
    var input = document.getElementById('input');
    var nickname = document.getElementById('nickname');

    // Target the nickname input box
    nickname.focus();


    // User clicks the send button, check for a message and username
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value && nickname.value) {
            // Create a new message item and append it to the chat container
            // We do this locally because the server will not propagate our own message to us
            addChatMessage(nickname.value + ': ' + input.value, 'message');
            updateScroll('message-container');
            
            // Send our message to the server
            socket.emit('chat message', {"user": nickname.value, "message":input.value});
            input.value = '';
            input.focus();
        }
    });

    nickname.addEventListener('keypress', (event) => {
        if (event.key == 'Enter' && document.getElementById('nickname').value) {
            nickname.disabled = true;
            input.focus();
        }
    });
    nickname.addEventListener("focusout", () => {
        if (nickname.value && nickname.value !== "") {
            nickname.disabled = true;
        }
    });
    
    input.addEventListener('keypress', () => {
        
    });

    socket.on('connect-message', () => {
        addChatMessage(null, 'connect');
        updateScroll('message-container');                    
    });
    
    socket.on('disconnect-message', (msg) => {
        addChatMessage(msg, 'disconnect');
        updateScroll('message-container');
    });

    socket.on('chat message', (msg) => {
        addChatMessage(msg['user'] + ': ' + msg['message'], 'message');
        updateScroll('message-container');
    });
};

function updateScroll(elementId) {
    var element = document.getElementById(elementId);
    element.scrollTop = element.scrollHeight;
};
function addChatMessage (msg, msgType) {
    var li = document.createElement('li');
    
    if (msgType == 'message') {
        li.textContent = msg;
    }
    else if (msgType == 'connect') {
        li.classList.add('userConnected');
        li.textContent = '* A user has joined the chat';
    }
    else if (msgType == 'disconnect') {
        if (msg) {
            li.classList.add('userDisconnected');
            li.textContent = `* ${msg} has left the chat`;
        } else {
            li.classList.add('userDisconnected');
            li.textContent = "* A user (gave no nickname) has left the chat";
        }
    }
    document.getElementById('messages').appendChild(li);
};