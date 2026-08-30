
![Yarara Logo](/resources/YararaLogoFull.png)
<p style="text-align:center; font-style: italic">The first ever programming language made in Guarani!</p>

# What is Yarara?
Yarara is an open source programming language built with python using words in the Guarani Language,

The name "Yarara" comes from the South American snake that can be found in paraguay.

# Getting Started
Yarara is very similar to python, hence the similar logo, but has some differences in some parts.

All syntax in Guarani will be translated to english for easier understanding.

## Running Yarara
Yarara only needs Python 3 installed, no other dependencies. Run a ```.ya``` file from the repository root with:
```
python3 src/Interpreter.py path/to/file.ya
```
For example, to run the Fibonacci example mentioned later in this README:
```
python3 src/Interpreter.py examples/fibonacci.ya
```

## Variables
Variables are the same as Python variables
```
x = 10
# set variable x to 10
x = x + 1
# add 1 to x
y = x + 5
# set variable y to x + 5
```

Numbers can be made negative with a leading ```-```, e.g. ```-x``` or ```-1```.

## Lists
Lists are created with square brackets (```[``` & ```]```), holding any values separated by commas. Items are accessed and reassigned with ```[index]```, starting at ```0```.
```
lst = [1, 2, 3]
he'i lst[0] # prints 1

lst[1] = 99
he'i lst # prints [1, 99, 3]
```

Two built-in functions work on lists: ```papapy``` returns how many items are in a list, and ```jehupi``` appends an item to the end of one.
```
lst = [1, 2, 3]
he'i papapy(lst) # prints 3

jehupi(lst, 4)
he'i lst # prints [1, 2, 3, 4]
```

## Comparison Operators
Yarara supports the usual comparisons: ```==``` (equal), ```!=``` (not equal), ```<``` (less than), ```>``` (greater than), ```<=``` (less than or equal) & ```>=``` (greater than or equal). Each returns ```True``` or ```False```.
```
he'i 5 == 5  # True
he'i 5 != 3  # True
he'i 5 > 3   # True
he'i 5 < 3   # False
```

## Checking Types
Three built-in functions check what kind of value something is, each returning ```True``` or ```False```: ```ñe'ẽmi``` (is it text?), ```papapymi``` (is it a number?) & ```atymi``` (is it a list?).
```
he'i ñe'ẽmi("hola")   # True
he'i papapymi(5)      # True
he'i atymi([1, 2, 3]) # True
```

## Reading Input
```ñehendu``` reads a line of input from the console. It optionally takes a prompt to show first, and automatically converts numeric input into a number instead of leaving it as text.
```
tera = ñehendu("Mba'éichapa nde réra? ")
he'i "Mba'éichapa, "
he'i tera

edad = ñehendu() # no prompt this time
he'i edad + 1 # works directly since numeric input is auto-converted
```

## Statements
Statements are very similar to the ones used in Python, except they are translated to Guarani and use curly braces (```{}```) like in JavaScript.
```
x = 10
# set variable x to 10

ramo x == 10 {
    # if x is equal to 10
    he'i "true!" # print "true!" to the console
} ambue {
    # else, print false
    he'i "False..."
}
```

### If Statements
If statements use the keyword ```ramo```, they work very similar to if statements in python & javascript with a few differences
```
x = 10
# set variable x to 10

ramo x == 10 {
    # if x is equal to 10
    he'i "true!" # print "true!" to the console
}
```

### While Statements
While statements use the keyword ```aja```, they repeat the code block until a condition is met.

```
x = 0
# set x to 0

n = 10
# number of loops

aja x < n {
    he'i x
    x = x + 1
}

```

### Else & Else If Statements
Else statements use the keyword ```ambue```, Else if statements use the keyword ```ambue ramo```, they work the same as else & else if statements in python

Else Example:
```
x = 10
# set variable x to 10

ramo x == 10 {
    # if x is equal to 10
    he'i "true!" # print "true!" to the console
} ambue {
    # else, print false
    he'i "False..."
}
```
Else If Example:
```
x = 10
# set x to 10

ramo x == 10 {
    # if x is equal to 10
    he'i "true!" # print true
} ambue ramo x == 5 {
    # if x is equal to 5
    he'i "how" # print "how"
}

```

## Functions & Return
Functions use the keyword ```japo```, followed by two round brackets ```( & )```, inside the round brackets are the variables that can be defined when running the function, eg: ```japo(number)```, they are later continued by two curly braces to store the code that they will run ```{ & }```

Function Example:
```
# Fibonacci Function
japo fibo_loop(n) {
    a = 0
    b = 1
    i = 0
    aja i < n {
        he'i a
        temp = a + b
        a = b
        b = temp
        i = i + 1
    }
}

# Fibonacci Test
fibo_loop(10)

```
This can also be found as one of the examples in the [examples folder](/examples/fibonacci.ya)

