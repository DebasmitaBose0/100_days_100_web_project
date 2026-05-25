const input = document.getElementById('commandInput');
const outputArea = document.getElementById('outputArea');
const terminalBody = document.getElementById('terminalBody');

// Ensure clicking anywhere in the terminal focuses the input
terminalBody.addEventListener('click', () => {
    input.focus();
});

input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const cmd = input.value.trim();
        if (!cmd) return;

        // Echo the command to the screen
        printLine(`user@macbook ~ % ${cmd}`, 'user-cmd');

        // Disable input while processing
        input.value = '';
        input.disabled = true;

        await processCommand(cmd);

        // Re-enable input
        input.disabled = false;
        input.focus();
        scrollToBottom();
    }
});

async function processCommand(cmd) {
    const command = cmd.toLowerCase();

    switch (command) {
        case 'help':
            printLine("Available commands:", 'system-msg');
            printLine("  fetch --joke      : Get a programming joke", 'highlight');
            printLine("  sudo entertain_me : Bypass permissions to get a joke", 'highlight');
            printLine("  roast             : Interactively roast your own code snippet!", 'highlight');
            printLine("  clear             : Clear the terminal output", 'highlight');
            break;

        case 'clear':
            outputArea.innerHTML = '';
            break;

        case 'fetch --joke':
        case 'sudo entertain_me':
            await fetchProgrammingJoke();
            break;

        case 'roast':
            printLine("Enter the line of code you want roasted: (e.g. 'while(true) {}')", 'system-msg');
            input.placeholder = "type code snippet here...";
            break;

        default:
            if (input.placeholder === "type code snippet here...") {
                input.placeholder = "";
                await roastCode(cmd);
            } else {
                printLine(`bash: command not found: ${cmd}`, 'error-msg');
                printLine(`Type 'help' for available commands.`, 'system-msg');
            }
    }
}

async function fetchProgrammingJoke() {
    try {
        printLine("Connecting to JokeAPI v2...", 'system-msg');

        // Safe query: Programming category only, filtering out NSFW/political/etc.
        const response = await fetch('https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit');
        const data = await response.json();

        if (data.error) throw new Error("API Error");

        if (data.type === 'single') {
            // Single liner joke
            await typeWriter(data.joke, 'joke-punchline');
        } else {
            // Two-part joke: Setup -> Pause -> Punchline
            await typeWriter(data.setup, 'joke-setup');

            // Create a temporary element for the thinking animation
            const thinkingDiv = document.createElement('div');
            thinkingDiv.className = 'typing-indicator';
            thinkingDiv.textContent = '...';
            outputArea.appendChild(thinkingDiv);
            scrollToBottom();

            // Wait 2 seconds for comedic timing
            await sleep(2000);

            // Remove the '...' and print punchline
            thinkingDiv.remove();
            await typeWriter(data.delivery, 'joke-punchline');
        }

        // Add a line break after the joke finishes
        printLine("", "");

    } catch (error) {
        printLine("Error: Failed to fetch joke. Are you connected to the internet?", 'error-msg');
    }
}

async function roastCode(code) {
    printLine("Analyzing code structure...", 'system-msg');
    await sleep(800);

    const roasts = [
        "Your code is so messy, even git clone refuses to download it.",
        "That logic is so circular, it got nominated for an Oscar in cinematography.",
        "You write code like a toddler playing with random keyboard buttons.",
        "Is this JavaScript or did a cat just step on your keyboard?",
        "This code looks like it was written in 1995, but without any of the retro charm.",
        "I've seen better structured code in a bowl of alphabet soup.",
        "If compile time was a race, your code would still be putting its shoes on.",
        "This function is so long and nested, it has its own zip code."
    ];

    const randomIndex = Math.floor(Math.random() * roasts.length);
    const chosenRoast = roasts[randomIndex];

    await typeWriter(`[Roast]: ${chosenRoast}`, 'joke-punchline');
    printLine("", "");
}

// Utility function to print static text immediately
function printLine(text, className) {
    const div = document.createElement('div');
    div.textContent = text;
    if (className) div.className = className;
    outputArea.appendChild(div);
    scrollToBottom();
}

// Utility function to create a typing effect
async function typeWriter(text, className) {
    const div = document.createElement('div');
    if (className) div.className = className;
    outputArea.appendChild(div);

    for (let i = 0; i < text.length; i++) {
        div.textContent += text.charAt(i);
        scrollToBottom();
        // 30ms delay between characters for terminal speed
        await sleep(30);
    }
}

// Keep the terminal scrolled to the bottom
function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Simple Promise-based sleep function for async/await
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));