var mysql = require('mysql');


var con = mysql.createConnection({
  host: "remotemysql.com",
  user: "odYcK3Q19I",
  password: "owKQDjrFnO",
  database: "odYcK3Q19I"
});
con.connect(function(err) {
  if (err) console.log(err)
})
function addofre(id_voiture,id_user,pris,callback)
{
	
	con.query( 'INSERT INTO ofers (id_voiture,id_user,pris) VALUES (?,?,?);',[id_voiture,id_user,pris],function(err){callback(err)})
	
	
	
}
function getuser( id ,callback)
{
	
	con.query("select * from users WHERE id =?;",[id],(err, rows ) => {
		if(err)
			console.log(err)
		else
		{
			
			callback(rows)
		}
	})
	
}
function addvoiture(id_user,marque,anner,pris,url,km,model,callback)
{
	
con.query ('INSERT INTO voitures (id_user,marque,anner,pris,url,klm,model) VALUES (?,?,?,?,?,?,?);',[id_user,marque,anner,pris,url,km,model],function(err){callback(err)
})
	
};
function getofre(id,callback)
{
	
	con.query("select * ,users.username from ofers INNER JOIN users ON ofers.id_user=users.id WHERE id_voiture=?",[id],(err,rows)=>{callback(err,rows)
	console.log(rows)})

}
function getusers()
{
	users=[]


  con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    console.log(result[0]);
	
 
});
}
function getvoiture(callback)
{
	
  con.query("select voitures.id,voitures.klm,voitures.model,voitures.marque,voitures.anner,voitures.pris,voitures.url,users.email,users.username from voitures INNER JOIN users ON voitures.id_user=users.id;",function (err, result, fields) {
	   
	   
	   callback(result)
	
	  
  })
  
  
  
  
  
	
	

}
function isvalidepasword(username,pasword,isvalid)
{

	con.query("select * from users WHERE username=? AND pasword=?;",[username,pasword],(err, rows ) => {
		if(err)
		{	console.log(err)
		
		}
		else
		{
			if(rows.length>0)
		 isvalid(rows.length>0,rows[0].id)
	
		}
		
})

	
}
  function adduser(usernam,pasword,email,phone,callback)
{

	con.query( 'INSERT INTO users (username,pasword,email,phone) VALUES (?,?,?,?);',[usernam,pasword,email,phone],(err)=>callback(err));
	con.end()

}
function replaceClientOnDisconnect(connection) {
  connection.on("error", function (err) {
    if (!err.fatal) {
      console.log('Databse Error, error not fatal');
      return;
    }

    if (err.code !== "PROTOCOL_CONNECTION_LOST") {
      throw err;
      console.log('PROTOCOL_CONNECTION_LOST Error: Reconnecting to database...');
    }

    setTimeout(function () {
        connection.destroy();
        connection = mysql.createConnection({
  host: "remotemysql.com",
  user: "odYcK3Q19I",
  password: "owKQDjrFnO",
  database: "odYcK3Q19I"
});
        replaceClientOnDisconnect(connection);
        connection.connect(function (error) {
          if (error) {
            process.exit(1);
          } else {
              console.log('Reconnected to database!');
          }
    }, 1000); // 1 sec
    });
  });
}

// And run this on every connection as soon as it is created.
replaceClientOnDisconnect(con);

module.exports.getofre=getofre
module.exports.addofre=addofre
module.exports.getvoiture=getvoiture
module.exports.addvoiture=addvoiture
module.exports.adduser=adduser
module.exports.getusers=getusers
module.exports.getuser=getuser
module.exports.isvalidepasword=isvalidepasword