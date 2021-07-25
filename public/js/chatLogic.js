window.onload = () => {
    var socket = io();

    var form = $('#form');
    var input = $('#input');
    var nickname = $('#nickname');
    var messageList = $('#messages');
    // Target the nickname input box
    nickname.focus();

    // User clicks the send button, check for a message and username
    form.on('submit', function(e) {
        e.preventDefault();
        if (input.val() && nickname.val()) {
            // Create a new message item and append it to the chat container
            // We do this locally because the server will not propagate our own message to us
            addChatMessage(messageList,nickname.val() + ': ' + input.val(), 'message');
            updateScroll('message-container');
            
            // Send our message to the server
            socket.emit('chat message', {"user": nickname.val(), "message":input.val()});
            input.val('');
            input.focus();
        }
    });

    nickname.on('keypress', (event) => {
        if (event.key == 'Enter' && $('#nickname').val()) {
            nickname.prop('disabled', true);
            input.focus();
        }
    });
    nickname.on("focusout", () => {
        if (nickname.val() && nickname.val() !== "") {
            nickname.prop('disabled', true);
        }
    });

    socket.on('connect-message', () => {
        addChatMessage(messageList, null, 'connect');
        updateScroll('message-container');                    
    });
    
    socket.on('disconnect-message', (msg) => {
        addChatMessage(messageList,msg, 'disconnect');
        updateScroll('message-container');
    });

    socket.on('chat message', (msg) => {
        addChatMessage(messageList,msg['user'] + ': ' + msg['message'], 'message');
        updateScroll('message-container');
    });
};

function updateScroll(elementId) {
    $('#' + elementId).scrollTop($('#' + elementId).prop('scrollHeight'));
};
function addChatMessage (messageList ,msg, msgType) {
    var li = $('<li></li>');
    
    if (msgType == 'message') {
        li.text(msg);
    }
    else if (msgType == 'connect') {
        li.addClass('userConnected');
        li.text('* A user has joined the chat');
    }
    else if (msgType == 'disconnect') {
        if (msg) {
            li.addClass('userDisconnected');
            li.text(`* ${msg} has left the chat`);
        } else {
            li.addClass('userDisconnected');
            li.text("* A user (gave no nickname) has left the chat");
        }
    }
    messageList.append(li);
};