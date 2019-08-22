var state={ login:false
,token:"",
username:""
}
function sendmessag(pasword,username)
{
let tok="";
fetch('/messages', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        user: {
            username: username,
            pasword: pasword
        }
    })
}).then(req=>req.text()).then(text=>
{
state.login=true;
state.token=text
state.username=username
document.getElementById("loginf").style.display="none"
var para = document.createElement("p");
var node = document.createTextNode("login as "+username);
para.appendChild(node);
var inp = document.createElement("input");
var nod = document.createTextNode("sendmsg");

var bu =document.createElement("button");
bu.appendChild(nod)
var element = document.getElementById("div1");
element.appendChild(para);
element.appendChild(inp)
element.appendChild(bu);
fetch('/dashbord', {
  method: 'GET',
  headers: {
    'Authorization': text
  }
}).then(req=>req.json()).then(re=>console.log(re))

}



)

} 
function send()
{
var pasword=document.getElementById("h").value ;
var username=document.getElementById("user").value ;
sendmessag(pasword,username)
}