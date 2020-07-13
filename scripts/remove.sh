#!/bin/sh
# removes the game (does not unwire it) TODO: move first in an archive folder and then clean it later

game=$1

echo removing game $game

cd ..

rm -rf views/$game

rm -rf src/games/$game

