const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require("child_process");

export function run() {
    try {
        // execute bash script
        // `who-to-greet` input defined in action metadata file
        // const nameToGreet = core.getInput('who-to-greet');
        // console.log(`Hello ${nameToGreet}!`);
        // const time = (new Date()).toTimeString();
        // core.setOutput("time", time);
        // // Get the JSON webhook payload for the event that triggered the workflow
        // const payload = JSON.stringify(github.context.payload, undefined, 2)
        // console.log(`The event payload: ${payload}`);
        console.log("Sample action executed!");

        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

export function cleanup() {
    try {
        console.log("Clean up executed!");
    } catch (error) {
        core.warning("clean up failed...")
    }
}