const config = require('./Config/config.js');
const SQLiteDB = require('./DataBase/DataBaseSQL');

const http = require('http');
const WebSocketServer = require('websocket').server;

const server = http.createServer();
var ex = require("fs")



class HttpSiteServer{

    constructor(PORT,HOST)
    {
      this.PORT = parseInt(PORT);
      this.HOST = HOST;
    }

    CreateServer(server)
    {
        server.listen(this.PORT,this.HOST);
        let serverSite = new HttpSiteServer;
        const wsServer = new WebSocketServer({
            httpServer: server,
        });
        serverSite.OnMessage(wsServer);
    }


    OnMessage(wsServer){
        console.log("Сервер по данному адресу localhost:8050 запущен");
        wsServer.on('request',function(request){
            console.log("Client connect");
            const con = request.accept(null,request.origin);
            let sqliteDB = new SQLiteDB();
            con.on('message',function(message){
                let onMessage = JSON.parse(message.utf8Data);
                console.log(onMessage);
                switch(onMessage.action){

                    case "GET_QUESTION":
                        sqliteDB.GetQuestion(con,
                            'SELECT  Victorina.NeedTimeInMin, QuestionVictorina.Score,Victorina.MinValueWin,Victorina.Name,Question.NameQuestion,Answer.NameAnswer,Answer.IsAnswer,Question.IdTypeQuestion FROM Victorina INNER JOIN (QuestionVictorina INNER JOIN (Question INNER JOIN Answer  ON Question.IdQuestion = Answer.IdQuestion) ON QuestionVictorina.IdQuestion = Question.IdQuestion) ON Victorina.IdVictorina = QuestionVictorina.IdVictorina WHERE Victorina.IdVictorina=?'
                            ,onMessage);
                        break;
                    
                    case "SIGN_IN_USER":
                        sqliteDB.LogIn(con,'SELECT * FROM User WHERE IdUser=? AND Password=?',onMessage);
                        break;

                    case "SIGN_IN_ADMIN":
                        sqliteDB.LogIn(con,'SELECT * FROM Teacher WHERE IdTeacher=? AND Password=?',onMessage);
                        break;
                    
                    case "CREATE_QUESTION":
                        sqliteDB.CreateQuestion(con,'INSERT INTO Question (IdQuestion,NameQuestion,IdTypeQuestion) VALUES (NULL,@NameQuestion,@IdTypeQuestion)',onMessage);
                        break;

                    case "CREATE_VICTORINA_WITH_QUESTION":
                        sqliteDB.CreateVictorina(con,onMessage);
                        break;
                        
                    case "HAVE_VICTORINA?":
                        sqliteDB.CheckVictorina(con,'SELECT * FROM Victorina WHERE IdVictorina=?',onMessage);
                        break;
                        
                    case "GET_VICTORINS_RESULTS":
                        sqliteDB.GetSessions(con,
                            'SELECT Victorina.IdVictorina,Victorina.Name,Victorina.NeedTimeInMin FROM Teacher INNER JOIN Victorina ON Teacher.IdTeacher = Victorina.IdTeacher WHERE Teacher.FirstName=? AND Teacher.LastName=?'
                            ,onMessage);
                        break;
                    

                    case "GET_SESSIONS_RESULTS":
                        sqliteDB.GetSessionsResult(con,
                            "SELECT SessionSingle.IdUser, User.FirstName, User.LastName, SessionSingle.DateResult,SessionSingle.ResultScore,SessionSingle.IdVictorina,SessionSingle.VictorinaIsDone,SessionSingle.CountDoneQuestion FROM SessionSingle  INNER JOIN (Victorina INNER JOIN Teacher ON Teacher.IdTeacher = Victorina.IdTeacher) ON Victorina.IdVictorina = SessionSingle.IdVictorina INNER JOIN User ON User.IdUser = SessionSingle.IdUser WHERE Teacher.FirstName = ? AND Teacher.LastName = ?"
                            ,onMessage);
                        break;
                    
                    case "CREATE_SESSION_SINGLE":
                        sqliteDB. CreateSessionSingle(con,
                            'INSERT INTO SessionSingle (IdSessionSingle,IdUser,DateResult,ResultScore,IdVictorina,VictorinaIsDone,CountDoneQuestion) VALUES (NULL,@IdUser,@DataResult,@ResultScore,@IdVictorina,@VictorinaIsDone,@CountDoneQuestion)'
                            ,onMessage);
                        break;
                    
                    case "DELETE_VICTORINY":
                        sqliteDB.DeleteVictorina(con,onMessage);
                    break;

                    default:
                        console.log('Неизвестная команда');
                        break;
                }

            });
        });
    }

}

let siteServer = new HttpSiteServer(config.port,config.host);
siteServer.CreateServer(server);
