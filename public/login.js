function login()
{

let email = document.getElementById('email1').value
let password = document.getElementById('password1').value
	
firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
	var user = userCredential.user;
            document.cookie = "Bearer " + user.za;
            document.cookie = "uid=" + user.uid;
            console.log("User object", user);
			console.log(user.za);
			window.location.href = "./fishbone_2.html";
	
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
	console.log(errorCode, errorMessage);
	alert("Incorrect login details! Try again");
  });
}