const readline = require('readline');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'date-ideas.json');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper function to ask questions
function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Load existing data
function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('No existing data found, starting fresh!');
    }
    return null;
}

// Save data
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Display the date ideas bank
function displayIdeasBank(data) {
    console.log('\n' + '='.repeat(50));
    console.log(`💕 ${data.userName} & ${data.partnerName}'s Date Ideas Bank 💕`);
    console.log('='.repeat(50));
    
    if (data.dateIdeas.length === 0) {
        console.log('\n📝 No date ideas yet! Add some below.\n');
    } else {
        console.log(`\n✨ You have ${data.dateIdeas.length} date idea(s):\n`);
        data.dateIdeas.forEach((idea, index) => {
            console.log(`${index + 1}. ${idea}`);
        });
        console.log('');
    }
}

// Main function
async function main() {
    console.log('\n💕 Welcome to Lovers & Friends - Date Ideas Bank! 💕\n');
    
    let data = loadData();
    
    // If no existing data, ask for names
    if (!data) {
        const userName = await question('What is your name? ');
        const partnerName = await question("What is your significant other's name? ");
        
        data = {
            userName: userName.trim(),
            partnerName: partnerName.trim(),
            dateIdeas: []
        };
        
        saveData(data);
        console.log(`\n✅ Great! Let's build a date ideas bank for ${data.userName} & ${data.partnerName}!\n`);
    } else {
        console.log(`\n👋 Welcome back, ${data.userName} & ${data.partnerName}!\n`);
    }
    
    // Main loop - keep asking for date ideas
    while (true) {
        displayIdeasBank(data);
        
        console.log('Options:');
        console.log('  - Type a date idea to add it to the bank');
        console.log('  - Type "delete [number]" to remove an idea');
        console.log('  - Type "reset" to start over with new names');
        console.log('  - Type "quit" or "exit" to close\n');
        
        const input = await question('> ');
        const trimmedInput = input.trim();
        
        if (!trimmedInput) {
            continue;
        }
        
        // Check for exit commands
        if (trimmedInput.toLowerCase() === 'quit' || trimmedInput.toLowerCase() === 'exit') {
            console.log('\n💕 Thanks for using Lovers & Friends! Happy dating! 💕\n');
            rl.close();
            break;
        }
        
        // Check for reset command
        if (trimmedInput.toLowerCase() === 'reset') {
            const confirm = await question('Are you sure you want to reset? This will delete all data. (yes/no) ');
            if (confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y') {
                fs.unlinkSync(DATA_FILE);
                console.log('\n🔄 Data reset! Restarting...\n');
                rl.close();
                // Restart the script
                require('child_process').spawn(process.argv[0], process.argv.slice(1), {
                    stdio: 'inherit'
                });
                break;
            }
            continue;
        }
        
        // Check for delete command
        if (trimmedInput.toLowerCase().startsWith('delete ')) {
            const indexToDelete = parseInt(trimmedInput.substring(7)) - 1;
            if (indexToDelete >= 0 && indexToDelete < data.dateIdeas.length) {
                const deletedIdea = data.dateIdeas.splice(indexToDelete, 1);
                saveData(data);
                console.log(`\n❌ Removed: "${deletedIdea[0]}"\n`);
            } else {
                console.log('\n⚠️  Invalid number. Please try again.\n');
            }
            continue;
        }
        
        // Add the date idea
        data.dateIdeas.push(trimmedInput);
        saveData(data);
        console.log('\n✅ Date idea added!\n');
    }
}

// Run the main function
main().catch(error => {
    console.error('An error occurred:', error);
    rl.close();
});

