function getNumbers(e, name, numbers)
{
    var lifts = document.getElementById(name);
    var valueEntered = document.getElementById('liftnumber').value;

var percentages = numbers.split(",");
let newvalues = [];
let keynum = String.fromCharCode(e.keyCode);

percentages.forEach(element => {
    element = element.replace('%', '');
    newvalues.push(valueEntered * element / 100);
    console.log(element);
});

lifts.innerHTML = newvalues;


console.log(valueEntered);

}