const app = require('express')();
var cors = require('cors');
var bodyParser = require('body-parser')
// const app = express()
const port = 9000
const fs = require('fs');
app.use(cors());
 // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.get('/', (req, res) => res.send('Hello World!'))

app.get('/toolsDetails', (req,res)=>{
    fs.readFile('./data/Tools.json', (err, data) => {  
        if (err) throw err;
        let JsonData = JSON.parse(data);
        res.status(200).json(JsonData )
    });
    
})
app.post('/createFile', (req,res)=>{
    let fileName= `tools_${req.body.projectId}`;
    let jsonData = JSON.stringify( req.body);
    let url = `./data/createFile/${fileName}.json`
fs.writeFile(url, jsonData, 'utf8', function (err) {
    if (err) throw err;
   res.send({message:"submitted successfully"})
  });
})
app.get('/viewTools/:projectId', (req,res)=>{
    let projectId = req.params.projectId;
    let fileName =  `tools_${projectId}` 
    fs.readFile(`./data/createFile/${fileName}.json`, 'utf8', function readFileCallback(err, data){
        if (err){
            res.status(400).send({message:"Not found"});
        } else {
        toolsJson = JSON.parse(data); //now it an object
        //obj.table.push({id: 2, square:3}); //add some data
        res.send(toolsJson.selectedToolsList);
    }
    });
})
app.get('/allToolsActivities', (req,res)=>{
    fs.readFile(`./data/toolsActivities/toolsActivities.json`, 'utf8', function readFileCallback(err, data){
        if (err){
            res.status(400).send({message:"Not found"});
        }
        else{
            res.send(data);
        }
    })
})
app.listen(port, () => console.log(`api listening on port ${port}!`))