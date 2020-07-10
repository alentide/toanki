const http = require('./index.js')

async function  deleteNotes(id){
    const result = http.post('/',{
        "action": "deleteNotes",
        "version": 6,
        "params": {
            "notes": [id]
        }
    })
    return result
}

async function addNotes(notes){
    const result = await http.post("/", {
        action: "addNotes",
        version: 6,
        params: {
            notes: notes
        }
    });
    return result
}


async function updateNoteFields(note){
    const result = await http.post("/", {
        action: "updateNoteFields",
        version: 6,
        params: {
            note: note
        }
    });
    return result
}

async function sync(){
    const result = await http.post('/',{
        "action": "sync",
        "version": 6
    })
    return result
}

module.exports = {
    deleteNotes,
    addNotes,
    updateNoteFields,
    sync
}