function logout()
{
firebase.auth().signOut()
  .then(function() {
    // Sign-out successful.
	window.location.href = "./";
  })
  .catch(function(error) {
    // An error happened
	console.log(error);
  });


}