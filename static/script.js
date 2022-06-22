


function getNumbers(e, name, numbers)
{
    var lifts = document.getElementById(name);
    var keypressed = e.target.value;

var percentages = numbers.split(",");
let newvalues = [];

percentages.forEach(element => {
    element = element.replace('%', '');
    newvalues.push(keypressed * element / 100);
});

lifts.innerHTML = newvalues;

console.log('value entered' + keypressed);

}