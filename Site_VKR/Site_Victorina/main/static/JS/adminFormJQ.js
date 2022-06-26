function updateTableVictorina(result){
    let table = document.getElementById('table-admin-victorina');
    for (let i = 0; i < Object.keys(result).length;i++)
    {
        let row = table.insertRow(i);
           let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        cell1.classList.add('q1_1');
        cell2.classList.add('q2_2');
        cell3.classList.add('q4');
            cell4.classList.add('q4');
        cell5.classList.add('q4');
        cell1.textContent = result[i].idVictorina + " ";
        cell2.textContent = result[i].nameVictorina;
        cell3.innerHTML = '<button  onclick="getCurrentSession('+result[i].idVictorina+')" id="btn-res" class=" dt-result form-auto-btn form-admin-btn admin-btn-1" type="submit" ><i class="fa-solid fa-chart-bar"></i></button>';
        cell4.innerHTML = '<button  onclick="getVictorinaQuestion('+result[i].idVictorina+')" id="btn-more" class=" dt-more form-auto-btn form-admin-btn admin-btn-2" type="submit" ><i class="fa-solid fa-sliders"></i></button>';
        cell5.innerHTML = '<button  onclick="deleteVictorina('+result[i].idVictorina+')"  id="btn-del" class=" dt-delete form-auto-btn form-admin-btn admin-btn-3" type="submit" ><i class="fa-solid fa-trash-can"></i></button>';
    }
    SendJsonMessageGetQuestionEx("GET_SESSIONS_RESULTS");
}

function searchInputNameOrId(element,valueIndex){
    const searchQuery = element.value.toLowerCase();
    let table = document.getElementById('table-admin-victorina');
        for (let row of table.rows){
            const value = row.textContent.toLowerCase().split(' ');
            row.style.visibility = null;
            if (valueIndex == 1){
                if (value[0].search(searchQuery) === -1) {
                      row.style.visibility = "collapse";
                }
            }
            else if (valueIndex == 2){
                if (value[1].search(searchQuery) === -1) {
                      row.style.visibility = "collapse";
                }
            }
        }
}


function setQuestionCheckOrRadioButton(res,i){
    return '<p id="more-q" >' + 
                'Вопрос '+(i+1)+': '  + res.NameQuestion +
                '</p>'+
                '<p id="more-q-variant" >' +
                'Варианты ответа: ' +
                '</p>' +
                '<p id="more-q-variant-1" >' +
                'A: ' + res.Answers[0]+
                '</p>' +
                '<p id="more-q-variant-2" >' +
                'B: '+ res.Answers[1]+
                '</p>'+
                '<p id="more-q-variant-3" >' +
                'C: '+ res.Answers[2]+
                '</p>'+
                '<p id="more-q-variant-4" >' +
                'D: '+ res.Answers[3]+
                '</p>'+
                '<p id="more-q-answer" >' +
                'Правильный ответ:   '+ getArrayAnswerLiterli(res.CorrectAnswer) +  
                '</p>' +
                '<p id="more-q-answer" class="qBorder"> '+
                'Баллов за правильный ответ: '+ res.score+
                '</p>';
}

function setQuestionTextBox(res,i){
    return '<p id="more-q" >' + 
                'Вопрос '+(i+1)+': '  + res.NameQuestion +
                '</p>'+
                '<p id="more-q-answer" >' +
                'Правильный ответ:   '+ res.Answers[0]+  
                '</p>' +
                '<p id="more-q-answer" class="qBorder"> '+
                'Баллов за правильный ответ: '+ res.score +
                '</p>'
}

function clearTableMoreVictorina(){
    document.getElementById('more-qName').textContent = "Название Викторины: ";
    document.getElementById('more-qTime').textContent = "Время прохождения: ";
    document.getElementById('more-qTotal').textContent= "Количество вопросов: ";
    document.getElementById('id-input-current-victorina').textContent = "";
    let container_question = document.getElementById('more-container-questions');
    container_question.innerHTML = '';
}

