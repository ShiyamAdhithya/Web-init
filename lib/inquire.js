const inquirer   = require('inquirer');
const files      = require('./files');

module.exports = {
	askQuestions: (currentDirectory = files.getCurrentDirectoryBase()) => {
		const questions = [
      {
        name: 'projectName',
        type: 'input',
        message: 'Enter project name?',
        default: currentDirectory
      },
      {
        name: 'version',
        type: 'input',
        message: 'version of the project?',
        default: '1.0.0'
      },
      {
        name: 'isPrivate',
        type: 'confirm',
        message: 'Is your project private?',
        default: 'false'
      },
      {
        name: 'description',
        type: 'editior',
        message: 'Description of the project>?',
        default: ''
      },
      {
        name: 'style',
        type: 'list',
        message: 'What type of styling to be included?',
        choices: ['CSS','SCSS','LESS', 'PostCSS'],
        default: 'SCSS'
      },
      {
        name: 'scriptStyle',
        type: 'list',
        message: 'Javascript version?',
        choices: ['plain','ES5','ES6'],
        default: 'ES6'
      },
      {
        name: 'assets',
        type: 'confirm',
        message: 'Includes images or any other assets?',
        default: true
      },
      {
        name: 'Fonts',
        type: 'confirm',
        message: 'Includes font files?',
        default: true
      },
      {
        name: 'multiPage',
        type: 'confirm',
				message: 'Is this project, muiltipage project?',
				default: false
			},
		];
		return inquirer.prompt(questions);
	}
};