#!/bin/sh
# removes the game (does not unwire it)

game=$1

echo removing game $game

cd ..

mkdir archive/$game

mv -rf views/$game archive/$game

mv -rf src/games/$game archive/$game

