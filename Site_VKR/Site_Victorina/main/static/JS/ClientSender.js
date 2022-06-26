var wsClient = new WebSocket("ws://localhost:8050");

var resultFromServer = "";

wsClient.onopen = function(){
    console.log("Client connected");
};


wsClient.onmessage = function(e){
    resultFromServer = e.data;
};

function getResultQuery(){
    return resultFromServer;
}

wsClient.onclose = function(){
    console.log("Сервер или клиент отключился !");
}
