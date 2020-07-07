
module.exports = {
    mode: 'development',
    watch: false,
    entry: {
        // game: './src/games/game.ts'
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
