# Tic Tac Toe Browser Game

_The best tic tac toe game ever made!_

A Tic Tac Toe game versus a very dumb AI or a very smart AI.

## What I learned during this project

This was a big project I struggled alot during my Javascript journey.

Some of the topics I learned alot about:

- Factory Functions vs Constructors
- Closures and scope
- Module pattern and IIFEs
- Encapsulating code from the global namespace
- AI programming
- Basic markdown styling for this readme
- HTML dialog element.

## Some general thoughts

I am happy the project turned out well considering how much I initially struggled. My initial struggle was mostly related to private variables, closures and the module pattern. Once I got my head around this, things started to move faster and code was getting typed in hyperspeed (ok im a exag a bit here, but let me enjoy my dopamin kick for while).

**Another big struggle I had:** I initially thought that programming the game to be played against a computer would be much easier to program it instead of a turnbased player game (1v1).

Oh boy was I wrong. I didnt realize until later that this wasn't required but once I was commited, I wasn't going to give up.

### My thoughts on the AI

Initially my AI was very stupid and was just making random moves on the board. I did most of the AI logic using a `do... while` loop. But as I played the game I realized it was superboring without a challenge. So I embarked on coding a "hard" version of the game. I struggled alot here trying to figure it out. I reverted to using free AI tools to help me out here (the irony). The solution was to loop the board and manually check every row and column on the board before the computer play. The loop checks for any winning move first the computer can play, then it checks for any blocking moves it can play. If it finds either, it then plays a random move using my do while loop.

I had during my research stumbled upon other solutions that was alot cleaner, but I was already commited to my AI logic from the console version and a bit into the browser version. Unfortunately my AI logic code is probably not very maintainable due to the sheer length of it.

## Bugs

There is potentially a bug related to the checkWinner function I have not been able to reproduce. It's likely because I missed to do an empty return or break somewhere in the code. It could also just be an issue related to VS code live server extension or chrome browser.

## Potential improvements

Instead of only playing vs AI, one could add functionality for also playing vs human, player vs player mode.

**Style of the game:** This game is usually played with pen and paper. I could maybe return and change the styling and animations to resemble pen and paper to give it a more nostalgic feel.
