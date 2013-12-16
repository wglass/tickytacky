tickytacky
==========

A simple web-based tic-tac-toe game!

Play it here: http://wglass.github.io/tickytacky/

Made with all the latest-and-greatest javascript stuff.

To create the unified/minified file, you must have grunt installed:
```
npm install -g grunt
```
Then to install the dependencies just run:
```
npm install
```
In the root of the checkout.

Running ``grunt`` with no arguments will run the linter and tests and
create a unified/minified file.

Tests can be run with ``grunt test``:
```
[ ~ ] $ grunt test
Running "jshint:files" (jshint) task
>> 11 files lint free.

Running "nodeunit:all" (nodeunit) task
Testing computer_tests.js.....................OK
Testing game_tests.js...........OK
Testing grid_tests.js...........OK
Testing player_tests.js..OK
>> 67 assertions passed (60ms)

Done, without errors.
```

The computer player is meant to have the perfect strategy listed here:

http://en.wikipedia.org/wiki/Tic-tac-toe#Strategy

So good luck!  If you win at all it's certainly a bug.

