const errorClose = document.querySelector("#close");
const msgBox = document.querySelector(".msg");

if (msgBox) {
    errorClose.addEventListener('click', function() {
        msgBox.remove();
    });
}

// MODAL
// Get the modal
var modal = document.getElementById('myModal');
var modalContent = document.getElementById("modalContent");
// Get the button that opens the modal
var btn = document.getElementById("openModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var modalCancel = document.getElementById("modalCancel");
// When the user clicks on the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

modalCancel.addEventListener('click', function() {
  modal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}