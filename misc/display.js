function loadingAnimation(
    followingText = "",
    animatationStages = [],
    stageLength = 100
) {
    let stage = 0;

    return setInterval(() => {
        process.stdout.write(`\r${animatationStages[stage++]} ${followingText}`);
        stage %= animatationStages.length;
    }, stageLength);
}

function displayServerRunning(port, message = "Server is up and running!") {
    const line = '══════════════════════════════════════';
    const serverMessage = message;
    const urlMessage = `Visit: http://localhost:${port}`;

    console.log(`\x1b[1m\x1b[36m╔${line}╗\x1b[0m`);
    console.log(`\x1b[1m${'║'}${' '.repeat((line.length - serverMessage.length) / 2)}${serverMessage}${' '.repeat((line.length - serverMessage.length) / 2)}\x1b[1m\x1b[36m${' ║'}\x1b[0m`);
    console.log(`\x1b[1m\x1b[36m║${line}║\x1b[0m`);
    console.log(`\x1b[1m${'║'}${' '.repeat((line.length - urlMessage.length) / 2)}\x1b[4m\x1b[32m${urlMessage}\x1b[0m${' '.repeat((line.length - urlMessage.length) / 2)}${'║'}\x1b[0m`);
    console.log(`\x1b[1m\x1b[36m╚${line}╝\x1b[0m`);

    loadingAnimation("Running...", ["🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔"]);
}

module.exports = displayServerRunning