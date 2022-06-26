const config = require('../Config/config.js');


class SQLiteDB{

    #sqlite3DB;
    constructor(){
        this.#sqlite3DB = require('better-sqlite3')(config.pathDB);
    }

    GetQuestion(wsServer,Query,jsonMessage){
        try{
            const row = this.#sqlite3DB.prepare(Query).all(jsonMessage.victorina);
            let numberQuestion = 0;
            console.log(row);
            let nameQuestionFirst = row[0].NameQuestion;
            let result = {};
            let resultQuery = {
                [numberQuestion]:{
                    Question: row[0].NameQuestion,
                    Answers: [],
                    CorrectAnswer: [],
                    IdTypeQuestion: row[0].IdTypeQuestion,
                    Score: row[0].Score 
                }
            };
            for (let i = 0; i < row.length; i++){
                if (nameQuestionFirst != row[i].NameQuestion){
                    result = Object.assign(result,resultQuery);
                    numberQuestion++;
                    resultQuery = {
                        [numberQuestion]:{
                            Question: row[i].NameQuestion,
                            Answers: [],
                            CorrectAnswer: [],
                            IdTypeQuestion: "",
                            Score: row[i].Score
                        }
                    };
                    resultQuery[numberQuestion].CorrectAnswer.push(row[i].IsAnswer);    
                    resultQuery[numberQuestion].Answers.push(row[i].NameAnswer);
                    resultQuery[numberQuestion].IdTypeQuestion = row[i].IdTypeQuestion;
										nameQuestionFirst = row[i].NameQuestion           
                }
                else {
                    resultQuery[numberQuestion].CorrectAnswer.push(row[i].IsAnswer);    
                    resultQuery[numberQuestion].Answers.push(row[i].NameAnswer);
                }
            }
            result = Object.assign(result,resultQuery);           
            console.log(result);
            wsServer.send(JSON.stringify({action: 'GET_QUESTION',minScoreWin: row[0].MinValueWin, result: result, timerCount: row[0].NeedTimeInMin, lenghtQuestion:numberQuestion, resultQuery:  "succ"}))
        }
        catch(error){
            console.log(error);
            wsServer.send(JSON.stringify({action: 'GET_QUESTION',  resultQuery:  "not_succ"}))
        }
    }



    LogIn(wsServer,Query,jsonMessage){
        try{
            const row = this.#sqlite3DB.prepare(Query).all(jsonMessage.login,jsonMessage.password);
            if (row.length != 1)
            {
                throw "Такого пользователя не существует !";
            }
            else {
                wsServer.send(JSON.stringify({action: 'LOG_IN',firstName: row[0].FirstName, lastName:row[0].LastName, resultQuery:  "succ"}));
            }
        }
        catch (e)
        {
            console.log(e);
            wsServer.send(JSON.stringify({action: 'LOG_IN', resultQuery:  "not_succ"}));
        }
    }

    CheckVictorina(wsServer,Query,jsonMessage){
        try{
            const row = this.#sqlite3DB.prepare(Query).all(jsonMessage.victorina);
            if (row.length != 1)
            {
                throw "Такой викторины не существует !";
            }

            wsServer.send(JSON.stringify({action: 'HAVE_VICTORINA?', resultQuery:  "succ"}));
        }
        catch (e)
        {
            console.log(e);
            wsServer.send(JSON.stringify({action: 'HAVE_VICTORINA?',resultQuery:  "not_succ"}));
        }
    }


