const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require("child_process");

function run() {
    try {
        // execute bash script
        // `who-to-greet` input defined in action metadata file
        // const nameToGreet = core.getInput('who-to-greet');
        // console.log(`Hello ${nameToGreet}!`);
        // const time = (new Date()).toTimeString();
        // core.setOutput("time", time);
        
        console.log("Sample action executed!");

        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();