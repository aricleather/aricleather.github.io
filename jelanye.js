function navHover(num) {
  let objId = "nav" + num.toString();
  document.getElementById(objId).style.backgroundColor = "#303030";
}

function navUnhover(num) {
  let objId = "nav" + num.toString();
  document.getElementById(objId).style.backgroundColor = "black";
}

function goToTic() {
  window.location.href = window.location.origin + "/tictactoe";
}

function goToGoogle() {
  window.location.href = "https://google.ca/";
}