		GetSessions(wsServer,Query,jsonMessage){
			try{
					const row = this.#sqlite3DB.prepare(Query).all(jsonMessage.firstNameTeacher,jsonMessage.lastNameTeacher);
					let result = {};
					for (let i = 0; i < row.length; i++){

							let resultSessions = {
									[i]:{
											idVictorina:row[i].IdVictorina,
											nameVictorina: row[i].Name,
											timeMin: row[i].NeedTimeInMin,
											AnswerAndQuestion: {
											
											
											}
									}
							}
							let rowQuestion = this.#sqlite3DB.prepare('SELECT QuestionVictorina.IdQuestion,Question.NameQuestion FROM Question INNER JOIN QuestionVictorina ON Question.IdQuestion = QuestionVictorina.IdQuestion WHERE QuestionVictorina.IdVictorina = ? AND Question.IdQuestion = ?').all(row[i].IdVictorina,row[i].IdQuestion);
							let resultQuestion = {};
							for (let j = 0; j < rowQuestion.length;j++){

									let question = {
											[j]: {
													NameQuestion: rowQuestion[j].NameQuestion,
													Answers: [],
													CorrectAnswer: [],
													idTypeQuestion:"",
													score:"",
											}
									}
									let rowAnswer = this.#sqlite3DB.prepare('SELECT Answer.NameAnswer, Answer.IsAnswer, Question.IdTypeQuestion,QuestionVictorina.Score FROM Answer INNER JOIN (Question INNER JOIN QuestionVictorina ON Question.IdQuestion = QuestionVictorina.IdQuestion) ON Answer.IdQuestion = Question.IdQuestion WHERE Answer.IdQuestion = ?').all(rowQuestion[j].IdQuestion);
									for (let k = 0; k < rowAnswer.length; k++){
											question[j].Answers.push(rowAnswer[k].NameAnswer);
											question[j].CorrectAnswer.push(rowAnswer[k].IsAnswer);
											question[j].idTypeQuestion = rowAnswer[k].IdTypeQuestion;
											question[j].score = rowAnswer[k].Score;
									}
									resultQuestion = Object.assign(resultQuestion,question);
							}
							resultSessions[i].AnswerAndQuestion = resultQuestion;
							result = Object.assign(result,resultSessions);    
					}
					console.log(result);
					wsServer.send(JSON.stringify({action: 'GET_VICTORINS_SESSIONS_RESULTS', dataResult: result, resultQuery:  "succ"}));
			}
			catch (e)
			{
					console.log(e);
					wsServer.send(JSON.stringify({action: 'GET_VICTORINS_SESSIONS_RESULTS',resultQuery:  "not_succ"}));
			}
	}




    GetSessionsResult(wsServer,Query,jsonMessage){
        try{
            const row = this.#sqlite3DB.prepare(Query).all(jsonMessage.firstNameTeacher,jsonMessage.lastNameTeacher);
            let result = {};
            for (let i = 0; i < row.length; i++){
                let session_result = {
                    [i]:{
                        idUser: row[i].IdUser,
                        firstLastName: row[i].FirstName + " " + row[i].LastName,
                        timeDone: row[i].DateResult,
                        rightQuestion:row[i].ResultScore,
                        scoreResult: row[i].CountDoneQuestion,
                        victorinaIsDone: row[i].VictorinaIsDone,
                        idVictorina: row[i].IdVictorina,
                    }
                }
                result = Object.assign(result,session_result);    
            }

            wsServer.send(JSON.stringify({action: 'GET_SESSIONS_RESULTS', dataResult: result, resultQuery:  "succ"}));
        }
        catch (e)
        {
            console.log(e);
            wsServer.send(JSON.stringify({action: 'GET_SESSIONS_RESULTS',resultQuery:  "not_succ"}));
        }
    }



