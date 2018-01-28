const fs = require('fs');

// .env file
if(fs.existsSync('.env')){
    console.log('Found .env file, moving forward')
} else {
    fs.createReadStream('.env.example').pipe(fs.createWriteStream('.env'));
    console.log('.env file created');
}