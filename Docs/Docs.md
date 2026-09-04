# Yarara Docs
Welcome to the _Yarara Docs!_

Here, you will find useful info for the Yarara language, such as tips, examples, etc.

Yarara is very similar to python, hence the similar logo, but has some differences in some parts.

All syntax in Guarani will be translated to english for easier understanding.

## Getting Started

### Installation
Installing Yarara is very easy, there is currently no "installer" for the language, but it is installable by cloning our [GitHub Repository](https://github.com/RandomGuy4114/Yarara).


### Running
Yarara only needs Python 3 installed, no other dependencies. Run a ```.ya``` file from the repository root with:
```
python3 src/Interpreter.py path/to/file.ya
```
For example, to run the Fibonacci example mentioned later in this guide:
```
python3 src/Interpreter.py examples/fibonacci.ya
```

### File Creation
Making a Yarara Program is very simple, all you need to do is create a file (with any name) that finishes with the ```.ya``` file extension.


If you have made it this far, you are ready to get to coding!

### Your First Program
Let's get to making your first program! For this example, we will be making a simple program that prints "Hello, World!" To the console.

Create a new file called ```hello.ya``` and put the following inside it:
```
he'i "Hello, World!"
```

```he'i``` (pronounced roughly "heh-EE") is Yarara's print keyword, it's Guarani for "to say". Whatever expression follows it gets evaluated and printed to the console, followed by a newline, exactly like Python's ```print()```.

Run it from the repository root with:
```
python3 src/Interpreter.py hello.ya
```

You should see:
```
Hello, World!
```

That's it, you've written and run your first Yarara program! From here on, this guide will walk through every part of the language in detail, from variables and control flow all the way to classes, native C interop and the standard library. Feel free to follow along by dropping each example into its own ```.ya``` file and running it.

## Variables
Variables in Yarara work the same way they do in Python: no type keyword, no declaration step, just a name, an ```=```, and a value. A variable is created the first time it's assigned, and reassigning it later just overwrites the old value.

```
x = 10
# set variable x to 10
x = x + 1
# add 1 to x
y = x + 5
# set variable y to x + 5
```

Numbers can be made negative with a leading ```-```, e.g. ```-x``` or ```-1```, and can have decimals, e.g. ```3.14```. Internally, Yarara stores whole numbers as Python ```int```s and decimal numbers as Python ```float```s, and arithmetic between them follows the same promotion rules Python uses (an ```int``` combined with a ```float``` produces a ```float```).

Variable names (and every other identifier in Yarara — function names, class names, method names) can use unicode letters, which matters a lot for a language built around Guarani words, since Guarani uses letters like ```ñ``` and apostrophe-glottal-stop combinations such as ```ha'e``` or ```ñe'ẽmi```. An identifier can also contain an internal apostrophe followed by more letters, so names like ```ñe'ẽmi``` or ```mbo'ehakoty``` are valid single identifiers, not two separate tokens split on the ```'```.

There is no ```che``` at the top level outside of a class — ```che``` (covered later, in the Classes section) only has meaning inside a method body, where it refers to the current instance.

## Lists & Strings
Lists are created with square brackets (```[``` & ```]```), holding any values separated by commas. Items are accessed and reassigned with ```[index]```, starting at ```0```, just like Python lists.

```
lst = [1, 2, 3]
he'i lst[0] # prints 1

lst[1] = 99
he'i lst # prints [1, 99, 3]
```

Lists in Yarara can hold a mix of any value type at once — numbers, strings, other lists, or class instances — there's no fixed element type to declare.

Negative indices work too, counting back from the end of the list, exactly like Python (```lst[-1]``` is the last element). Indexing out of bounds in either direction raises a runtime error rather than silently returning something unexpected, so it's worth double-checking a computed index is in range before using it.

Several built-in functions work on lists: ```papapy``` returns how many items are in a list, ```jehupi``` appends an item to the end of one, and ```oguereko``` checks whether a value is contained in one.
```
lst = [1, 2, 3]
he'i papapy(lst) # prints 3

jehupi(lst, 4)
he'i lst # prints [1, 2, 3, 4]

he'i oguereko(lst, 2) # True
he'i oguereko(lst, 9) # False
```

Strings support the same three built-ins: ```papapy``` returns their length, ```[index]``` reads a single character, and ```oguereko``` checks for a substring. Strings are written with double quotes (```"..."```), and support the usual backslash escapes: ```\n``` (newline), ```\t``` (tab), ```\\``` (backslash), ```\"``` (a literal double quote inside the string) and octal escapes like ```\101```.
```
s = "hola"
he'i papapy(s)      # 4
he'i s[0]            # "h"
he'i oguereko(s, "ol") # True
```

Note that, unlike lists, strings in Yarara are not currently mutable through ```[index] = ...``` assignment — that form of assignment is reserved for lists. To transform a string, build a new one (with concatenation, or with ```myengovia```, covered a bit further down) and assign it back to the variable.

Strings can also span multiple lines just by including a literal newline inside the quotes, which is handy for things like multi-line file templates:
```
FILLCONTENT = "
[1] Walk the dog
[2] Buy groceries
[3] Rule the world
"
```

## Comparison Operators
Yarara supports the usual comparisons: ```==``` (equal), ```!=``` (not equal), ```<``` (less than), ```>``` (greater than), ```<=``` (less than or equal) & ```>=``` (greater than or equal). Each returns ```True``` or ```False```.
```
he'i 5 == 5  # True
he'i 5 != 3  # True
he'i 5 > 3   # True
he'i 5 < 3   # False
```

Comparisons work on numbers and strings alike (```"abc" < "abd"``` compares lexicographically the same way Python does), and the result can be stored in a variable, passed to a function, or used directly as the condition of a ```ramo```/```aja``` statement, since Yarara doesn't have a separate boolean literal syntax beyond the values ```True```/```False``` that these operators (and the built-in type-checking functions) produce.

Comparisons only chain one level deep — Yarara doesn't support Python-style chained comparisons like ```1 < x < 10```. To express a range check, combine two comparisons with ```ha``` (and), covered in the Logical Operators section below:
```
ramo x > 1 ha x < 10 {
    he'i "en rango"
}
```

## Math Operators
Besides ```+```, ```-```, ```*``` & ```/```, Yarara also has ```**``` (power) and ```%``` (modulo), and parentheses can be used to group expressions.
```
he'i 2 ** 10   # 1024
he'i 10 % 3    # 1
he'i (2 + 3) * 4 # 20
```

Operator precedence follows normal math conventions: ```**``` binds tighter than ```*```, ```/``` and ```%```, which in turn bind tighter than ```+``` and ```-```. ```**``` is right-associative, so ```2 ** 3 ** 2``` evaluates as ```2 ** (3 ** 2)``` (```512```), matching Python's behavior. ```+``` also works on strings as concatenation, which is used constantly throughout the standard library and examples to build up output text:
```
nombre = "Yarara"
he'i "Hola, " + nombre + "!" # "Hola, Yarara!"
```

Division (```/```) always produces a "true" division result the way Python 3's ```/``` does — dividing two integers can still produce a decimal result (```5 / 2``` is ```2.5```, not ```2```). If you need to round down to a whole number, reach for ```papapykuaa.floor``` or ```papapykuaa.trunc``` from the math library, covered later in the Standard Library section.

## Ternary Expressions
```cond ? a : b``` evaluates to ```a``` if ```cond``` is true, otherwise ```b```. It can be used anywhere a value is expected — inside a print, as a function argument, as part of a larger expression, or on the right-hand side of an assignment.
```
edad = 20
he'i edad >= 18 ? "adulto" : "menor"
```

Ternaries can be nested by putting another ternary inside the ```a``` or ```b``` branch, which lets you express a short chain of conditions without a full ```ramo```/```ambue ramo```/```ambue``` block:
```
nota = 85
letra = nota >= 90 ? "A" : nota >= 80 ? "B" : nota >= 70 ? "C" : "F"
he'i letra # "B"
```
As with any nested-conditional style, it's worth keeping these short — once a ternary chain gets past two or three branches, a regular ```ramo```/```ambue ramo``` chain (covered in Statements, below) usually reads more clearly.

## Converting Between Text & Numbers
```hu'ãva``` converts a value to text, and ```papapyrã``` converts text to a number (as an int or float, whichever fits).
```
he'i "edad: " + hu'ãva(25) # "edad: 25"
he'i papapyrã("42") + 1    # 43
```

These two are essential any time you want to mix numbers into a string with ```+```, since Yarara (like many languages) won't implicitly convert a number to text for you inside a concatenation — attempting to ```+``` a string and a raw number directly will raise a runtime error, so ```hu'ãva``` has to do the conversion first. ```papapyrã``` is the mirror image, and is exactly how the standard library turns text read from files, shell commands or user input back into numbers you can do arithmetic with — see, for example, ```json.getNumber``` in the Standard Library section, which is really just ```papapyrã``` wrapped around a text-returning query.

```papapyrã``` tries an integer parse first, then a float parse, and raises a runtime error if neither succeeds — so it's a good idea to validate untrusted input (e.g. with ```papapymi```, covered next) before feeding it to ```papapyrã``` if you want to handle bad input gracefully instead of crashing.

## Replacing Text
```myengovia(variable, old, new)``` replaces every occurrence of ```old``` with ```new``` inside a string variable, reassigning it in place.
```
saludo = "hola mundo"
myengovia(saludo, "mundo", "yarara")
he'i saludo # "hola yarara"
```

Unlike most of Yarara's built-ins, ```myengovia``` is a statement, not an expression that just returns a value — it directly mutates the named variable, similar to how ```IGUAL``` (```=```) assignment works, rather than requiring you to write ```saludo = myengovia(saludo, "mundo", "yarara")```. It only works on variables that currently hold a string; calling it on a variable holding a number or a list raises a runtime error. This is the mechanism the checklist example (see the Examples section) uses to mark a checklist item complete by swapping its number for an ```x``` inside the file's text content.

## Checking Types
Three built-in functions check what kind of value something is, each returning ```True``` or ```False```: ```ñe'ẽmi``` (is it text?), ```papapymi``` (is it a number?) & ```atymi``` (is it a list?).
```
he'i ñe'ẽmi("hola")   # True
he'i papapymi(5)      # True
he'i atymi([1, 2, 3]) # True
```

These are useful any time a value's type is uncertain — for example, when it came from user input (```ñehendu```), from a shell command's output (```okerayvu```), or from a function that might legitimately be called with more than one kind of argument. The color library's ```mod``` method (see Standard Library → Colors) uses ```ñe'ẽmi``` internally, together with ```nahániri``` (not), to bail out early and return a value unchanged if it isn't a string, rather than trying to wrap a non-string value in ANSI color codes.

## Reading Input
```ñehendu``` reads a line of input from the console. It optionally takes a prompt to show first, and automatically converts numeric input into a number instead of leaving it as text.
```
tera = ñehendu("Mba'éichapa nde réra? ")
he'i "Mba'éichapa, "
he'i tera

edad = ñehendu() # no prompt this time
he'i edad + 1 # works directly since numeric input is auto-converted
```

Internally, ```ñehendu``` tries to parse whatever the user typed as an ```int``` first, then as a ```float```, and only falls back to keeping it as plain text if neither parse succeeds — the same conversion strategy ```papapyrã``` uses. That means code that expects a number back from ```ñehendu``` doesn't need to manually call ```papapyrã``` on the result, but it also means you may want to check the result with ```papapymi``` or ```ñe'ẽmi``` first if the user could plausibly type something that isn't a number, so your program can respond sensibly instead of erroring out further down the line when it tries to do arithmetic on text.

## Statements
Statements are very similar to the ones used in Python, except they are translated to Guarani and use curly braces (```{}```) like in JavaScript, rather than Python-style indentation. That means whitespace and indentation are purely cosmetic in Yarara — they make code easier to read, but the interpreter doesn't care how a block is indented, only where its ```{``` and ```}``` are.

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
If statements use the keyword ```ramo``` ("if"), they work very similar to if statements in Python & JavaScript, with a condition immediately followed by a ```{ }``` block — no parentheses are required around the condition, and no colon follows it the way Python would use.
```
x = 10
# set variable x to 10

ramo x == 10 {
    # if x is equal to 10
    he'i "true!" # print "true!" to the console
}
```

### While Statements
While statements use the keyword ```aja``` ("while"), they repeat the code block for as long as a condition keeps evaluating to true, checking it again before every iteration — including the very first one, so a condition that's already false skips the loop body entirely, same as Python's ```while```.

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

Yarara currently has no dedicated ```break``` or ```continue``` keyword for loops. To exit a loop early from inside a function, use ```mbojevy``` (return, covered in the Functions section below) to leave the whole function — the Fibonacci-with-early-exit example later in this document shows exactly that pattern. Outside of a function, structure the loop condition itself (e.g. adding a flag variable that flips to stop the loop) to get the same early-exit effect.

### Else & Else If Statements
Else statements use the keyword ```ambue``` ("other"), Else if statements use the keyword ```ambue ramo``` ("other, if"), they work the same as else & else if statements in Python — a chain of conditions checked top to bottom, where only the first one that matches (or the final ```ambue```, if none match) actually runs.

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

You can chain as many ```ambue ramo``` blocks together as you like between the first ```ramo``` and an optional final ```ambue```, exactly like an ```if```/```elif```/.../```else``` chain in Python — the OS library's ```version``` method (see Standard Library → OS) is a real example of a three-way ```ramo```/```ambue ramo```/```ambue ramo``` chain used to branch on platform name.

## Functions & Return
Functions use the keyword ```japo``` ("to make"), followed by the function's name, then two round brackets ```( & )```. Inside the round brackets are the parameter names that get bound to whatever values the function is called with, e.g. ```japo suma(a, b)```, followed by a ```{ & }``` block holding the code the function runs when called.

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

Functions can also use the ```mbojevy``` ("to return") keyword to return a specific value for later use.

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

Calling a function with the wrong number of arguments raises a runtime error rather than silently filling in missing ones or ignoring extras — Yarara has no default parameter values or variadic (```*args```-style) parameters, so every call site has to pass exactly as many arguments as the function declares. Functions are also global once defined: a ```japo``` definition isn't scoped to the block it appears in, and functions can freely call each other, including calling themselves recursively.

A function without a ```mbojevy``` still returns a value when called from an expression context — it returns whatever its last statement evaluated to (or ```None``` if the body is empty or ends in a statement like an assignment that has no meaningful value of its own), the same way a ```ramo``` or ```aja``` block's overall value is whatever its last executed statement produced. In practice, most functions that are meant to hand back a result use an explicit ```mbojevy``` to make that intent clear.

## Classes
Classes use the keyword ```mbo'ehakoty``` ("school of thought" — used here for "class"), followed by the class name, followed by two curly braces (```{``` & ```}```) containing its methods. Methods inside a class body are written the same way as top-level functions, minus the ```japo``` keyword — just a name, a parameter list in parentheses, and a ```{ }``` body.

Inside a class, ```che``` ("I"/"me") refers to the current instance (like ```self```/```this``` in other languages). A method named ```ñepyrũ``` ("to begin") is special, since it is the constructor that runs once the instance is created.

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

```pyahu``` ("new") creates ("news up") an instance of a class, and ```.``` is used to access fields or call methods on that instance, e.g. ```a.tera``` or ```a.kunumi()```. A field doesn't need to be declared anywhere ahead of time — the first time a method assigns to ```che.algo```, that field springs into existence on the instance, exactly like assigning to a plain variable does at the top level.

If a class defines no ```ñepyrũ``` method at all, instances can still be created with ```pyahu```, but only with zero arguments — passing any arguments to ```pyahu``` for a class without a constructor raises a runtime error, since there's nowhere for those values to go.

### Inheritance
A class can inherit from another using ```ha'e``` ("is-a"), gaining all of its methods (including its constructor, if it doesn't define its own) plus any new ones it adds.

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

Only single inheritance is supported, a class can extend one parent, not several. Method lookup walks up the inheritance chain: if a method isn't found directly on the instance's own class, Yarara checks the parent class, then that class's parent, and so on, until it either finds the method or runs out of parents (at which point calling it raises a runtime error). A subclass can also override a method by simply defining a method with the same name — the subclass's version takes precedence, and there's currently no built-in way to also call the parent's overridden version from inside the override (no ```super```-equivalent), so an overriding method has to fully reimplement whatever behavior it needs.

The standard library's time module (```stdlib/core/aravo```, covered in Standard Library → Time) and color helper (```stdlib/core/sa'y```) are both plain examples of single classes with a constructor and a handful of methods, useful as a template for writing your own.

### A note on scope
Methods can't see plain variables from outside themselves, the only state a method can read or write across calls is through ```che```. Any variable assigned directly inside a method (without ```che.```) only exists for that one call and disappears once the method returns.

This is a deliberate, important distinction from top-level functions: a top-level ```japo``` function's local variables also disappear when it returns, but a method's *only* way to persist data between separate calls on the same instance is by storing it as a field on ```che```. If you write a counter method expecting a plain local variable to remember its value from the previous call, it won't — you'll need ```che.contador = che.contador + 1``` (with the field initialized in ```ñepyrũ```) instead of a bare ```contador = contador + 1```.

## And, Or & Not
Yarara comes packed with ```ha``` ("and"), ```térã``` ("or") & ```nahániri``` ("not"), these can be used to combine or invert conditions, just like ```&&```, ```||``` & ```!``` in other languages. ```ha``` and ```térã``` go between two conditions, while ```nahániri``` goes before a single condition.

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

```ha``` binds more tightly than ```térã```, so a mixed expression like ```a ha b térã c``` groups as ```(a ha b) térã c``` — the same precedence Python gives ```and```/```or```. When in doubt, or when an expression combines more than two conditions, wrap the parts you want grouped together in parentheses to make the intended grouping explicit rather than relying on memorized precedence rules. ```ha``` and ```térã``` are also both short-circuiting: for ```izquierda ha derecha```, if the left side is already false, the right side is never evaluated at all (and the reverse for ```térã``` when the left side is already true) — which matters if the right-hand side has a side effect, like a function call that prints something or modifies a variable.

## Comments
Comments use the hashtag (```#```) symbol, all code after it will not be ran.
```
he'i "Hello World!" # Comment <- Wont be ran

# Long comment <- Wont be ran either
```

There is no separate multi-line comment syntax — every line of a longer comment block needs its own leading ```#```, as seen throughout the standard library's source files, which use consecutive ```#```-prefixed lines as file-header comments describing what each module does.

## Running Python
Since Yarara is written in Python, the ```python``` keyword lets you drop into raw Python code for anything Yarara can't do on its own. It takes a string of Python source and executes it directly (it doesn't return a value back into Yarara).
```
python "import sys; sys.exit()"
```

Because the string is executed with Python's own ```exec```, it runs with access to the interpreter's own Python-level state, not Yarara's variable environment — a Python statement inside a ```python "..."``` block can't directly read or write a Yarara variable like ```x``` by name. Treat it as an escape hatch for things genuinely outside Yarara's reach (exiting the process, as in the OS library's ```ñesẽha``` method, is the standard library's own use of it) rather than as a general way to mix Python and Yarara logic together.

## Running Shell Commands
```okerayvu``` ("to speak/execute") runs a string as a shell command and returns its trimmed output as text. It's how most of the standard library talks to the OS.
```
he'i okerayvu("whoami")
he'i okerayvu("echo hola")
```

The command runs through the system shell (equivalent to Python's ```subprocess.run(..., shell=True)```), so ordinary shell syntax — pipes, redirects, environment variable expansion, and so on — all work exactly as they would if you typed the command directly into a terminal. Only standard output is returned (leading/trailing whitespace stripped); if the command fails or writes to standard error, ```okerayvu``` doesn't raise a Yarara-level error on its own, so code that depends on a command having succeeded should check its output (as, for example, ```os.plataforma()``` does, treating an empty result from ```uname``` as a signal that the platform must be Windows, where ```uname``` doesn't exist). Because the string is passed straight to the shell, avoid building commands by concatenating in raw, untrusted user input without thinking about shell-escaping — the same care you'd take with ```subprocess.run(shell=True)``` in Python applies here too.

## Imports
To import a library (built in or custom made), the ```pytaguañemu``` ("to make a hole through" — used here for "import") keyword is used. A path is resolved, in order: as an absolute path, relative to the ```.ya``` file doing the importing, relative to the Yarara project root (so ```stdlib/...``` always resolves no matter where you run from), and finally relative to your current working directory as a last resort.

```
pytaguañemu "stdlib/core/ijykegua"
```

You can leave off the ```.ya``` extension (as every example above does) — Yarara appends it automatically when resolving the path. Each module is only ever imported (tokenized, parsed and run) once per program, no matter how many times ```pytaguañemu``` is called on it from different files: Yarara tracks already-imported modules by their fully resolved path and silently skips a repeat import, which is what lets ```stdlib/core/path``` and ```stdlib/core/aravo``` both import ```stdlib/core/os``` internally without redefining the ```os``` class twice if your own program also imports ```stdlib/core/os``` directly.

Custom modules work exactly the same way as standard library ones — there's no special "library" designation, ```pytaguañemu``` just runs the target file's statements top to bottom in the current program's environment, so any classes, functions or top-level variables it defines become available afterward, precisely how the standard library modules define a class and then instantiate it into a conventionally-named variable (like ```os = pyahu osy()``` at the bottom of ```stdlib/core/os.ya```) for you to use right away without an explicit ```pyahu``` of your own.

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

```r.kyta()``` advances and returns the raw underlying integer state directly, if you need it; ```apytepe(michi, tuicha)``` and ```mbytepy()``` are both built on top of it and are the two methods you'll want for everyday use — an inclusive integer range, and a float between 0 and 1, respectively. Because the generator is seeded explicitly per-instance rather than globally, two ```Ijykegua``` instances created with the same seed will always produce the exact same sequence of values, which can be useful for reproducible tests.

### Colors (```stdlib/core/sa'y```)
Wraps text in ANSI color codes for the terminal, similar to Python's ```colorama```.
```
pytaguañemu "stdlib/core/sa'y"

he'i col("rojo", "red")
he'i col("verde", "green")
```
Supported colors: ```black```, ```red```, ```green```, ```yellow```, ```blue```, ```magenta```, ```cyan```, ```white``` & ```reset```. Passing any other string leaves the text unmodified rather than raising an error, and passing a non-string value also returns it unchanged, so ```col``` is safe to sprinkle around output-formatting code without worrying about crashing on an unexpected type. Under the hood, ```col``` is just a small convenience function that instantiates the ```Sa'y``` class with the requested color and calls its ```mod``` method — nothing stops you from instantiating ```Sa'y``` directly if you want to reuse the same color across several strings without repeating the color name each time.

### OS (```stdlib/core/os```)
Platform, user & system info, backed by ```okerayvu```.
```
pytaguañemu "stdlib/core/os"

he'i os.plataforma() # "Darwin", etc.
he'i os.user()       # current username
he'i os.version()    # OS version
he'i os.hostname()
he'i os.rekoShell()  # current shell
he'i os.cwd()
os.ñesẽha()          # exit the program
```

```os.plataforma()``` returns ```"Darwin"``` on macOS, ```"Linux"``` on Linux, or ```"Windows"``` (detected indirectly, since there's no equivalent shell builtin to ask directly) on Windows, and is the value most of the rest of the standard library branches on internally to pick the right shell command for the current OS. ```os.ñesẽha()``` terminates the whole program immediately via Python's ```sys.exit()``` under the hood (through the ```python``` interop keyword covered earlier) — nothing after the call runs.

### Path (```stdlib/core/path```)
File & directory operations.
```
pytaguañemu "stdlib/core/path"

path.haiArchivo("nota.txt")            # create an empty file
path.writeFile("nota.txt", "hola")     # write content to a file
he'i path.leeArchivo("nota.txt")       # read a file's content
he'i path.esArchivo("nota.txt")        # True if the file exists
path.mkdir("carpeta")                  # create a directory
he'i path.esDir("carpeta")             # True if the directory exists
path.rmdir("carpeta")                  # remove a directory
```

Every one of these methods works by shelling out to a platform-appropriate command through ```okerayvu``` (```touch```/```type nul```, ```cat```/```type```, ```test -f```/```if exist```, and so on) rather than using Python's own file APIs directly, keeping the whole library consistent with how the rest of ```stdlib/``` talks to the OS. A practical consequence worth knowing: ```writeFile``` overwrites a file's entire contents each time it's called (it does not append), so updating a file — as the checklist example does — means reading the current content first with ```leeArchivo```, modifying that text with something like ```myengovia```, and writing the whole updated string back with ```writeFile```. ```rmdir``` removes a directory and everything inside it recursively (```rm -rf``` on Unix-like platforms), so use it carefully — it does not ask for confirmation.

### Time (```stdlib/core/aravo```)
Timestamps and sleeping.
```
pytaguañemu "stdlib/core/aravo"

he'i aravo.ohupytyTiempo() # current unix timestamp
aravo.ke(1000)              # wait/sleep for 1000ms (1 second)
```

```aravo.ohupytyTiempo()``` ("to reach time") returns the current Unix timestamp (seconds since 1970) as text pulled from the shell's ```date```/PowerShell command — instantiating ```aravoy``` also stores this same value on ```che.start_time``` in the constructor, so an instance remembers when it was created if you want to measure elapsed time later. ```aravo.ke()``` ("to sleep") is the more interesting of the two: unlike everything else in the standard library, it doesn't shell out — it calls straight into a small compiled C function (```sys_sleep_ms```) through Yarara's native FFI (```ombohasa```, covered in its own section below), making it a good worked example to read if you're curious how native interop looks end-to-end in a real library rather than a toy snippet.

### JSON (```stdlib/core/json```)
Queries JSON text/files (Yarara has no dict type, so values are read out one field at a time rather than parsed into a native Yarara object).
```
pytaguañemu "stdlib/core/json"

data = json.load("datos.json")           # read a JSON file's raw text
he'i json.get(data, "nombre")             # get a string field
he'i json.getNumber(data, "version")      # get a numeric field
he'i json.oguereko(data, "nombre")        # True if the key exists
he'i json.papapy(data, "etiquetas")       # length of an array field
he'i json.item(data, "etiquetas", 0)      # an array field's item by index
```

Because Yarara has no dictionary/map type and no reflection over a class instance's own fields, this library can't parse JSON into a native Yarara value the way, say, Python's ```json.load``` returns a ```dict```. Instead, every query method writes the JSON text out to a shared temporary file and shells out to a one-line ```python3 -c "..."``` invocation (Python's own ```json``` module is always available alongside the Yarara interpreter, since Yarara itself is written in Python) to answer that one specific question against it — the same "shell out for what Yarara can't do natively" pattern the OS and Path libraries use, just aimed at a Python subprocess instead of a plain OS command. A consequence of that design: every ```json.*``` call in this library takes the *raw JSON text* (via ```data```, from ```json.load```) as its first argument, not a parsed structure, since there's no parsed structure to hold; each call re-reads and re-queries that text independently. Field names passed in are also automatically escaped against breaking out of the generated Python string, so ordinary key names with a stray single quote in them won't corrupt the shelled-out command.

### Math (```stdlib/core/papapykuaa```)
A full math library: constants (```pi```, ```tau```, ```e```), bounds (```abs```, ```sign```, ```min```, ```max```, ```clamp```), rounding (```floor```, ```ceil```, ```round```, ```trunc```, ```fract```), interpolation (```lerp```, ```smoothstep```), powers & roots (```pow```, ```sqrt```, ```cbrt```, ```hypot```), number theory (```factorial```, ```gcd```, ```lcm```, ```mod```), exponentials & logarithms (```exp```, ```ln```, ```log2```, ```log10```, ```log```), angle conversion (```degrees```, ```radians```), trigonometry (```sin```, ```cos```, ```tan```, ```asin```, ```acos```, ```atan```, ```atan2```) & hyperbolic functions (```sinh```, ```cosh```, ```tanh```).
```
pytaguañemu "stdlib/core/papapykuaa"

he'i papapykuaa.pi
he'i papapykuaa.sqrt(16)  # 4.0
he'i papapykuaa.sin(papapykuaa.pi / 2) # 1.0
he'i papapykuaa.gcd(48, 18) # 6
```

Unlike the rest of the standard library, ```papapykuaa``` is written entirely in pure Yarara, with no shelling out and no native calls at all — every transcendental function (```sin```, ```cos```, ```atan```, ```exp```, ```ln```, ...) is implemented from scratch as a Taylor/power-series approximation with range reduction, purely using the arithmetic operators and ```ramo```/```aja``` control flow covered earlier in this document. That makes it a genuinely useful thing to read through once you're comfortable with the basics of the language: it's a real, non-trivial Yarara program doing real numerical work, and a good demonstration of how far the base language (plus classes, for the ```che.pi```/```che.e``` style constant fields set up in its constructor) can go without needing any interop at all. Constants like ```pi```, ```tau``` (2π) and ```e``` are exposed both as top-level module constants and as fields on the ```papapykuaa``` instance (```che.pi```, etc.), so other methods within the class can reference them via ```che.pi``` while your own code just reads ```papapykuaa.pi``` directly.

## Calling Native C Code
Yarara can call functions from a compiled C shared library directly, using the built-in ```ombohasa``` ("to pass through/relay"):
```
ombohasa(ruta_kuatia, tembiapo_réra, tipo_aty, jevy_tipo, mba'e_aty)
```
- ```ruta_kuatia```: path to the compiled ```.so```/```.dll``` (resolved the same way imports are)
- ```tembiapo_réra```: the C function's name, as a string
- ```tipo_aty```: a list of the argument types, as strings
- ```jevy_tipo```: the return type, as a string
- ```mba'e_aty```: a list of the actual argument values to pass

Supported types: ```int```, ```ulong```, ```long```, ```float```, ```double```, ```str``` & ```void``` (return only). Under the hood, ```ombohasa``` loads the shared library with Python's ```ctypes.CDLL``` (caching it by resolved path, so calling into the same library repeatedly doesn't reload it every time), looks up the named function, sets its ```argtypes```/```restype``` based on the type strings you pass, converts each Yarara argument to the matching C representation (```str``` arguments are UTF-8 encoded to bytes, integer-ish types are coerced with Python's ```int()```), and finally calls the function and converts a ```str``` return value back from bytes to a Yarara string automatically.

C sources live in ```native/```, compiled into ```native/build/``` (e.g. with ```clang -shared -fPIC -O2 -o native/build/libos_native.so native/os_native.c```). ```stdlib/core/aravo.ya```'s ```ke``` (sleep) function is a real example of this in use:
```
ke(ms) {
    ombohasa("native/build/libos_native.so", "sys_sleep_ms", ["ulong"], "void", [ms])
}
```

Since ```ombohasa``` gives Yarara code direct, untyped-at-the-Yarara-level access to arbitrary compiled functions, it comes with the same caveats native FFI always does in any language: passing the wrong argument types, the wrong argument count, or a mismatched return type for what the underlying C function actually expects can crash the interpreter process outright (a segfault) rather than raising a catchable Yarara error, since by that point execution has left Yarara's own safety net entirely and is running raw C. Double-check the target function's real C signature against the ```tipo_aty```/```jevy_tipo``` strings you pass before relying on a native call in anything you care about not crashing.

## Examples
There is an examples folder in the [GitHub Repository](https://github.com/RandomGuy4114/Yarara). meant to be used as templates or for learning, you're welcome! It currently includes:
- ```fibonacci.ya``` — the loop-based Fibonacci function shown earlier in the Functions section, printing the first ```n``` Fibonacci numbers.
- ```mathtest.ya``` — a minimal one-liner that imports the math library and prints ```papapykuaa.pi```, a good starting point if you just want to confirm the math library is working.
- ```timetest.ya``` — imports the time library, sleeps for one second via ```aravo.ke(1000)```, then prints ```"hi"```, demonstrating the native-C-backed sleep call.
- ```fastfetch.ya``` — a small "fastfetch"/"neofetch"-style system info printer, combining the OS and color libraries, string concatenation, and a manually-built division line using a ```aja``` loop over string indexing, to render a colorized summary of the current machine.
- ```checklist.ya``` — a small interactive to-do list manager that ties together file I/O (```path```), color output (```sa'y```), console input (```ñehendu```), and text replacement (```myengovia```): it creates a ```checklist.txt``` file with default content the first time it's run, and on subsequent runs, lets you mark a numbered task as complete by rewriting its number to an ```x``` in the file.

Reading through ```checklist.ya``` and ```fastfetch.ya``` in particular is a good way to see most of the concepts in this document — variables, strings, loops, conditionals, function calls, and several standard library modules — working together in one small, complete program, rather than in isolated snippets.

## Contributing
I am not very good at the Guarani Language, and this is mainly just a project I made for fun, so if you find any spelling mistakes or any issues with the code, feel free to contribute!