    CreateVictorina(wsServer,jsonMessage){
        try{
            const rowTeacher = this.#sqlite3DB.prepare('SELECT * FROM Teacher WHERE FirstName=? AND LastName=?').all(jsonMessage.res.firstNameTeacher,jsonMessage.res.lastNameTeacher);
            const idTeacher = rowTeacher[0].IdTeacher;
            const insertVictorina = this.#sqlite3DB.prepare('INSERT INTO Victorina (IdVictorina,Name,MinValueWin,NeedTimeInMin,CountQuestion,IdTeacher) VALUES (NULL,@Name,@MinValueWin,@NeedTimeInMin,@CountQuestion,@IdTeacher)')
            let insertMany = this.#sqlite3DB.transaction((values) =>{
                for (const val of values){
                    insertVictorina.run(val);
                }
                let insertQuestionsAndAnswers = this.#sqlite3DB.prepare('INSERT INTO Question (IdQuestion, NameQuestion,IdTypeQuestion,IdTeacher) VALUES (NULL,?,?,?)')
                for (let i = 0; i < Object.keys(jsonMessage.res.res).length; i++)
                {
                    insertQuestionsAndAnswers.run(jsonMessage.res.res[i].Question,jsonMessage.res.res[i].idTypeQuestion,idTeacher);
                }
                for (let i = 0; i < Object.keys(jsonMessage.res.res).length;i++){
                    const idQuestion = this.#sqlite3DB.prepare('SELECT IdQuestion FROM Question WHERE NameQuestion = ?').all(jsonMessage.res.res[i].Question);
                    for (let j = 0; j < Object.keys(jsonMessage.res.res[i].Answers).length; j++)
                    {
                        insertQuestionsAndAnswers = this.#sqlite3DB.prepare('INSERT INTO Answer (IdAnswer,NameAnswer,IsAnswer,IdQuestion) VALUES (NULL,?,?,?)')
                        if (jsonMessage.res.res[i].AnswerIsCorrect[j] == 1){
                            insertQuestionsAndAnswers.run(jsonMessage.res.res[i].Answers[j],'1',idQuestion[0].IdQuestion);
                        }
                        else {
                            insertQuestionsAndAnswers.run(jsonMessage.res.res[i].Answers[j],'0',idQuestion[0].IdQuestion);
                        }
                    }
                    const idVictorina = this.#sqlite3DB.prepare('SELECT IdVictorina FROM Victorina WHERE Name = ?').all(jsonMessage.res.nameVictorina);
                    insertQuestionsAndAnswers = this.#sqlite3DB.prepare('INSERT INTO QuestionVictorina (IdVictorina,IdQuestion,Score) VALUES (?,?,?)');
                    insertQuestionsAndAnswers.run(idVictorina[0].IdVictorina,idQuestion[0].IdQuestion,jsonMessage.res.res[i].winScore);
                }
                wsServer.send(JSON.stringify({action: 'CREATE_VICTORINA_WITH_QUESTION',resultQuery:  "succ"}));
            }) 

            insertMany([
                {  
                    Name:jsonMessage.res.nameVictorina,
                    MinValueWin: jsonMessage.res.minScoreWin,
                    NeedTimeInMin: jsonMessage.res.timeInMinute,
                    CountQuestion: jsonMessage.res.countQuestion,
                    IdTeacher:idTeacher,
                },
              ]);
        }
        catch (e){
            console.log(e);
            wsServer.send(JSON.stringify({action: 'CREATE_VICTORINA_WITH_QUESTION',resultQuery:  "not_succ"}));
        }
    }


    CreateSessionSingle(wsServer,Query,jsonMessage){
        try{
            const row = this.#sqlite3DB.prepare('SELECT IdUser FROM User WHERE FirstName=? AND LastName=?').all(jsonMessage.firstNameUser,jsonMessage.lastNameUser);
            const insert = this.#sqlite3DB.prepare(Query);
            const insertMany = this.#sqlite3DB.transaction((values) =>{
                for (const val of values){
                    insert.run(val);
                }
                wsServer.send(JSON.stringify({action: 'CREATE_SESSION_SINGLE',resultQuery:  "succ"}));
            });
            insertMany([
                {  
                    IdUser: row[0].IdUser,
                    DataResult:jsonMessage.timeDone,
                    ResultScore:jsonMessage.resultScore,
                    IdVictorina:jsonMessage.idVictorina,
                    VictorinaIsDone:jsonMessage.victorinaIsDone,
                    CountDoneQuestion:jsonMessage.countDoneQuestion,
                },
              ]);
        }
        catch (e)
        {
            console.log(e);
            wsServer.send(JSON.stringify({action: 'CREATE_SESSION_SINGLE',resultQuery:  "not_succ"}));
        }
    }


    DeleteVictorina(wsServer,jsonMessage){
        try{
            const questionFindId = this.#sqlite3DB.prepare('SELECT IdQuestion FROM QuestionVictorina WHERE IdVictorina=?').all(jsonMessage.idVictorina);
            let deleteQuery;  

            deleteQuery = this.#sqlite3DB.prepare('DELETE FROM Victorina WHERE IdVictorina=?');
            deleteQuery.run(jsonMessage.idVictorina);

            for (let i = 0; i < questionFindId.length;i++){
                deleteQuery = this.#sqlite3DB.prepare('DELETE FROM Question WHERE IdQuestion=?');
                deleteQuery.run(questionFindId[i].IdQuestion);
            }

            wsServer.send(JSON.stringify({action: 'DELETE_VICTORINY',resultQuery:  "succ"}));
        }
        catch(e){
            console.log(e);
            wsServer.send(JSON.stringify({action: 'DELETE_VICTORINY',resultQuery:  "not_succ"}));
        }

    }


}

module.exports = SQLiteDB;