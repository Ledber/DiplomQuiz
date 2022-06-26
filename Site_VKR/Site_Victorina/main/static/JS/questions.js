let score = 0;
let rightAnswer =0;
let timeQuiz = 0;
let questionIndex = 0;

const resultArray1 = [];
const resultArray2 = [];
const resultArray3 = [];
let resultArray4 = [];



const headerContainer = document.querySelector('#header');
const listContainer = document.querySelector('#list');
const submitBtn = document.querySelector('#submit');
const timer = document.querySelector('#timer');
let quizID = sessionStorage.getItem('idStartQuiz');

// headerContainer.classList.add
	console.log(quizID);
	//получение викторины по id
	var arr = JSON.parse(localStorage.getItem(quizID));
					 console.log(arr);
					 
			//время и количесвто вопросов
			var arTime1 = arr[2][0];
			var arTime2 = arr[2][1];
			var arTotal = arr[1];
	//получение массива вопросов
	var arrQ = $.grep(arr, function(el,i){
		return (i>2);
	})
	
	console.log(arrQ);
	
	//таймер
	let time = arTime1 * 60*60 + arTime2*60;
	console.log(time);
	let intervalID = setInterval(updateCountdown, 1000);

	function updateCountdown(){
		let hours =Math.floor(time/60/60);
		let minutes =Math.floor(time/60);
		let seconds = time%60;
		hours = hours < 10 ? "0" + hours:hours;
		minutes = minutes < 10 ? "0" + minutes:minutes;
		seconds = seconds < 10 ? "0" + seconds:seconds;
		timer.innerHTML= `${hours}:${minutes}:${seconds}`;
		time--;
		timeQuiz++;
		if (	time==-1){
			console.log('Время вышло');
			clearInterval(intervalID);

			//результаты для преподавателя
		let studentCode = 18006;
		let studentName = 'Владимиров И.С.'
		let rA = rightAnswer + '/' + arTotal;
		let thisRes=rightAnswer/arTotal;
		
		resultArray3.push([studentCode, studentName, timeQuiz, rA, thisRes, score]);
		
		if (localStorage.getItem('result-Teacher-table'+ quizID )){
		resultArray4 = JSON.parse(localStorage.getItem('result-Teacher-table'+ quizID ));
		}
	console.log(resultArray4);
	resultArray4.push(resultArray3);
	console.log(resultArray4);
		localStorage.setItem('result-Teacher-table'+ quizID , JSON.stringify(resultArray4));
		
			resultArray1.push(timeQuiz);
			resultArray1.push( parseInt(arTotal));
			resultArray1.push(rightAnswer);
			resultArray1.push(score);
			localStorage.setItem('result-Student'+ quizID , JSON.stringify(resultArray1));
			window.location.href = 'results.html#tab_01'
		}
	}
clearPage();
showQuestion();
submitBtn.onclick = checkAnswer;




function clearPage(){
	headerContainer.innerHTML= '';
	listContainer.innerHTML= '';
}

function showQuestion(){
			console.log(arrQ[questionIndex]);
			//название вопроса
			
			var qN = arrQ[questionIndex][0]; 
			//варианты ответа
			var qV1 = arrQ[questionIndex][1];
			var qV2 = arrQ[questionIndex][2];
			var qV3 = arrQ[questionIndex][3];
			var qV4 = arrQ[questionIndex][4];
				
			//отображение вопроса
			const headerTemplate = `<h2 class="title-question"> %title% </h2>`;
			const title = headerTemplate.replace('%title%', qN);
			headerContainer.innerHTML = title;

			//отображение ответов 
			const listTemplate = `
			<li>
			<label class="label-check">
				<input type="radio" name="answer" id="" class="answer" value="A">
				<span class="custom-radio"></span>
				<span>` +qV1+` </span>
			</label>
		</li>
		<li>
			<label class="label-check" >
				<input type="radio" name="answer" id="" class="answer" value="B" >
				<span class="custom-radio"></span>
				<span>` +qV2+`</span>
		</label>
		</li>
		<li>
			<label class="label-check" >
				<input type="radio" name="answer" id="" class="answer" value="C" >
				<span class="custom-radio"></span>
				<span >` +qV3+`</span>
			</label>
		</li>
		<li>
			<label class="label-check">
				<input type="radio" name="answer" id="" class="answer" value="D" >
				<span class="custom-radio"></span>
				<span>` +qV4+`</span>
			</label>
		</li>
			`;
			listContainer.innerHTML = listTemplate;
}

