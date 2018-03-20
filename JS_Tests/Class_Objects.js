/*
Richie: das keyword function kann unterschiedliche Dinge: 1. function, <br>
 2. Objekte definieren = Object Types (Blueprints) (Classes) https://www.w3schools.com/js/js_object_constructors.asp <br>
https://www.w3schools.com/js/tryit.asp?filename=tryjs_function_return <br>
einfach den ganzen Text im Editor ersetzen -> RUN <br>
*/
<p>Richie: das keyword function kann unterschiedliche Dinge: 1. function, 2. Objekte definieren</p>
<p id="demo"></p>

<script>

function myFunction(a, b) {
    b=b+2;
    var inp = b;
    alert("b"+b);
    this.attrib =666+b;
    this.method = function(c, d){return c-d}; //Methode

    return a * b;   // damit gezeigt wird, dass Class-Def + Fu-Def in EINEM !!!
}
alert("Test1");

var t = new myFunction(3,4);
alert("method: " + t.method(8,7));
r = myFunction(7,8);
alert("TestA"+t+r);
//y = t(2,5);
y=9;
alert("Test2"+t.attrib+"y:"+y);

var x = myFunction(4, 3);

document.getElementById("demo").innerHTML = x;
alert("Test3"+t.attrib+":"+"x:"+x+"t:"+t.return);

</script>

</body>
</html>
