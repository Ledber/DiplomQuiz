// Global variables
// UI Variables

const generateBtn = document.getElementById('generateBtn');
const btnRess = document.querySelectorAll('#btn-res');
const btnMores = document.getElementById('#btn-more');
const quizConfig = document.getElementById('quizConfig');
const quizTable = document.querySelector('#table-admin');

const form = document.getElementById('quizForm');
const submit = document.getElementById('submit');


// Position Variables
let pos = 1;
let quizPos = 1;
let position = 0;
let incorrectPos = 0;

// Quiz data
let quizHTML;
function toLocal(){
	quizHTML = quizTable.innerHTML;
	localStorage.setItem('quizHTML', quizHTML);
}
const questions = [];


// Quiz score
let correct = 0;
let incorrect = 0;
let	quizID = 0;


// Generate questions & options for quiz
generateBtn.addEventListener('click', (e) => {
	
	let  qTotal = 0;
	pos = 1;
	questions.length=0;
  qTotal = document.getElementById('qTotal');
	let qName = document.getElementById('qName');
	let qH = document.getElementById('qH');
	let qM = document.getElementById('qM');
	let totalQ = qTotal.value;
	let nameQ = qName.value;
	let hQ = qH.value;
	let mQ = qM.value;
	let KeyIndex = localStorage.length;
	
	if ( KeyIndex >= 1){
		quizID = KeyIndex;
	} else {
		quizID = 0;
	}

	// Check input fields have value
	if (qTotal && qTotal.value && qName.value && qH.value && qM.value) {
		
    clearConfig();
    renderForm();
		quizID++;
		
		questions.push(qName.value);
		questions.push(qTotal.value);
		questions.push([qH.value, qM.value]);

		localStorage.setItem(quizID , JSON.stringify(questions));
    } else {
    alert('Input fields empty');
  }
})

function storeData() {
  // Get values
  const title = document.getElementById('title').value;
  const input1 = document.getElementById('input1').value;
  const input2 = document.getElementById('input2').value;
  const input3 = document.getElementById('input3').value;
	const input4 = document.getElementById('input4').value;
  const value = document.getElementById('correctValue').value;
	const score = document.getElementById('score').value;
  // Append to array
	questions.push([title, input1, input2, input3, input4, value, score]);

	localStorage.setItem(quizID , JSON.stringify(questions));
  
  // Increase position in form
  pos++;
  console.log(pos);
  console.log(qTotal.value);
  // Reset form
  reset();
  console.log(questions);
}

// Submit quiz data to arrays
submit.addEventListener('click', (e) => {
  if (pos < qTotal.value) {
    storeData();

} else if (pos == qTotal.value) {
  // Start quiz
  storeData();
	quizToTable();
	toLocal();
	location.reload();
	clearForm();
  renderConfig();
	
  //renderQuiz();

} else {
  // Error Handler
  alert('Display error');
  }
})
function endCreate() {

}

 // Clear configuration
 const clearConfig = () => { quizConfig.classList.add('hide');};
 // Clear form
const clearForm = () => {  form.classList.add('hide'); }
 // Render Form
 const renderForm = () => {
	const renderForm = document.getElementById('quizForm');
	quizForm.classList.remove('hide');
 }
 
 const renderConfig = () => {
	 const renderConfig = document.getElementById('quizConfig');
	 quizConfig.classList.remove('hide');
	 resetConfig();
	 
	}
// Reset form
 function reset() {
	 form.reset();
	 const labels = [...document.querySelectorAll("label")];
		 labels.forEach((label) => {
			 label.classList.add('active');
		 })
	 }
	 function resetConfig() {
		 quizConfig.reset();
		 const labels = [...document.querySelectorAll("label")];
			 labels.forEach((label) => {
				 label.classList.add('active');
			 })
		 }
		 const  quizTableTemplate = ` 
		 <tr class="" >
		 <td id="quizID" class="q1_1">%ID%</td>
		 <td class="q2_2">%name%</td>
		 <td class="q4"> <button id="btn-res" class=" dt-result form-auto-btn form-admin-btn admin-btn-1" type="submit" ><i class="fa-solid fa-chart-bar"></i></button></td>
		 <td class="q4"> <button id="btn-more" class=" dt-more form-auto-btn form-admin-btn admin-btn-2" type="submit" ><i class="fa-solid fa-sliders"></i></button></td>
			 <td class="q4"> <button  id="btn-del" class=" dt-delete form-auto-btn form-admin-btn admin-btn-3" type="submit" ><i class="fa-solid fa-trash-can"></i></button></td>
			 </tr>
			`;
			function quizToTable() {
			  const qtitle = quizTableTemplate.replace('%name%', questions[0]);
				const qtitle1 = qtitle.replace('%ID%', quizID);

				quizTable.insertAdjacentHTML('beforeend', qtitle1);
				}

			
				if(localStorage.getItem('quizHTML')){
					quizTable.innerHTML = localStorage.getItem('quizHTML');
			
				}
			
			
					
	
			
		
		