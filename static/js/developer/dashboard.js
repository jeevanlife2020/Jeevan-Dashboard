$(document).ready(function () {
    var deviceName="device5";
    $("#spnDeviceName").html(deviceName);
    GetDailyFlowRateByDevice(deviceName);
    GetWeather("Kolkata");

})
function GetPredictedGraph(){
    $.ajax({
        method: "POST",
        url: "./api/getpredictedgraph",
        contentType: "application/json"
      })
      .done(function(dataset) {
        CreatePredictedGraph(dataset);
        GetTotalUsageGraph("71141");
      }); 
}
function CreatePredictedGraph(dataset){
    // Use Morris.Area instead of Morris.Line
    Morris.Area({
        element: 'predicted-graph-area',
        padding: 10,
        behaveLikeLine: true,
        gridEnabled: false,
        gridLineColor: '#dddddd',
        axes: true,
        fillOpacity: .7,
        data: dataset,
        lineColors: ['#1fb5ad'],
        xkey: 'date',
        ykeys: ['predicted_value'],
        labels: ['Prediction'],
        pointSize: 0,
        lineWidth: 0,
        hideHover: 'auto'

    });

}
function GetTotalUsageGraph(postalCode){
    $.ajax({
        method: "POST",
        url: "./api/gettotalusage",
        contentType: "application/json",
        data: JSON.stringify({postalcode: postalCode})
      })
      .done(function(dataset) {
        CreateTotalUsageVsYearBarGraph(dataset);
        CreateTotalUsageVsPostalCodeBarGraph(dataset);
      });
}
 // function for flow rate
function GetDailyFlowRateByDevice(DeviceName){
    $.ajax({
        method: "POST",
        url: "./api/getdailyflowratebydevice",
        contentType: "application/json",
        data: JSON.stringify({devicename: DeviceName})
      })
      .done(function(dataset) {
          CreateDailyFlowRateByDevice(dataset);
          GetPredictedGraph();
      });
}
// Graph for flow rate 
function CreateDailyFlowRateByDevice(dataset){
    var LineFlowRateData=[];
    for(var i=0;i<dataset.length;i++){
        var obj={flow_rate:dataset[i].flow_rate,time:dataset[i].time};
        LineFlowRateData.push(obj);
    }
    Morris.Line({
        element: 'flow_rate-line',
        data:LineFlowRateData,
        xkey: 'time',
        ykeys: ['flow_rate'],
        labels: ['Flow Rate'],
        lineColors: ['#199cef'],
        goals: [30.0],
        goalLineColors: ['#FF0000'],
        lineWidth: 3,
        pointSize: 2,
        resize: true
      });

}
// Craete bar graph
function CreateTotalUsageVsYearBarGraph(dataset){
    var barChartData=[];
    if(dataset!=null){   
        //Added year as property
        dataset.forEach(function (element) {
            element.year = element.time.substring(0,4);
          }); 

        var DeviceIds=[]
        var YearlyDataByDevice=[]
        // Device id wise every year total usage 
        var groupbyDeviceId = dataset.reduce((r, a) => {
            r[a.device_id] = [...r[a.device_id] || [], a];
            if(DeviceIds.indexOf(a.device_id) == -1){
                DeviceIds.push(a.device_id);
            }            
            return r;
           }, {});
           for(var i=0;i<DeviceIds.length;i++){ 
               var arr=GetYearlyDataByDevice(groupbyDeviceId[DeviceIds[i]]);    // Every year last inserted data of device
           arr=arr.sort((a, b) => b.year - a.year);
            for(var j=0; j<arr.length; j++){
                if(j+1<arr.length){
                    arr[j].total_usage=arr[j].total_usage-arr[j+1].total_usage;
                }
                else{
                    arr[j].total_usage=arr[j].total_usage;
                }                
                YearlyDataByDevice.push(arr[j]);
            }
           }

           // Create final grapgh data
           YearlyDataByDevice.reduce(function(res, value) {
            if (!res[value.year]) {
              res[value.year] = { year: value.year, total_usage: 0 };
              barChartData.push(res[value.year])
            }
            res[value.year].total_usage += value.total_usage;
            return res;
          }, {});

    Morris.Bar({
        element: 'graph-area',
        data:barChartData,
        xkey: 'year',
        ykeys: ['total_usage'],
        labels: ['Total Usage']
      });
   }
  
}
function GetYearlyDataByDevice(dataset){
    var yearluUsageData=[]
    var years=[];
    var groupbyYear = dataset.reduce((r, a) => {
        r[a.year] = [...r[a.year] || [], a];
        if(years.indexOf(a.year) == -1){
            years.push(a.year);
        }            
        
        return r;
       }, {});

       // made yearly usage of device id
       for(var i=0;i<years.length;i++){
        var latestDoc = groupbyYear[years[i]].sort((a, b) => new Date(b.time) - new Date(a.time))[0]
        yearluUsageData.push({"device_id":latestDoc.device_id,"postal_code":latestDoc.postal_code,"total_usage":latestDoc.total_usage,"year":latestDoc.year});
       }
return yearluUsageData;
}


// Craete bar graph
function CreateTotalUsageVsPostalCodeBarGraph(dataset){
    var barChartData=[];
    if(dataset!=null){   
        //Added year as property
        dataset.forEach(function (element) {
            element.year = element.time.substring(0,4);
           // console.log(element.postal_code);
          }); 

        var DeviceIds=[]
        var YearlyDataByDevice=[]
        // Device id wise every year total usage 
        var groupbyDeviceId = dataset.reduce((r, a) => {
            r[a.device_id] = [...r[a.device_id] || [], a];
            if(DeviceIds.indexOf(a.device_id) == -1){
                DeviceIds.push(a.device_id);
            }            
            return r;
           }, {});
           for(var i=0;i<DeviceIds.length;i++){ 
               var arr=GetYearlyDataByDevice(groupbyDeviceId[DeviceIds[i]]);    // Every year last inserted data of device
           arr=arr.sort((a, b) => b.year - a.year);
            for(var j=0; j<arr.length; j++){
                if(j+1<arr.length){
                    arr[j].total_usage=arr[j].total_usage-arr[j+1].total_usage;     //totalusage=current year last inserted data- previous year last inserted data
                }
                else{
                    arr[j].total_usage=arr[j].total_usage;
                }        
                    
                YearlyDataByDevice.push(arr[j]);
            }
           }
           // Create final grapgh data
           YearlyDataByDevice.reduce(function(res, value) {
            if (!res[value.postal_code]) {
              res[value.postal_code] = { postal_code: value.postal_code, total_usage: 0 };
              barChartData.push(res[value.postal_code])
            }
            res[value.postal_code].total_usage += value.total_usage;
            return res;
          }, {});
          
    Morris.Bar({
        element: 'graph-tu_vs_pc',
        data:barChartData,
        xkey: 'postal_code',
        ykeys: ['total_usage'],
        labels: ['Total Usage']
      });
   }
  
}

function GetWeather(location){
   var weatherAPI="http://api.openweathermap.org/data/2.5/weather?q=";
   var appId="&appid=ecb1f756686518281c429bf5b7498d70";
   $.get(weatherAPI+location+appId,function(response){
        $("#location").html(response.name);
        $("#weatherTemp").html(GetCelsius(response.main.temp).toString().split('.')[0]);
        $("#weatherStatus").html(response.weather[0].main);
        var Icon="https://openweathermap.org/img/w/"+ response.weather[0].icon +".png";
        $("#weathericon").html("<img src='"+Icon+"'>");        
        // var Humidity=response.main.humidity
    })
 }
function GetCelsius(temp) {
    return  temp - 273;
  };