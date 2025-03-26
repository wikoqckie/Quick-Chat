document.addEventListener("DOMContentLoaded", () => {

    const socket = io("http://localhost:3000")

    // MENU

    const enter = document.getElementById("enter")
    const name = document.getElementById("name")
    const droid = document.getElementById("quickdroid")
    const nameForm = document.getElementById("login")

    if(enter){ // czy istnieją jeżeli nie to ignoruje

        function goToChat(){
            if(name.value == ""){
                alert("Your name cannot be nothing dumbass 🙄...")
            }else if(name.value.includes(" ")){
                alert("Your name cannot include space you wierd freak 😂")
            }else{
                const username = name.value
                sessionStorage.setItem("userName", username)
                window.location.href = "chat.html"
            }
        }

        nameForm.addEventListener("submit", e => {
            e.preventDefault()
            goToChat()
        })

        droid.addEventListener("click", () => {
            droid.classList.add("pet")
            setTimeout(() => {
                droid.classList.remove("pet")
            }, 100)
        })

        name.addEventListener("input", () => {
            if(name.value.length > 8){
                name.value = name.value.substring(0, 8)
            }
        })
    }

    // CHAT

    const back = document.getElementById("backbtn")
    const send = document.getElementById("send")
    const messageinput = document.getElementById("messageinput")
    const messageContainer = document.getElementById("chatarea")
    const messageForm = document.getElementById("send-container")
    const scrollContainer = document.getElementById("chat-container")
    const myIcon = document.querySelector(".iconload")
    const uploadBtn = document.getElementById("uploadbtn")

    if(send){ //czy isnteją w chat.html jeżeli nie to ignoruje

        socket.emit("start-chat") // start chatu

        let usrMe = ""
        const username = sessionStorage.getItem("userName")
        msgAppendNI("You joined " + username)

        socket.on("user", data => {
            usrMe = data
            myIcon.classList.add(usrMe)
        })

        socket.emit("new-user", username)

        socket.on("user-joined", name => {
            msgAppendNI(name + " joined")
        })

        messageForm.addEventListener("submit", e => {
            e.preventDefault()
            if(messageinput.value.length > 0 && messageinput.value.charAt(0) == " "){
                alert("don't start sentence with space 🙄")
            }else if(messageinput.value == ""){
                alert("don't try to send an empty message 😡")
            }else{
                const message = messageinput.value
                const mesIcon = {usrNo: usrMe, message: message}
                msgAppend({ name: "You", ...mesIcon })
                socket.emit("send-chat-message", mesIcon)
                messageinput.value = ""
            }
        })

        socket.on("get-chat-message", data => {
            msgAppend(data)
        })

        socket.on("user-left", name => {
            msgAppendNI(name + " left")
        })

        function msgAppend({ name, usrNo, message }){
            const msgLine = document.createElement("div");
            const msgText = document.createElement("a");
            const msgIcon = document.createElement("div")

            msgIcon.classList.add(usrNo)
            msgLine.classList.add("line");
            msgText.innerText = `${name}: ${message}`;

            if(message.includes("www.")){
                const url = message.match(/(www\.[^\s]+)/)[0];
                msgText.href = `https://${url}`;
                msgText.classList.add("linkColor");
                msgText.target = "_blank";
            }
        
            messageContainer.append(msgLine);
            msgLine.append(msgIcon)
            msgIcon.append(msgText);
            scrollContainer.scrollTop = scrollContainer.scrollHeight;

        }

        function msgAppendNI(message){
            const msgLine = document.createElement("div")
            msgLine.classList.add("lineNI")
            msgLine.innerText = message
            messageContainer.append(msgLine)
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }

        back.addEventListener("click", () => {
            window.location.href = "index.html"
        })
    }

})