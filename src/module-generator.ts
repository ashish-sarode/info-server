#!/usr/bin/env node
const CURR_DIR = process.cwd();
console.log(CURR_DIR);

const minimist = require('minimist');
const fs = require('fs');

let args = minimist(process.argv.slice(2), {  
    alias: {
        m: 'module',
        h: 'help',
        v: 'version',
        a: 'author',
       
    },
    default: {
        help: false,
        version: 0.1,
        author:'Ashish Sarode',
        module:'mymodule'
    },    
});

if(args.h){
    console.log(`Module Generator\n***********\nVersion:${args.v}\nAuthor:${args.a}\n***********\n-h  For Help\n-m  {module_name}  To create your module.\n-v  Version`);
}else{
    console.log(args);

    fs.mkdirSync(`${CURR_DIR}/api_modules/${args.m}`);
    fs.mkdirSync(`${CURR_DIR}/api_modules/${args.m}/controllers`);
    fs.mkdirSync(`${CURR_DIR}/api_modules/${args.m}/models`);
    fs.writeFileSync(`${CURR_DIR}/api_modules/${args.m}/routes.ts`, '', 'utf8');
}
//https://medium.com/northcoders/creating-a-project-generator-with-node-29e13b3cd309
//https://stackoverflow.com/questions/5951302/node-js-code-protection