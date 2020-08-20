#!/bin/sh
# unwires the game from teloscope

game=$1

cd ..

echo connecting $game to webpack

gsed -i'' -E "s|entry: \{|&\n\t\t"$game": './src/games/"$game"/game.ts', \n\t\t"$game"_instructions: './src/games/"$game"/instructions.ts',|" webpack.config.js