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
            if (typeof idea === 'string') {
                // Old format - just a string
                console.log(`${index + 1}. ${idea}`);
            } else {
                // New format - object with both partners' inputs
                console.log(`${index + 1}. ${idea.category}`);
                console.log(`   ${data.userName}'s idea: ${idea.userInput}`);
                console.log(`   ${data.partnerName}'s idea: ${idea.partnerInput}`);
            }
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
        console.log('  - Type "add" to add a date idea with both partners\' input');
        console.log('  - Type "done" to finish your idea thinking');
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
                const ideaText = typeof deletedIdea[0] === 'string' ? deletedIdea[0] : deletedIdea[0].category;
                console.log(`\n❌ Removed: "${ideaText}"\n`);
            } else {
                console.log('\n⚠️  Invalid number. Please try again.\n');
            }
            continue;
        }
        
        // Check for add command (with both partners' input)
        if (trimmedInput.toLowerCase() === 'add') {
            console.log('\n💡 Adding a new date idea...\n');
            const dateCategory = await question('Date idea? ');
            
            if (!dateCategory.trim()) {
                console.log('\n⚠️  Date idea cannot be empty.\n');
                continue;
            }
            
            console.log('');
            const userInput = await question(`${data.userName}, input your ideas: `);
            
            console.log('');
            const partnerInput = await question(`${data.partnerName}, input your ideas: `);
            
            const newIdea = {
                category: dateCategory.trim(),
                userInput: userInput.trim(),
                partnerInput: partnerInput.trim()
            };
            
            data.dateIdeas.push(newIdea);
            saveData(data);
            console.log(`\n✅ Date idea added!\n`);
            continue;
        }

        if (trimmedInput.toLowerCase() === 'done') {
            console.log('\n💡 Done adding date ideas!\n');
            rl.close();
            break;
        }
        
        // If none of the commands matched, show help
        console.log('\n⚠️  Unknown command. Please use "add", "done", "delete [number]", "reset", or "quit".\n');
    }
}

// Run the main function
main().catch(error => {
    console.error('An error occurred:', error);
    rl.close();
});

