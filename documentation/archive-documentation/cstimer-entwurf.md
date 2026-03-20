# analyze context

-> context diagram
![](communication.png)
# analyze pre-existing project
## structure
the main modules are in ./src: 
```bash
❯ tree -d
.
├── css
├── js            # <= HERE!
│   ├── hardware  # eg physical timers that can be attached
│   ├── lib
|   ├── js/lib/mathlib.js # <= HERE! - acctual solver. 
│   ├── ...
│   ├── scramble  # <= HERE! are the modules I use
│   ├── solver    # just helpers fore special puzzles
│   ├── stats     # ?
│   ├── timer     # functions around timing solves
│   ├── tools     # helper
│   └── twisty    # visualize cube
└── lang          # languages 
```

### scramble module: mathlib.js
- evtl puml fuer: create constelation (example) > reverse the solve to this consellation > generate according scramble sequence! 
- the core of the scramble-logic for all special scrambles is mathlib.js it is a more than 1500 lines file! luckilyi only need to now what kind of input it needs ...
  - this module works with pruning-tables. it acctually generates all possible solves once. these are 43 trillions! but because of redundancies it can be reduced down to a realistic 88 millions e.g. it does'nt matter wich corner is in hte up-front-right position, it can be any, it is just about relations between parts. this ist just for setting up special cases such as last layer only, where everyting is solved, exept the last layer. it would be impossible to use this on a 7x7 cube! but in my case i use it because i define the target constellation of the cube first and then the solver needs to generate a scramble sequence that bringst the cube into the targetted constellation. 

#### immediatley ivoked function expression in js 
```js
// mathlib begins like this:
var scramble_222 = (function(rn) {
//and ends like this:
})(mathlib.rn);
```

it gets run immediatley. 
later it can be called like: 
```js
var myScramble = scramble_222.generate();
```



# implement new feature

-> use case diagram
![](use-case.png)

# requirements

## overview

list of functional an hd non functional

## detailed

# process

-> activity diagram
![](activity.png)

![](state. popng)

## communication between modules

-> sequence diagram
![](comm_trainer_seq.png)

# software solution (code documentation)

- implementation
- code snippets

# reflection

- are the requirements met?

## was noch verbessert werden kann, weitere Schritte
