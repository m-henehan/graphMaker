function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
				}
				}
				return "";
				}
				

function register()
{
    alert("Working");
	let email = document.getElementById('email1').value;
    let password = document.getElementById('password1').value;
	let password2 = document.getElementById('password2').value;
	
	if(email.includes("@") && password==password2 && password.length > 5){
		alert("creds ok");
		firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
			var user = userCredential.user;
            document.cookie = "accessToken=" + user.za;
                document.cookie = "uid=" + user.uid;
                console.log("User object", user);
                alert("Account successfully created! Logging you in!");
                
                // ...
            })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage, errorCode);
			alert(errorMessage);
        });
		createUser();
		
	}
	
	else{
		alert("Incorrect email address or password entered.");
	}
	

}

function createUser(){
    alert("createUser called");
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://us-central1-fyp-8639e.cloudfunctions.net/createUser', true);

    xhr.setRequestHeader("Content-type", "application/json");
    //Track the state changes of the request
    xhr.onreadystatechange = function()
    {
        let DONE = 4; //readyState 4 means the request is done
        let OK = 200; // status 200 is a successful return
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                let docId = JSON.parse(xhr.responseText);
                document.cookie = "docid =" + docId;
                window.location.href = "./fishbone2.html";
            } else {
                console.log('Error: ' + xhr.status);
            }
        }
    };

    xhr.send(JSON.stringify({"email":document.getElementById("email1").value, "uid" : getCookie('uid')}));
	//"uid" : getCookie('uid')
}