function checkAnswer(){
	//выбранная радио кнопка
	const checkedRadio = listContainer.querySelector('input[type="radio"]:checked'); 
	
	//если ответ не выбран
	if (!checkedRadio){
		submitBtn.blur();
		return
	}
 	//правильный ответ
	 var qA = arrQ[questionIndex][5];
	 console.log(qA)
	//очки за вопрос
	 var qS = parseInt(arrQ[questionIndex][6]) ;

	 const userAnswer = checkedRadio.value ;
	 console.log(userAnswer);
	let score2=0;
	 if (qA===userAnswer){
		console.log('verno');
		 score = score + qS;
		 rightAnswer++;
		 score2=qS;
	 }

	console.log('score='+score);
	// console.log(arrQ.length);
	if ( questionIndex !== arrQ.length - 1){
		console.log('Это НЕ последний вопрос');
		let questionNumber= questionIndex+1;
		var qN = arrQ[questionIndex][0]; 
		let sA = checkedRadio.nextElementSibling;
		let studentAnswer = sA.nextElementSibling.innerHTML;
		let rAnswer;
		if (qA==='A'){  rAnswer = arrQ[questionIndex][1]} else 
		if (qA==='B'){  rAnswer = arrQ[questionIndex][2]} else
		if (qA==='C'){  rAnswer = arrQ[questionIndex][3]} else
		if (qA==='D'){  rAnswer = arrQ[questionIndex][4]};
		
		
		
		resultArray2.push([questionNumber, qN, studentAnswer, rAnswer, score2]);
		localStorage.setItem('result-Student-table'+ quizID , JSON.stringify(resultArray2));
		
		questionIndex++;
		clearPage();
		move();
		showQuestion();
	
	} else {
		move();

		//результаты для преподавателя
		
		let studentCode = sessionStorage.getItem('Stud');
		let studentName = sessionStorage.getItem('FIO');
		let rA = rightAnswer + '/' + arTotal;
		let thisRes=rightAnswer/arTotal;
		
		resultArray3.push([studentCode, studentName, timeQuiz, rA, thisRes, score]);
		
		if (localStorage.getItem('result-Teacher-table'+ quizID )){
		resultArray4 = JSON.parse(localStorage.getItem('result-Teacher-table'+ quizID ));
		}
	console.log(resultArray4);
	resultArray4.push(resultArray3);
	console.log(resultArray4);
		localStorage.setItem('result-Teacher-table'+ quizID , JSON.stringify(resultArray4));


		//результаты таб 2
		let questionNumber= questionIndex+1;
		var qN = arrQ[questionIndex][0]; 
		let sA = checkedRadio.nextElementSibling;
		let studentAnswer = sA.nextElementSibling.innerHTML;
		let rAnswer;
		if (qA==='A'){  rAnswer = arrQ[questionIndex][1]} else 
		if (qA==='B'){  rAnswer = arrQ[questionIndex][2]} else
		if (qA==='C'){  rAnswer = arrQ[questionIndex][3]} else
		if (qA==='D'){  rAnswer = arrQ[questionIndex][4]};
		resultArray2.push([questionNumber, qN, studentAnswer, rAnswer, score2]);
		localStorage.setItem('result-Student-table'+ quizID , JSON.stringify(resultArray2));
		


		//результаты таб 1
		resultArray1.push(timeQuiz);
		resultArray1.push( parseInt(arTotal));
		resultArray1.push(rightAnswer);
		resultArray1.push(score);
		localStorage.setItem('result-Student'+ quizID , JSON.stringify(resultArray1));
		window.location.href = 'results.html#tab_01'


	}

}

//
