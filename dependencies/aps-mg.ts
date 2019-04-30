#!/usr/bin/env node
const minimist = require('minimist'); import * as bcrypt from 'bcrypt'; const fs = require('fs'); var format = require("string-template"); const camelCase = require('camelcase'); const CURR_DIR = process.cwd();
let args = minimist(process.argv.slice(2), {
    alias: { m: 'module', h: 'help', v: 'version', a: 'author', }, default: { help: false, version: 0.1, author: 'Ashish Sarode', module: 'aps' }, unknown: function () {
        console.log(`Please read help to know the parameter list can be use with aps-generate`);
    },
});
if (args.h) {
    console.log(`#AshishS - Module Generator#`);
    console.log(`****************************`);
    console.log(`Author:${args.a}\tVersion:${args.v}`);
    console.log(`****************************`);
    console.log(`\naps-generate -h  For Help
                \naps-generate -m  {module_name}  To create your module.
                \naps-generate -v  Version`);
} else {
    let modulePath = `${CURR_DIR}/api_modules/${args.m}`;
    if (fs.existsSync(modulePath)) {
        console.error(`${args.m} is already exists.`);

    } else if (args.m != 'aps') {
        args.m = camelCase(args.m, { pascalCase: true });
        fs.mkdirSync(modulePath); fs.mkdirSync(`${modulePath}/controllers`); fs.mkdirSync(`${modulePath}/models`);
        let routesText = format(`import * as express from 'express';\n\nconst router = express.Router();
                                \nrouter.get('/', function (req, res) {res.send('Welcome to {controllerName}Controller')});     
                                \nexport default router;`, { controllerName: `${args.m}Controller` });
        fs.writeFileSync(`${modulePath}/routes.ts`, routesText, 'utf8');
        let controllerText = format(`import BaseController from '../../base/controllers/BaseController';
                                     \nimport {modelName} from '../models/{moduleName}Model';
                                     \nexport default class UserController extends BaseController {
                                     \n\tmodel = {modelName};
                                     \n}`, { moduleName: `${args.m}`, modelName: camelCase(`${args.m}Model`) });
        fs.writeFileSync(`${modulePath}/controllers/${args.m}Controller.ts`, controllerText, 'utf8');
        let modelText = format(`import * as mongoose from 'mongoose';
                                 \nconst {moduleName}Schema = new mongoose.Schema({});
                                 \nconst {modelName} = mongoose.model('{modelName}', {moduleName}Schema);
                                 \nexport default {modelName};`, { moduleName: camelCase(`${args.m}`), modelName: `${args.m}` });
        fs.writeFileSync(`${modulePath}/models/${args.m}Model.ts`, modelText, 'utf8');

        console.log(`Created : ${modulePath}
        \nCreated : ${modulePath}/routes.ts
        \nCreated : ${modulePath}/controllers
        \nCreated : ${modulePath}/controllers/${args.m}Controller.ts
        \nCreated : ${modulePath}/models
        \nCreated : ${modulePath}/models/${args.m}Model.ts`);
    }
}
