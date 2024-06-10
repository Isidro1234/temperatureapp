import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import axios from 'axios';

const app = express();
const port = 3000;
const URL ='https://api.open-meteo.com/v1/forecast?';
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let data = ['29.739204','-95.573309']
async function weather(num){
    const response = await axios.get(URL +`latitude=${parseFloat(num[0])}&longitude=${parseFloat(num[1])}&hourly=temperature_2m`);
    const result = await response.data;
    return result; 
}

app.get("/", async(req, res)=>{
    const results = await weather(data);
    res.render("index.ejs", {content:results});
})
app.post("/submit", async (req, res)=>{
    data = req.body['location'].split(" ");
    const results = await weather(data);
    const calcdateindex = results.hourly.time.findIndex((dates)=> dates === data[2]);
    console.log(results);
    console.log(data);
    console.log(calcdateindex);
    res.render("index.ejs", {contents: results, number: calcdateindex})
})

app.listen(port,()=>{
    console.log(`this app is running on port ${port}`);
})