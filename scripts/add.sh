#!/bin/sh
# adds a game from the teloscope org and migrates it to this repo

game=$1

echo adding game $game

echo getting latest version of $game

cd ..

git clone git@github.com:teloscope/$game game

mv game/game src/games

rm -rf src/games/$game

mv src/games/game src/games/$game

rm -rf views/$game

mv game/views views 

mv views/views views/$game

rm views/$game/header.pug

rm views/$game/end.pug

rm views/$game/style.css

cp views/review_template.pug views/$game

mv views/$game/review_template.pug views/$game/review.pug

mv game/router.js routes/games/$game.js

# We perform a series of find and replace to make sure that the game is correctly wired to the rest of the platform

find views/$game -type f -name "*.pug" -exec perl -i -pe's/extends header/extends ..\/header/g' {} \;

find views/$game -type f -name "*.pug" -exec perl -i -pe's|"/game"|"/dev/'$game'/game"|g' {} \;

find views/$game -type f -name "*.pug" -exec perl -i -pe's|"instructions.js"|"/'$game'_instructions.js"|g' {} \;

find views/$game -type f -name "*.pug" -exec perl -i -pe's|"game.js"|"/'$game'.js"|g' {} \;

find src/games/$game -type f -name "*.ts" -exec perl -i -pe's|"/end"|"/dev/'$game'/review"|g' {} \;

find src/games/$game -type f -name "*.ts" -exec perl -i -pe's|"/game"|"/dev/'$game'/game"|g' {} \;

rm -rf game

echo game successfully added but not yet wired into teloscope, please:
echo 1. add routes in routes/dev.js
echo 2. build game.ts by adding it to webpack.config.js
echo 3. add appropriate links in the header.pug
echo 4. flesh out the review template for the end of the game
echo 5. make any other changes if the game is outside the usual template