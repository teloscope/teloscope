#!/bin/sh
# unwires the game from teloscope

game=$1

echo removing $game from webpack

gsed -i'' -E '/'$game'/d' webpack.config.js