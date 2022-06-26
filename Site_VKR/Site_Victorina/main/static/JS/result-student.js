let quizID = sessionStorage.getItem('idStartQuiz');
let questionIndex = 0;
var arr = JSON.parse(localStorage.getItem('result-Student'+ quizID));
var arr2 = JSON.parse(localStorage.getItem('result-Student-table'+ quizID));

console.log(arr2);

let timeQuiz = arr[0];
let arTotal = arr[1];
let rightAnswer = arr[2];
let score = arr[3];
let resultMedal =``;
const minRes=0.5;
let thisRes=rightAnswer/arTotal;
if (thisRes>=minRes){
			
 resultMedal = `
	<span class="point-result point-result-win">
	Вы прошли викторину!
</span>`;
} else{
	resultMedal = `
	<span class="point-result point-result-lose">
	Вы не прошли викторину:(
</span>`;
}

let hours =Math.floor(timeQuiz/60/60);
let minutes =Math.floor(timeQuiz/60);
let seconds = timeQuiz%60;


const resFirst = document.querySelector('#res-1');

const resTemplate = `
<span class="text-result text-result_1 ">	Время прохождения:
<span class="point-result">`
	+ hours + ` часов ` + minutes + ` минут ` + seconds + ` секунд ` +
`</span>
</span>
<span class="text-result text-result_2"> 
Всего вопросов:
<span class="point-result">`
	+ arTotal +
`</span>
</span>
<span class="text-result text-result_3"> 
Правильных ответов:
<span class="point-result">
`
	+ rightAnswer +
`
</span>
</span>
<span class="text-result text-result_4"> 
Набранные очки:
<span class="point-result">
`
	+ score +
`
</span>
</span>
<span class="text-result text-result_5"> 


	`+ resultMedal +`

</span>
`;

resFirst.innerHTML = resTemplate;

let resTab2 ='';
let resTab22 ='';
const resSecond = document.querySelector('#res-2');
resSecond.innerHTML='';



let tableNum = 0;
let questionName ='';
let studentAnswer ='';
let rightAns = '';
let scoreAns = 0;

displayRes();
function displayRes(){
for (item1 of arr2[questionIndex]){
				

				tableNum = arr2[questionIndex][0];
				questionName = arr2[questionIndex][1];
				studentAnswer = arr2[questionIndex][2];
				rightAns = arr2[questionIndex][3];
				scoreAns = arr2[questionIndex][4];
				
	}

questionIndex++;
resTab2 = `
<tr>
<th scope="row">`+ tableNum+`</th>
<td >`+	questionName +`</td>
<td>`+ 	studentAnswer+`</td>
<td>`+ rightAns+`</td>
<td>`+ scoreAns+`</td>
</tr>
`;
resSecond.innerHTML += resTab2;
if (questionIndex!==arr2.lenght){
	displayRes();
}
}