Functions can also use the ```mbojevy``` (return) keyword to return a specific value for later use.

Return Example:
```
japo suma(a, b) {
    mbojevy a + b
}

resultado = suma(3, 4)
he'i resultado # prints 7
```

`mbojevy` exits the function immediately with the given value, so it also works for early exits inside a loop:
```
japo fibonacci(n) {
    a = 0
    b = 1
    i = 0
    aja i < n {
        ramo a > 50 {
            mbojevy a # stop early once a passes 50
        }
        temp = a + b
        a = b
        b = temp
        i = i + 1
    }
    mbojevy a
}

he'i fibonacci(20) # prints 55, exiting the loop early via mbojevy
```

## Classes
Classes use the keyword ```mbo'ehakoty```, followed by the class name, followed by two curly braces (```{``` & ```}```) containing its methods.

Inside a class, ```che``` refers to the current instance (like ```self```/```this``` in other languages). A method named ```ñepyrũ``` is special, since it is the constructor that runs once the instance is created.

Class Example:
```
mbo'ehakoty Mymba {
    ñepyrũ(tera) {
        che.tera = tera
    }
    kunumi() {
        he'i che.tera
    }
}

a = pyahu Mymba("gato")
# creates a new Mymba instance, running ñepyrũ with tera = "gato"
a.kunumi() # prints "gato"
```

```pyahu``` creates ("news up") an instance of a class, and ```.``` is used to access fields or call methods on that instance, e.g. ```a.tera``` or ```a.kunumi()```.

### Inheritance
A class can inherit from another using ```ha'e``` (is-a), gaining all of its methods (including its constructor, if it doesn't define its own) plus any new ones it adds.

Inheritance Example:
```
mbo'ehakoty Jagua ha'e Mymba {
    hu_u() {
        he'i "guau"
    }
}

b = pyahu Jagua("firulais")
b.kunumi() # inherited from Mymba, prints "firulais"
b.hu_u()   # defined on Jagua, prints "guau"
```

Only single inheritance is supported, a class can extend one parent, not several.

### A note on scope
Methods can't see plain variables from outside themselves, the only state a method can read or write across calls is through ```che```. Any variable assigned directly inside a method (without ```che.```) only exists for that one call and disappears once the method returns.

## And, Or & Not
Yarara comes packed with ```ha``` (and), ```térã``` (or) & ```nahániri``` (not), these can be used to combine or invert conditions, just like ```&&```, ```||``` & ```!``` in other languages. ```ha``` and ```térã``` go between two conditions, while ```nahániri``` goes before a single condition.

```
edad = 25

ramo edad >= 18 ha edad < 65 {
    # true only if BOTH sides are true
    he'i "adulto en edad de trabajar"
}

ramo edad < 18 térã edad >= 65 {
    # true if EITHER side is true
    he'i "no en edad de trabajar"
} ambue {
    he'i "en edad de trabajar"
}

ramo nahániri edad == 0 {
    # true if the condition is false
    he'i "edad valida"
}
```


## Comments
Comments use the hashtag (```#```) symbol, all code after it will not be ran.
```
he'i "Hello World!" # Comment <- Wont be ran

# Long comment <- Wont be ran either
```

## Imports
To import a library (built in or custom made), the ```pytaguañemu``` keyword is used. Paths are relative to wherever you run the interpreter from.

```
pytaguañemu "stdlib/core/ijykegua"
```

## Standard Library
Yarara ships a small standard library under ```stdlib/```.

### Random (```stdlib/core/ijykegua```)
A seeded random number generator, since Yarara has no built-in clock — pass ```ára()``` to seed it automatically instead of a fixed number.
```
pytaguañemu "stdlib/core/ijykegua"

r = pyahu Ijykegua(ára()) # ára() auto-seeds it, no fixed seed needed
he'i r.apytepe(1, 6) # random int from 1 to 6
he'i r.mbytepy()     # random float from 0 to 1
```

### Colors (```stdlib/core/sa'y```)
Wraps text in ANSI color codes for the terminal, similar to Python's ```colorama```.
```
pytaguañemu "stdlib/core/sa'y"

he'i col("rojo", "red")
he'i col("verde", "green")
```
Supported colors: ```black```, ```red```, ```green```, ```yellow```, ```blue```, ```magenta```, ```cyan```, ```white``` & ```reset```.

## Examples
There is an [examples folder](/examples/) in the repository meant to be used as templates or for learning, you're welcome!

## Contributing
I am not very good at the Guarani Language, and this is mainly just a project I made for fun, so if you find any spelling mistakes or any issues with the code, feel free to contribute!
