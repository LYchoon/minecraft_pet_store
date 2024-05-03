
function check(pwd){
	if(pwd.length < 6){
		return "Password is invalid. You should use at least 6 characters.";
	}else{
		return "Done";
	}
}

document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    // Fetch form values
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
	if(username.trim() === ''){//trim() can remove space,tab and \n
		let error_message = document.getElementById('error_user');
		error_message.innerHTML = "Username is empty";
	}
	if(username.trim() === ''){
		let error_message = document.getElementById('error_user');
		error_message.innerHTML = "Username is empty";
	}
	if(password.trim() === ''){
		let error_message = document.getElementById('error_pwd');
		error_message.innerHTML = "Password is empty";
	}else if(check(password)!="Done"){
		let error_message = document.getElementById('error_pwd');
		error_message.innerHTML = check(password);
	}else{
		document.getElementById('error_pwd').innerHTML = '';
		alert("Done");
	}
});

