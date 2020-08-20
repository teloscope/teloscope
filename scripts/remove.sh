#!/bin/sh
# removes the game (does not unwire it)

game=$1

echo removing game $game

cd ..

# replace existing archive
rm -rf archive/$game

mkdir -p archive/$game

mv views/$game/ archive/$game/views

mv src/games/$game/ archive/$game/src

mv routes/games/$game.js archive/$game/routes.js

