# Documentation

## Introduction

<!--TODO:
- preexisting software: csTimer
- need for the system / motivation for the feature
- functions of the new scrambler
- fit for the strategy of the application (training tool for speedcubing)

Diagram idea:
- small System Context Diagram
  showing:
  user -> csTimer -> scramble generator
-->

## User Requirements Definition

<!-- TODO:
- services for the user
- user can select a scramble type for 3BLD corner permutation training
- user receives random training cases for corner commutators

Diagram idea:
- Use Case Diagram
  Actor: User
  Use cases:
    - select scramble type
    - generate scramble
    - start training session
-->

### Non-functional System Requirements

<!-- TODO:
- fast scramble generation
- usability within the existing csTimer interface
- compatibility with existing scramble system
-->

<!-- Optional:
User Stories

Example:
As a speedcuber,
I want to generate random 3BLD corner permutation cases,
so that I can practice corner commutators efficiently.
-->

## System Architecture

<!-- TODO:
- short overview of the csTimer architecture
- description of the scramble generator subsystem
- explanation where the new scrambler module integrates

chatgpt:
- welche **Komponenten** es gibt
    
- **welche Verantwortung** jede Komponente hat
    
- **wie sie miteinander kommunizieren**
    
- **welche Technologien** verwendet werden
    
- **wie Daten durch das System fließen**
 
Diagram idea:
- Component Diagram

csTimer
  ├── UI
  ├── Timer
  └── Scramble Generator
        ├── existing scramblers
        └── NEW: 3BLD corner permutation scrambler
-->
```sh
❯ tree -d .
.
├── dist
│   ├── css
│   ├── js
│   └── lang
├── documentation
│   ├── archve
│   ├── puml
│   └── skizzen
├── experiment
├── lib
      └── testbench
├── npm_export
│   └── testbench
└── src
    ├── css
    ├── js
    │   ├── hardware
    │   ├── lib
    │   ├── scramble
    │   ├── solver
    │   ├── stats
    │   ├── timer
    │   ├── tools
    │   └── twisty
    └── lang

```

i

## System Requirements Specification

### Functional Requirements

<!-- TODO:
- generation of valid 3BLD corner permutation cases
- randomization of cases
- integration with the existing scramble selection
- compatibility with csTimer scramble format
-->

### Nonfunctional Requirements in More Detail

<!--TODO:
- product and process standards
- performance requirements
- maintainability
-->

### Interfaces

<!-- TODO:
- interaction with scramble generator
- interface to the user interface (scramble selection)

Diagram idea:
- Sequence Diagram

User -> UI -> Scramble Generator -> Corner Scrambler -> UI -> User
-->

## Algorithm / Process (optional section)

<!-- Diagram idea:
Activity Diagram

Steps:
1. user selects scramble type
2. system calls scrambler module
3. generate random corner permutation
4. convert permutation to scramble
5. display scramble
-->

## testing

