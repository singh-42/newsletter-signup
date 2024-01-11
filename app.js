const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",function(req,res){
    res.sendFile(__dirname+ "/signup.html");
});

app.post("/",function(req,res){
    const firstname=req.body.fname;
    const secondname=req.body.lname;
    const email=req.body.email;
   
    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstname,
                    LNAME:secondname
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data);

    const url="https://us21.api.mailchimp.com/3.0/lists/f5a87263ba";

    const options={
        method:"post",
        auth:"kris:df399bc5a45fbb5738c76f4f9kijbfd8a-us21"
    }

    const request=https.request(url,options,function(response){
        console.log(response.statusCode)
        if(response.statusCode==200){
                res.sendFile(__dirname +  "/success.html")
            }
        else{
                res.sendFile(__dirname + "/failure.html")
        }

        //error:unexpected end of input
        let body='';
        response.on("data",function(data){
           body+=data;
        })
        response.on("end",function(){
            var resp=JSON.parse(body);
         console.log(resp);
            
            
        })

    })
     request.write(jsonData);
     request.end();
});

//using static option to use local files
app.use(express.static("public"));


//seting up another get menthod for failure route button 
app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(req,res){

    console.log("server is up and running");
}) 

// apikey mailchimp :df399bc5a45fbb5738c76f4f9a2bfd8a-us21
