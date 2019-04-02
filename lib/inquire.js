const inquirer   = require('inquirer');

module.exports = {
	askQuestions: (projectName) => {
		const questions = [
      {
        name: 'projectName',
        type: 'input',
        message: 'Enter project name?',
        default: projectName
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
      {
        name: 'dependencies',
        type: 'checkbox',
				message: 'Select the wanted dependencies?',
				choices: [
          {
            name: 'jquery',
            checked: true
          },
          {
            name: 'popper.js',
            checked: true
          },
          {
            name: 'bootstrap',
            checked: true
          },
          
        ]
			},
		];
		return inquirer.prompt(questions);
	}
};