
// //testing data
// let user_data = {"A":"1234","user":"password","LY":"0613"}

// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent default form submission
//     // Fetch form values
//     let username = document.getElementById('username').value;
//     let password = document.getElementById('password').value;
// 	let error_msg_user = document.getElementById('error_user');
// 	let error_msg_pwd = document.getElementById('error_pwd');
// 	if(user_data.hasOwnProperty(username) == false){
// 		console.log(username);
// 		error_msg_user.innerHTML = "Username is not exist";
// 	}else{
// 		error_msg_user.innerHTML = "";
// 		if(password === user_data[username]){
// 			alert(`Welcome back ${username}`);
// 			error_msg_pwd.innerHTML = "";
// 		}else{
// 			error_msg_pwd.innerHTML = "Password is incorrect";
// 		}
		
// 	}
// });
