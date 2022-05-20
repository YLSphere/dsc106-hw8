function assignment8(){
    var filePath="data.csv";
    question0(filePath);
    question1(filePath);
    question2(filePath);
    question3();
}

var rowConverter = function(d){
    for (n in d){
        if (isNaN(parseFloat(d[n])) == false){
            d[n] = parseFloat(d[n]);
        } else{
            continue;
        }
        
    }
    return d
}


var question0=function(filePath){
    d3.csv(filePath).then(function(data){
        // console.log(data)
    });
}

var question1=function(filePath){
    d3.csv(filePath, rowConverter).then(function(data){
        data = data.filter(function (d) {
            return d['pts'] > 15;
        });

        var rollup = Array.from(d3.rollup(data, v=>{return {'count': v.length, 'long': d3.mean(v, d=>d.longitude), 'lat': d3.mean(v, d=>d.latitude)}},
        d=>d.country));

        var final = [];
        var counts = [];

        for (n in rollup){
            counts.push(rollup[n][1]['count'])
            final.push(rollup[n][1]);
        }

        var svgwidth=1000;
        var svgheight=800;

        var svg_q1 = d3.select("#q1_plot")
            .append("svg").attr("width", svgwidth)
            .attr("height", svgheight)

        const projection  = d3.geoNaturalEarth1();
        const pathgeo = d3.geoPath().projection(projection);
        const world = d3.json('world.json')

        const rScale = d3.scaleLinear().domain([d3.min(counts), d3.max(counts)]).range([3,15])


        world.then(function(map){
            svg_q1.selectAll('#path').data(map.features).enter().append('path')
                .attr('d', pathgeo)
                .style('fill', 'teal')
                .style('stroke', 'white')
                .style('opacity', 0.7)

            svg_q1.selectAll("#circle").data(final).enter().append("circle")
                .attr("cx", d=>projection([d.long,d.lat])[0])
                .attr("cy", d=>projection([d.long,d.lat])[1])
                .attr("r", function(d){return rScale(d.count)})
                .style('fill', 'navy')
                .style('stroke', 'red')
                .style('opacity', 0.6) 
            });
    });
    
}
//
var question2=function(filePath){
    
    //reading data
    var rowConverter = function(d){
        if(d.country=="United States" && d.college !='None'){
            return {
            college:d.college,
            points : parseFloat(d.pts),
            assists : parseFloat(d.ast)
            }}
			
    }

    d3.csv(filePath, rowConverter).then(function(data){

        var width= 1200;
        var height= 700;
        var padding = 150;

        var rollup = Array.from(d3.rollup(data, v=>{return {'pts': d3.mean(v, d=>d.points), 'ast': d3.mean(v, d=>d.assists)}},
        d=>d.college));

        var final = [];
        for (n in rollup){
            var v = rollup[n][1]
            v['college'] = rollup[n][0]
            final.push(v)
        }

        final = final.filter(function (d) {
            return d.pts > 12;
        });

        var colleges = d3.map(final, function(d){return d.college})
        var pts = d3.map(final, function(d){return d.pts})
        var asts = d3.map(final, function(d){return d.ast})
        

        var xScale = d3.scaleBand().domain(colleges).range([padding, width-padding]);
        var yScale = d3.scaleLinear().domain([0, d3.sum([d3.max(pts), d3.max(asts)])]).range([height-padding, padding]);
        var colors = d3.scaleOrdinal().domain(['pts', 'ast']).range(['maroon', 'green'])

        var svg_q2 = d3.select('#q2_plot').append('svg')
            .attr('width', width)
            .attr('height', height);

        const xAxis = d3.axisBottom().scale(xScale);
        const yAxis = d3.axisLeft().scale(yScale);

        svg_q2.append('g').call(xAxis)
            .attr('class', 'xAxis')
            .attr('transform', "translate("+ (-xScale.bandwidth()/2)+"," + (height - padding) + ")")
            .selectAll("text")
            .style('text-anchor', 'end')
            .attr('transform', 'translate(0,10) rotate(-45)');
            
                
        svg_q2.append('g').call(yAxis) 
            .attr('class', 'yAxis')
            .attr('transform', 'translate('+ (padding-xScale.bandwidth()/2) + ',0)');


        var series = d3.stack().keys(['pts', 'ast'])
        var stack = series(final);

        svg_q2.selectAll("stream").data(stack).enter()
            .append("path")
            .style("fill", function(d){ return colors(d.key)})
            .attr("d", d3.area()
                .x(function(d) { return xScale(d.data.college); })
                .y0(function(d) { return yScale(d[0]); })
                .y1(function(d) { return yScale(d[1]); })
            )


        var colorL = ['maroon', 'green'];
        var keys = ['Points', 'Assists'];


        svg_q2.selectAll('circle').data(colorL).enter().append('circle')
            .attr('r', 10)
            .attr('cx', 900)
            .attr('cy', function(d) {return (padding/2 + (colorL.indexOf(d) * 25))})
            .style('fill', function(d){return d})

        svg_q2.selectAll('legend').data(keys).enter().append('text')
            .attr('x', 920)
            .attr('y', function(d) {return (padding/2 + (keys.indexOf(d) * 25))+5})
            .text(function(d){return d})
    });

    
}
var question3=function(){
    var data={
         "nodes":[
             {id: 1, name: 'P1', x: 87, y: 145,avg_pts_score:8,avg_rebound_score:9}, 
             {id: 2, name: 'P2', x: 176, y: 94,avg_pts_score:2,avg_rebound_score:8},  
             {id: 3, name: 'P3', x: 249, y: 162,avg_pts_score:7,avg_rebound_score:1}, 
             {id: 4, name: 'P4', x: 208, y: 253,avg_pts_score:6,avg_rebound_score:8.5}, 
             {id: 5, name: 'P5', x: 105, y: 246,avg_pts_score:9,avg_rebound_score:4}, 
         ],
         "edges":[{'source': {id: 1, name: 'P1', x: 87, y: 145}, 
                   'target':  {id: 2, name: 'P2', x: 176, y: 94},
                  'chem':70},
                  {'source': {id: 1, name: 'P1', x: 87, y: 145}, 
                   'target':  {id: 3, name: 'P3', x: 249, y: 162},
                  'chem':65},
                  {'source': {id: 1, name: 'P1', x: 87, y: 145}, 
                   'target':  {id: 4, name: 'P4', x: 208, y: 253},
                  'chem':75},
                  {'source': {id: 1, name: 'P1', x: 87, y: 145}, 
                   'target':  {id: 5, name: 'P5', x: 105, y: 246},
                  'chem':88},
                  
                  {'source': {id: 2, name: 'P2', x: 176, y: 94}, 
                   'target': {id: 3, name: 'P3', x: 249, y: 162},
                  'chem':80},
                  {'source': {id: 2, name: 'P2', x: 176, y: 94}, 
                   'target': {id: 4, name: 'P4', x: 208, y: 253},
                  'chem':95},
                  {'source': {id: 2, name: 'P2', x: 176, y: 94}, 
                   'target':  {id: 5, name: 'P5', x: 105, y: 246},
                  'chem':73},
                  
                  {'source': {id: 3, name: 'P3', x: 249, y: 162}, 
                   'target':  {id: 5, name: 'P5', x: 105, y: 246},
                  'chem':88},
                  ]
         
     }
     data["links"]=[]
     for(var i=0;i<data.edges.length;i++){
         var obj={}
         obj["source"]=data.edges[i]["source"].id-1;
         obj["target"]=data.edges[i]["target"].id-1;
         obj["chem"]=data.edges[i]["chem"]
         data.links.push(obj);
     }

     
  
    var width = 800;
	var height = 500;


    var chem = d3.map(data.links, function(d){return d.chem})
    

    var wScale = d3.scaleLinear().domain([d3.min(chem), d3.max(chem)]).range([2,8])


    var svg_q3 = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var force = d3.forceSimulation(data.nodes)
        .force("charge", d3.forceManyBody().strength(-200))
        .force("link", d3.forceLink(data.links))
        .force('center', d3.forceCenter(100, 50))
        
    
		
    //create edges
    var edges = svg_q3.selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .attr("stroke", "gray")
        .style('stroke-width', function(d){return wScale(d.chem)});
    
    //create nodes
    var nodes = svg_q3.selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .style('fill', function(d){
            if (d.avg_pts_score > d.avg_rebound_score){
                return 'turquoise'
            } else{
                return 'green'
            }
        });


    // creates text
    var text = svg_q3.selectAll('#names').data(data.nodes).enter().append('text')
        .text(function(d){return d.name})
        

    
    force.on("tick", function() {

        edges.attr("x1", function(d) { return d.source.x*3; })
                .attr("y1", function(d) { return d.source.y*3; })
                .attr("x2", function(d) { return d.target.x*3; })
                .attr("y2", function(d) { return d.target.y*3; });
                
    
        nodes.attr("cx", function(d) { return d.x*3; })
                .attr("cy", function(d) { return d.y*3; })
                .attr("r", 10);

        text.attr('x', function(d) { return d.x*3; })
            .attr('y', function(d) { return d.y*3; })
                

    });

 }