/*
Richie: das keyword function kann unterschiedliche Dinge: 1. function, <br>
 2. Objekte definieren = Object Types (Blueprints) (Classes) https://www.w3schools.com/js/js_object_constructors.asp <br>
https://www.w3schools.com/js/tryit.asp?filename=tryjs_function_return <br>
einfach den ganzen Text im Editor ersetzen -> RUN <br>
*/
<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Functions</h2>

<p>This example calls a function which performs a calculation and returns the result:</p>
<p>Richie: das keyword function kann unterschiedliche Dinge: 1. function, 2. Objekte definieren</p>
<p id="demo"></p>

<script>

function myFunction(a, b) {
    b=b+2;
    var inp = b;
    alert("b"+b);
    this.logo=666+b;
   return a * b;
}
alert("Test1");

var t = new myFunction (7,8);
alert("TestA");
//y = t(2,5);
y=9;
alert("Test2"+t.logo+"y:"+y);

var x = myFunction(4, 3);

document.getElementById("demo").innerHTML = x;
alert("Test3"+t.logo+":"+"x:"+x);

</script>

</body>
</html>