function getVictorinaQuestion(element){
    let res;
    let findResult = false;
    for (let i = 0; i < Object.keys(tableVictorina).length;i++ ){
        if (element == tableVictorina[i].idVictorina){
            res = tableVictorina[i];
            findResult = true;
        }
    }
    
    if(findResult == true){
        document.getElementById('more-qName').textContent = "Название Викторины: " + res.nameVictorina;

        let resultTime = 60 * res.timeMin;
        let hour = (resultTime /60 /60) | 0;
        let minutes = ((resultTime - (hour * 60 * 60)) / 60) | 0;
        let seconds = (resultTime % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        hour = hour < 10 ? "0" + hour : hour;

        document.getElementById('more-qTime').textContent = "Время прохождения: " + hour + "ч. " + minutes + "мин. " + seconds + "сек.";
        document.getElementById('more-qTotal').textContent= "Количество вопросов: " + Object.keys(res.AnswerAndQuestion).length;
        
        let container_question = document.getElementById('more-container-questions');
        container_question.innerHTML = '';
        let question;
        for (let i = 0; i < Object.keys(res.AnswerAndQuestion).length;i++){
    
            if (res.AnswerAndQuestion[i].idTypeQuestion == 0 || res.AnswerAndQuestion[i].idTypeQuestion == 2){
                question = setQuestionCheckOrRadioButton(res.AnswerAndQuestion[i],i);
            }
            else if (res.AnswerAndQuestion[i].idTypeQuestion == 1){
                question = setQuestionTextBox(res.AnswerAndQuestion[i],i);
            }
            container_question.insertAdjacentHTML('beforeend',question);
        }
        
        document.getElementById('tab-2').checked = false;
        document.getElementById('tab-4').checked = true;    
    }
    else {
        alert('Результатов нет !');
        clearTableMoreVictorina()
    }      
}

function resultSearchSession(element,countNote,result){
for (let i = 0; i < Object.keys(tableSession).length;i++){
    if (element == tableSession[i].idVictorina){
        let res = {
            [countNote]:{

            }
        }
        result[countNote] = Object.assign(res[countNote],tableSession[i]);
        countNote++;
    }
}
document.getElementById('tab-2').checked = false;
document.getElementById('tab-3').checked = true;  
if (Object.keys(result).length != 0){
    SessionTable(result);
}
else {
    alert('Результат отсуствует !');
    clearTableResult(document.getElementById('table-result-body'));
}

}

function getCurrentSession(element){
    if (element != undefined || element != '' || element != null){
        clearTableResult(document.getElementById('table-result-body'));
        let countNote = 0;
        let result = {};
        resultSearchSession(element,countNote,result);
    }
    else {
        alert('Тестируем результаты');
        clearTableResult(document.getElementById('table-result-body'));
    }
}

function SessionTable(result){
    let table = document.getElementById('table-result-body');
    for (let i = 0; i < Object.keys(result).length;i++)
    {
        let row = table.insertRow(i);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);
        cell1.textContent = result[i].idUser;
        cell2.textContent = result[i].firstLastName;
        
        let hour = (result[i].timeDone /60 /60) | 0;
        let minutes = ((result[i].timeDone - (hour * 60 * 60)) / 60) | 0;
        let seconds = (result[i].timeDone % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        hour = hour < 10 ? "0" + hour : hour;

        cell3.textContent = hour + ":" + minutes + ":" + seconds;
        cell4.textContent = result[i].rightQuestion;
        cell5.textContent = result[i].scoreResult;
        if (result[i].victorinaIsDone == 1){
            cell6.classList.add("r-win");
            cell6.textContent = 'Прошел';
        }
            else {
            cell6.classList.add("r-lost");
            cell6.textContent = 'Не прошел';
        }
    }
}



function deleteVictorina(element){
    let table = document.getElementById('table-admin-victorina');
    for (let i = 0; i < table.rows.length; i++){
        if (table.rows[i].cells[0].textContent == element){
            clearAllTable();
            SendJsonMessageDeleteVictorina('DELETE_VICTORINY',element)
        }
    }
}



function clearTableResult(table){
    let table_result = table;
    while(table_result.hasChildNodes()){
        table_result.removeChild(table_result.firstChild);
    }

}


function hideContainerQuestion(){
    let container_create_victorina = document.getElementById('container-create-victorina');
    let container_create_question = document.getElementById('container-create-question');
    let form_question = document.getElementById('form-question');
    container_create_victorina.style.visibility = 'visible';
    container_create_question.style.visibility = 'hidden';
    form_question.classList.add('hide');
    document.getElementById('title-question-set').value = '';
    document.getElementById('count-question-set').value = '';
    document.getElementById('time-hour-set').value = '0';
    document.getElementById('qM').value = '0';
		
}

function getArrayAnswerLiterli(array){
    let res = "";
    for (let i =0; i < array.length;i++){
        if (array[i] == 1){
            res = res +  getNameByIndex(i) + " ";
        }
    }
    return res;

}

function getNameByIndex(i){
    switch (i){
        case 0:
            return "A";
            break;
        case 1:
            return "B";
            break;
        case 2:
            return "C";
            break;
        case 3:
            return "D";
            break;    
    }

}

function getIdTypeQuestion(valueSelect){
    switch (valueSelect){
        case "type_question_1":
            return 0;
            break;

        case "type_question_2":
            return 1;
            break;

        case "type_question_3":
            return 2;
            break;
    }
}

function AnswerIsNotEmpty(count){
    let notEmptyValue = false;
    for (let i = 0; i < count; i++){
        let inputNum = document.getElementById('input' + (i+1)).value;
        if (inputNum == "" || inputNum == null){
            notEmptyValue = true;
            break;
        }
    }
    return notEmptyValue;
}


function HideInputs(count){
    for (let i = count; i < 4; i++){
        let inputNum = document.getElementById('input' + (i+1));
        let title_input = document.getElementById('input-answer'+(i+1));
        inputNum.hidden = true;
        title_input.style.display = 'none';
    }
}

function VisibleInputs(){
    for (let i = 0; i < 4; i++){
        let inputNum = document.getElementById('input' + (i+1));
        let title_input = document.getElementById('input-answer'+(i+1));
        inputNum.hidden = false;
        inputNum.value = "";
        title_input.style.display = 'inline';
    }
}

function ChangeTypeQuestion(){
    let change = document.getElementById('change_type_question').value;
    VisibleInputs();
    switch(change){
        case "type_question_1":
            HideInputs(4);
            break;
        case "type_question_2":
            HideInputs(1);
            break;
        case "type_question_3":
            HideInputs(4);
            break;
        default:
            break;	
    }
}

function AwaitResult(nameAction){
    let interval = setInterval(()=>{
        let result = getResultQuery();
        let resultJSONFormat =  JSON.parse(result);
        if (resultJSONFormat.resultQuery == "succ"){
            clearInterval(interval);
            switch (nameAction){
                case "GET_VICTORINS_RESULTS":
                    tableVictorina = resultJSONFormat.dataResult;
                    updateTableVictorina(resultJSONFormat.dataResult);
                    break;
                case "GET_SESSIONS_RESULTS":
                    tableSession = resultJSONFormat.dataResult;
                    break;
                case "DELETE_VICTORINY":
                    SendJsonMessageGetQuestionEx('GET_VICTORINS_RESULTS');
                    break;
            }
        }
        else if (resultJSONFormat.resultQuery == "not_succ"){
            clearInterval(interval);
        }
    },500);			
}

function clearAllTable(){
    let table_admin = document.getElementById('table-admin-victorina');
    let table_result = document.getElementById('table-result-body');
    while(table_admin.hasChildNodes()){
        table_admin.removeChild(table_admin.firstChild);
    }
    while(table_result.hasChildNodes()){
        table_result.removeChild(table_result.firstChild);
    }

}

function AwaitResultCreateVictorini(){
    let interval = setInterval(()=>{
        let result = getResultQuery();
        let resultJSONFormat =  JSON.parse(result);
        if (resultJSONFormat.resultQuery == "succ"){
            clearInterval(interval);
            clearAllTable();
            SendJsonMessageGetQuestionEx('GET_VICTORINS_RESULTS')
        }
        else if (resultJSONFormat.resultQuery == "not_succ"){
            clearInterval(interval);
						alert('Создать викторину не получилось !');
        }
    },500);
}



function cutName(namestr) {
      var newArray = namestr.split(',');
      return newArray;
}



function SendJsonMessageInserQuestion(nameAction){
    let jsonA = JSON.stringify({
        action: nameAction,
        NameQuestion:document.getElementById('questionName').value,
        Answer:[],
        CorrectAnswer:"",
        firstNameTeacher:firstTeacherName,
        lastNameTeacher:lastTeacherName,
    });
    jsonA.CorrectAnswer = document.getElementById('correctValue').value.split[','];
    for (let i = 0; i < 4; i++){
        let inputAnswer = document.getElementById('input'+ i).value;
        jsonA.Answer.push(inputAnswer);
    }
    wsClient.send(jsonA);
    AwaitResult(nameAction);
}

function SendJsonMessageGetQuestionEx(nameAction){
    let jsonA = JSON.stringify({
        action: nameAction,
        firstNameTeacher:firstTeacherName,
        lastNameTeacher:lastTeacherName,
    });
    wsClient.send(jsonA);
    AwaitResult(nameAction);
}

function SendJsonMessageDeleteVictorina(nameAction,idVictorina){
    let jsonA = JSON.stringify({
        action: nameAction,
        idVictorina: idVictorina,
    });
    wsClient.send(jsonA);
    AwaitResult(nameAction);
}

function sendMessageInsert(){
    let jsonA = JSON.stringify({
        action: "CREATE_VICTORINA_WITH_QUESTION",
        res:createVictorina,
    });
    wsClient.send(jsonA);
    AwaitResultCreateVictorini();
}