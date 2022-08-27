
const socket = io('http://localhost:8081');

let nsSocket = "";
socket.on('connect', () => {
    socket.on("FromAPI", (coidData) => {
        let nameSpacesDiv = document.querySelector(".demo");
        nameSpacesDiv.innerHTML = "";
        console.log(coidData);
        coidData.forEach((coin) => {
            nameSpacesDiv.innerHTML += `<h3 class="demo"> ${coin.symbol} -- ${coin.openPrice} </h3>`
        })

    })


})