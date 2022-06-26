// const apCode = document.getElementById('apCode')
const startBtn = document.querySelector('#start-btn');

startBtn.addEventListener('click', (e) =>{
	let apCode = document.getElementById('apCode').value;
	console.log('clickk');
	console.log(apCode);
	let arr = JSON.parse(localStorage.getItem(apCode));
	console.log(arr);
	if (arr==null){
		confirm('Викторина не найдена');
	} else{
		sessionStorage.setItem('idStartQuiz', apCode);
		window.location.href = 'question.html'
	}
})