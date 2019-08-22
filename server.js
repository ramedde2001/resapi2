const express = require('express');
const sharp = require('sharp');
var cloudinary =require('cloudinary').v2;
cloudinary.config({
	cloud_name:"ramedde",api_key:"816339956396372",api_secret:"K7cC5GmBWS3aAHwQ1ahkS47kcy8"
})
var {getofre,addofre,getusers,adduser,isvalidepasword,addvoiture,getvoiture}=require("./db.js")
const jwt = require('jsonwebtoken');
const app = express();
var bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
app.use(express.static('uploadimg'))

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.post('/uploadc',function(req,res){
	let sampleFile = req.files.file;
	res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
	cloudinary.uploader.upload(sampleFile.tempFilePath,function(err,result){
		if(err)
		{
			console.log(err)
		}
		res.send(result)
	})
	
	
})
	
app.post('/upload', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.file;
  let id=req.body.id;
  console.log(id)
let st=sampleFile.mimetype.split("/")[1]
console.log(st)
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./uploadimg/img'+id+"."+st, function(err) {
    if (err)
      return res.status(500).send(err);
if (st==="jpg")
{
	sharp('./uploadimg/img'+id+"."+st)
  .resize(300, 200)
  .toFile('./uploadimg/img'+id+".png", function(err) {
    // output.jpg is a 300 pixels wide and 200 pixels high image
    // containing a scaled and cropped version of input.jpg
  });
	
}
if (st==="jpeg")
{
	sharp('./uploadimg/img'+id+"."+st)
  .resize(300, 200)
  .toFile('./uploadimg/img'+id+".png", function(err) {
    // output.jpg is a 300 pixels wide and 200 pixels high image
    // containing a scaled and cropped version of input.jpg
  });
	
}
    res.send('File uploaded!');
  });
});

app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   next();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/',(req,res)=>{res.sendFile("C:\\xml\\resapi\\testapi.html")})

app.get('/users', (req, res) => {
	
});
app.get("/getvoitures",(req,res)=>{
	
	getvoiture(rows=>{res.send(JSON.stringify(rows))
	console.log(rows)
	})
})
app.get('/testapi.js', (req, res) => {
  return res.sendFile("C:\\xml\\resapi\\public\\testapi.js")
});
app.get('/users/:userId', (req, res) => {
  return res.send(users[req.params.userId]);
});
app.get('/messages', (req, res) => {
  return res.send(Object.values(messages));
});
app.post("/addv",urlencodedParser,(req,res)=>{
	const header = req.body.voiture.token
  
  jwt.verify(header,'privatekey',(err,decoder)=>{
	  if(err!==null)
		 {
	 	  res.statu=404
		  res.send(err)
		  
	     }  
		 else
			 console.log(req.body.voiture)
			 addvoiture(decoder.id,req.body.voiture.marque,req.body.voiture.anner,req.body.voiture.pris,req.body.voiture.url,req.body.voiture.km,req.body.voiture.model,(err)=>{
				 if(err!==null)
				 {
					 res.statu=404
			         res.send(err)
				 }
				 else
				 {
					 res.statu=200
			   
		             res.send("ok")
				 }
				 
			 })
	  
  })
})
	
	
	                                               
	
	


app.post('/adduser',urlencodedParser,(req,res)=>{
	console.log(req.body)
	adduser(req.body.user.username,req.body.user.pasword,req.body.user.email,req.body.user.phone,(err)=>
	{
		console.log(err)
			res.statu=200;
		res.send("user add")
		
	
	})
	
})
app.get("/ofere/:id",(req,res)=>{
console.log(req.params.id)
getofre(req.params.id,(err,rows)=>{
	
	if(err!==null)
	{
		res.statu=404;
		res.send(err)
	}
	else
	{
		res.statu=200;
		res.send(JSON.stringify(rows))
		
	}
	
})
})
app.post('/addofere',urlencodedParser,(req,res)=>{
	const header = req.body.tocken
	console.log(header)
	 jwt.verify(header,'privatekey',(err,decoder)=>{
		 if(err!==null)
		 {
	 	  res.statu=404
		  res.send(err)
		  
	     }  
		 else
		 {
		 addofre(req.body.voiture_id,decoder.id,req.body.pris,(err)=>
		 {
			 if(err!==null)
		 {
	 	  res.statu=404
		  res.send(err)
		  
	     }
		 else 
		 {
			  res.statu=404
		  res.send("offer add")
		 }
			 
		 }
		 
		 )
		 }
		 
	 })
	
	
})

app.post('/login',urlencodedParser,(req,res)=>	isvalidepasword(req.body.user.username,req.body.user.pasword,(pas,id)=>
	{
		
		if(pas)
		{
			user={username:req.body.user.username,pasword:req.body.user.pasword,id:id}
			console.log(user)
			
		jwt.sign(user, 'privatekey', { expiresIn: '5d' },(err, token) => {
                if(err) { console.log(err) } else
					{
						
res.status(200)						
                res.send(token);
					}
				
            });
	
		
	 
	}
else 
{
	console.log("wrong pasword"+pas)
	res.status(400)
	return res.send("wrong pasword")
	}}))

app.get('/messages/:messageId', (req, res) => {
  return res.send(messages[req.params.messageId]);
});
var port = process.env.port || 3000;
var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
