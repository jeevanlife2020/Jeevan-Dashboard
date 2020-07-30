$(document).ready(function(){
    GetDevices();
})
$("#btnSubmit").on("click",function(){
    if(ValidateUserinfo()){
        $("#btnSubmit").html("Submitting...");
        var data={
            Name: $("#txtName").val().trim(),
            Email: $("#txtEmail").val().trim(),
            Phone: $("#txtPhone").val().trim(),
            PostalCode: $("#txtPostalCode").val().trim(),
            DeviceId: $("#txtDeviceId").val().trim(),
        }
        $.ajax({
            method: "POST",
            url: "./api/newinstall",
            contentType: "application/json",
            data: JSON.stringify(data)
          })
          .done(function(data) {
            $("#btnSubmit").html("Submit");
            if(data!=null)
            {
                GetDevices();
            }
            else{
                alert("Something went wrong.")
            }
            
          });
       
    }
})

//Validate user login
function ValidateUserinfo(){
    var IsValid=true;
    if($("#txtName").val().trim()==""){
        alert("Enter name");
        IsValid=false;
    }
    else if($("#txtEmail").val().trim()==""){
        alert("Enter email address");
        IsValid=false;
    }
    else if($("#txtPhone").val().trim()==""){
        alert("Enter phone numner");
        IsValid=false;
    }
    else if($("#txtPostalCode").val().trim()==""){
        alert("Enter postal code");
        IsValid=false;
    }
    else if($("#txtDeviceId").val().trim()==""){
        alert("Enter device id");
        IsValid=false;
    }
    return IsValid
}

function GetDevices(){
    $.ajax({
        method: "GET",
        url: "./api/getdevices",
        contentType: "application/json"
      })
      .done(function(dataset) {
        if(dataset!=null){
            var tr="<tr>";
            for(var i=0;i<dataset.length;i++){
                tr+="<tr><td>"+dataset[i].Name+"</td><td>"+dataset[i].Email+"</td><td>"+dataset[i].Phone+"</td><td>"+dataset[i].PostalCode+"</td><td>"+dataset[i].DeviceId+"</td></tr>";;
            }
            
            $("#tblBody").html(tr);
            $("#loader").html("");
        }
      });
}