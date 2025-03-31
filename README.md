# Whim Game

Whim is a combinatorial game for two players 
devised by Joel David Hamkins.
The game begins with a finite number of piles of coins.
On each turn, you can remove a pile at your whim
and (optionally) replace it with any number of strictly
shorter piles. Whoever takes the last coin wins.

Although the original version of the game admits an
arbitrary number of piles, this implementation limits
the number of piles to 12.

## Installation

To play this game, simply run a web server in the source
directory. The instructions will vary depending on your
software environment. If you have `npm` installed, then run
the following commands:

    $ npm install
    $ npm run

You can also use Python's built-in HTTP server
as follows:

    $ python -m http.server

To run tests, you will need to install `npm` and then run
the following command:

    $ npm test

If you modify any of the JavaScript source files in the `src`
directory, then you should run the following command to rebuild
the bundled JavaScript file.

    $ npm run build


## Author

This program was written by David Radcliffe, with substantial
assistance from Claude AI and Github Copilot. Contributions
are welcome.