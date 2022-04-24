const csvtojson = require('csvtojson'); 
const mongoose = require('mongoose'); 

const MONGODB_URI="connection_string";
const file = "file.csv";

mongoose.connect(MONGODB_URI)
.then(()=>{
    console.log('connected to MongoDB on ', MONGODB_URI)
})
.catch( err => {
    console.log('error connecting: ', err.message)
})

const entrySchema = new mongoose.Schema({
    location: { type: String }, 
    date: { type: Date }, 
    variant: { type: String }, 
    num_sequences: { type: Number }, 
    perc_sequences: { type: Number }, 
    num_sequences_total: { type: Number }
})

const Entry = mongoose.model('Entry', entrySchema)

const fileToArray = source => {
    const arr = [];
    for (let i=0; i<source.length; i++){
        const date = source[i]["date"]; 
        let [year, month, day ] = [...date.split("-")]; 
        month = month-1; 
        const row = {
            location: source[i]["location"], 
            date: date, 
            variant: source[i]["variant"], 
            num_sequences: +source[i]["num_sequences"], 
            perc_sequences: +source[i]["perc_sequences"], 
            num_sequences_total: +source[i]["num_sequences_total"], 
        }
        arr.push(row);
    }
    return arr;
}

csvtojson().fromFile(file).then(source => {
    const arrToInsert = fileToArray(source); 
    Entry.insertMany(arrToInsert)
        .then(res => console.log(`${res.length} inserted, success!`))
        .catch(err => console.log('error: ', err))
})