let movieData = [];

for (i = 1; i < 7; i++){
  urlVar = "https://swapi.dev/api/films/" + i.toString() + "/?format=json";
  $.ajax({ 
    url: urlVar, // API endpoint
    data: {},      // Any data to send
    type: "GET",           // POST or GET request
    dataType : "json", // expected data type
    success: function(result){
      let movieObj = {
        movieName : result.title,
        id: result.episode_id,
        characterNumber : result.characters.length,
        planetNumber : result.planets.length,
        starshipNumber : result.starships.length,
        vehicleNumber : result.vehicles.length,
        speciesNumber : result.species.length
      }
      movieData.push(movieObj);
    },
    error: function(xhr,status,error) {
        console.log("Error:",xhr,status,error); }
  });
}

setTimeout(() => {
  let temp = [];
  let max = 1;
  while(temp.length < 6){
    for(let i in movieData){
      if(movieData[i].id == max){
        temp.push(movieData[i]);
        max++;
        break;
      }
    }
  }
  movieData = temp;
  for(let i = 0; i < 5; i++){
    let label;
    switch(i){
      case 0:
        label = "Characters";
        break;
      case 1:
        label = "Planets";
        break;
      case 2:
        label = "Starships";
        break;
      case 3:
        label = "Vehicles";
        break;
      case 4:
        label = "Species";
        break;  
    }
    drawGraph(BuildData(i), label);
  }
}, 1000);

function BuildData(type){
  let temp = [];
  for(let i in movieData){
    let j = {
      id : movieData[i].movieName,
      value : GetTypeOfData(type, movieData[i]),
      color : ""
    }
    j.color = GetColor(i);
    temp.push(j)
  }
  return temp;
}

function GetTypeOfData(type, data){
  switch(type){
    case 0:
      return data.characterNumber;
    case 1:
      return data.planetNumber;
    case 2:
      return data.starshipNumber;
    case 3:
      return data.vehicleNumber;
    case 4:
      return data.speciesNumber;
  }
}

function GetColor(index){
  if(index == 0){
    return "rgb(252, 148, 78)";
  }
  if(index == 1){
    return "rgb(182, 100, 245)";
  }
  if(index == 2){
    return "rgb(227, 39, 36)";
  }
  if(index == 3){
    return "rgb(63, 132, 242)";
  }
  if(index == 4){
    return "rgb(255, 255, 153)";
  }
  if(index == 5){
    return "rgb(47, 249, 36)";
  }
}

function drawGraph(data, label){

  var margin = {top: 10, right: 40, bottom: 150, left: 50},
      width = 760 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  var yScale = d3.scaleLinear().range([height, 0]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(function(d) {return d});

  xScale.domain(data.map(function(d){ return d.id;}));
  yScale.domain([0, d3.max(data, function(d) {return d.value; })]);
  
  svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .transition().duration(1000)
      .delay(function(d, i) {return i * 200;})
      .attr("x", function(d) {
          return xScale(d.id);
      })
      .attr("y", function(d) {
          return yScale(d.value);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
      return height- yScale(d.value);
      })
      .attr("fill", function(d) {
        console.log(d.color);
        return d.color;
      });

  svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .transition().duration(1000)
      .delay(function(d, i){return i * 200;})
      .text(function(d){
          return d.value;
      })
      .attr("x", function(d, i){
          return xScale(d.id) + 50;
      })
      .attr("y", function(d){
          return yScale(d.value) + 12;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "13px")
      .attr("font-weight", "bold")
      .attr("fill", "black")
      .attr("text-anchor", "middle")

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("fill", "rgb(255,232,31)")
      .attr("dx", "-.8em")
      .attr("dy", ".25em")
      .attr("transform", "rotate(-60)")
      .style("text-anchor", "end")
      .attr("font-size", "10px");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .text("# of Unique " + label)
      .attr("transform", "rotate(-90)")
      .attr("x", -170)
      .attr("dy", "-3em")
      .attr("fill", "rgb(255,232,31)")
      .attr("font-family", "times")
      .attr("text-anchor", "middle");
}