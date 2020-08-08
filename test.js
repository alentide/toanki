const path = require("path");
const fs = require("fs");
const USER_HOME = process.env.HOME || process.env.USERPROFILE;
const notesPath = path.resolve(USER_HOME, "DailyNotes");
// \AppData\Roaming\Anki2\alentide\collection.media

const ankiStorePath = path.resolve(USER_HOME,`/AppData/Roaming/Anki2/${user}/collection.media`)
console.log(ankiStorePath)