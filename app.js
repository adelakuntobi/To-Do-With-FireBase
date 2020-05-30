

var currentUser = {};

//Creating a new user per log in
$('#create-newuser-button').click(function() {
  var email = $('#inputEmail').val();
  var password = $('#inputPassword').val();
  console.log("New User: " + email + "\n " +"Password: " + password);
  CreateNewUser(email,password);
})

//Sign in for an existing user
$('#sign-in-button').click(function() {
  var email = $('#inputEmail').val();
  var password = $('#inputPassword').val();
  console.log("Existing User: " + email + "\n " +"Password: " + password);
  Signin(email,password);
  if(email === currentUser.email){
    console.log("Working")
    console.log(email)
  }
  else{

  }
});


//After Inputing tasks, sign out
$('#sign-out-button').click(function() {
  firebase.auth().signOut();
  console.log("Logged Out")
  alert("Logged Out")
  $("#todo-form").hide()
  $("#login-form").show()
})
$(document).ready(function() {
  $("#todo-form").hide()
})

//The add task on click that triggers when ever the user adds new tasks
$('#addButton').click(function() {
  if($('#new-task').val() === ""){
    alert("Input cannot be empty")
  }
  else{
  var list = {
    id: $('#new-task').val() + Date.now(),
    task: $('#new-task').val()
  }
  addTodoList(list)
 
}
})

//This is the function for the delete button
$(document).on("click",".deleteBtn", function() {
  console.log("I am the delete button")
  var taskId = $(this).attr('id');
  firebase.database().ref("All Users Tasks/" + taskId).remove()
  firebase.database().ref('/users/'+ currentUser.uid +"/my new tasks/" + taskId).remove()
})

//Anything time the user clicks add new task, we append it to the data base in firebase
function addTodoList(list) {
  firebase.database().ref('All Users Tasks/' +list.id ).set(list);
  firebase.database().ref('users/' + currentUser.uid +'/my new tasks/' + list.task).set(list);

}

//Creates a new user
function CreateNewUser(email,password) {
  firebase.auth().createUserWithEmailAndPassword(email,password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    alert(errorMessage);
  });
}

//Sign in for existing users
function Signin(email,password) {
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    
    console.log(errorCode);
    alert(errorMessage);
  });
}
function writeUserData(user) {
  firebase.database().ref('users/' + user.uid).set({
    email: user.email
  });
}
//Getting the user's former todo list and writing it out
var taskReference = firebase.database().ref().child('All Users Tasks/');
  taskReference.on('value', function(snapshot) {
      console.log("working")
    var taskHTML = "<h2><b>New Tasks</b></h2><hr>";
    $("#show-task").empty();
    snapshot.forEach(function(childSnap) {
    var task = childSnap.val()
    task.key = childSnap.key
      taskHTML += `<b><li> ${task.task}<button class='btn btn-info edit'>Edit</button>
      <button class="btn btn-danger deleteBtn" id="${task.id}">Delete</button>
      </li></b>`
    });
    $("#show-task").html(taskHTML);
  });

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var email = user.email;
    currentUser = user;
    writeUserData(user);
    console.log(currentUser.email + " has logged in");
    $("#login-form").hide()
    $("#todo-form").show()
  } else {
    
  }
});