// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as vscode from 'vscode';
import { pascalCase } from 'case-anything';
import { join } from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "getx-pro" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('getx-pro.create-page', (args) => {
		if (!args.path) {
			vscode.window.showErrorMessage('Right click on folder name to specific whether to create page');
			return;
		}

		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInputBox({ placeHolder: 'Page name (Must be snake_case, eg: user_profile)' }).then(name => {
			if (!name) {
				return;
			}

			const folder = join(args.path, name);

			if (existsSync(folder)) {
				vscode.window.showErrorMessage(`${folder} already exists.`);
				return;
			}

			mkdirSync(folder);

			const dartClass = pascalCase(name);
			writeFileSync(join(folder, `${name}_state.dart`), createState(dartClass));
			writeFileSync(join(folder, `${name}_logic.dart`), createLogic(name, dartClass));
			writeFileSync(join(folder, `${name}_view.dart`), createView(name, dartClass));
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }


function createState(dartClass: string) {
	return `class ${dartClass}State {}`;
}

function createLogic(filename: string, dartClass: string) {
	return `import 'package:get/get.dart';

import '${filename}_state.dart';

class ${dartClass}Logic extends GetxController {
	final state = ${dartClass}State();
}`;
}

function createView(filename: string, dartClass: string) {
	return `import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '${filename}_logic.dart';

class ${dartClass}View extends GetView<${dartClass}Logic> {
	const ${dartClass}View({super.key});

	@override
	Widget build(BuildContext context) {
		// TODO: implement build
		throw UnimplementedError();
	}
}`;
}