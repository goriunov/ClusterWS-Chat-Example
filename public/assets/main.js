// ClusterWS instance with settings to connect
let socket = new ClusterWS({
    port: 80,
    url: 'localhost'
})

// Rundom number for user
let uId = Math.floor(Math.random() * 999999) + 10000

// Get from html place where all messagess will display
let chat = document.getElementById("messages")

// Listen on socket connect
socket.on('connect', () => {
    // Insert text that user is connected
    chat.innerHTML = '<div class="info">You are connected to the chat</div>'

    // Subscribe to the chat channel
    socket.subscribe('chat').watch((message) => {

        // Listen on messages which comes to chat channel
        if (message.id === uId) {
            // If message was send by you insert message with your-message styles
            chat.innerHTML = chat.innerHTML + '<div class="your-message"><div><strong>Anonim-' + message.id + ':</strong></div>' + message.text + '</div>'
        } else if (message.id === 'global') {
            // If message was send by server then insert message with info styles       
            chat.innerHTML = chat.innerHTML + '<div class="info">' + message.text + '</div>'
        } else {
            // If message was send by someone else then insert message with someone-message styles                
            chat.innerHTML = chat.innerHTML + '<div class="someone-message"><div><strong>Anonim-' + message.id + ':</strong></div>' + message.text + '</div>'
        }

        // Always scroll to the bottom
        window.scrollTo(0, chat.scrollHeight)
    })
})


// Get input from html to be able to get message
let text = document.getElementById("input")

// Listen on submit of form
document.getElementById('form').onsubmit = (e) => {
    // Disable realod of page
    e.preventDefault()

    // If input does not contain message then dont do anything
    if (text.value.length < 1) return

    // Publish message to the other users
    socket.getChannelByName('chat').publish({
        id: uId,
        text: text.value
    })

    // Clear input
    text.value = ''
}
