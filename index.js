const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const Spinner = require('clui').Spinner;

//const files = require('./lib/files');




clear();
console.log(
	chalk.yellow(
		figlet.textSync('Webinit', { horizontalLayout: 'standard' })
  )
);

// if (files.fileExists('package.json')) {
//     console.log(chalk.red('Already a Node Project'));
//     process.exit();
// }


const inquirer = require('./lib/inquire');

const Init = async () => {
  const Options = await inquirer.askQuestions();

  if (Options) {
	console.log(Options);
	const Status = new Spinner('Creating Project');
	Status.start();

	setTimeout(() => {
	  Status.stop();
	}, 2000);
  }
};

Init();



