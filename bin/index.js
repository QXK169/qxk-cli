#!/usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");
const shell = require("shelljs");
const figlet = require("figlet");
const config = require("../config/config");

const logotext = figlet.textSync("qxk");
//提取version
const version = `${logotext}  ${require("../package").version}`;
program.version(version).usage("<command> [options]");

program
  .command("create <app-name>")
  .description("create a new project")
  .option("-f, --force", "Overwrite target directory if it exists")
  .option("-c, --clone", "Use git clone when fetching remote preset")
  .action((name, cmd) => {
    console.log(name, cmd);
    createApp(name);
  });

program.parse(process.argv);

function createApp(name) {
  let questions = [
    {
      type: "list",
      name: "template",
      message: "Select a template",
      choices: [
        {
          name: "vue-h5",
          value: "vue-h5",
          description: "vue template",
        },
        {
          name: "vue-admin",
          value: "vue-admin",
          description: "vue template",
        },
        {
          name: "react-h5",
          value: "react-h5",
          description: "react template",
        },
        {
          name: "react-admin",
          value: "react-admin",
          description: "react template",
        },
      ],
    },
  ];
  if (!name) {
    questions.shift({
      type: "input",
      name: "projectName",
      message: "Project name:",
    });
  }
  inquirer.prompt(questions).then((answers) => {
    // 处理命令行
    const { projectName = "demo-template", template } = answers;
    if (!shell.which("git")) {
      shell.echo("Sorry, this script requires git");
      shell.exit(1);
    }

    const gitUrl = config[template];

    const result = shell.exec(`git clone ${gitUrl} ${projectName}`);

    figlet("Success", function (err, data) {
      if (err) {
        console.dir(err);
        return;
      }
      console.log(data);
      console.log(`cd ${projectName} \n`);
      console.log("npm install \n");
      console.log("npm run dev");
    });
  });
}
