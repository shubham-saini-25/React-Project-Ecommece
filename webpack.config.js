module.exports = {
    // Other webpack configuration options...

    // Add the following lines to ignore the warning
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
                exclude: /node_modules\/(?!(html2pdf\.js)\/).*/,
            },
        ],
    },
};
