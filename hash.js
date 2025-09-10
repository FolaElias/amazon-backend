const bcrybt = require('bcrypt');

async function run() {
    const salt = await bcrybt.genSalt(10);
    const hashed = await bcrybt.hash('1234', salt);
    console.log(hashed)
    console.log(salt)
} 
run();