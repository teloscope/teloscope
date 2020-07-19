
module.exports = {
    mode: 'development',
    watch: false,
    entry: {
		beta: './src/games/beta/game.ts', 
		beta_instructions: './src/games/beta/instructions.ts',
        alpha: './src/games/alpha/game.ts',
        alpha_instructions: './src/games/alpha/instructions.ts',
        delta: './src/games/delta/game.ts',
        delta_instructions: './src/games/delta/instructions.ts',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist',
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ],
            },
        ],
    },
};

