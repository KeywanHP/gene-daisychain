// Extend the graph by adding new nodes and/or edges
// Add data to networkJSON

function addPath(node, rel_type)
{
    var cy= $('#cy').cytoscape('get'); // now we have a global reference to `cy`
    node_id = node.id();
    node_x = node.position("x");
    node_y = node.position("y");
    console.log(node_id, node_x, node_y);
    var wsconn = new WebSocket("ws://146.118.99.190:7687/");
    wsconn.onopen = function () {wsconn.send("PAQURY_RELA_"+project_id+"_WEB_"+node_id+"_"+rel_type);};
    wsconn.onmessage = function (evt){
        new_graph_data = JSON.parse(evt.data);
        new_node_data = new_graph_data.nodes;
        new_edge_data = new_graph_data.edges;
        var angle_rotation = (2 * Math.PI)/new_node_data.length;
        var angle = 0;
        if (new_node_data.length == 0){
        window.alert("No new nodes found.");
        console.log(new_node_data.length);
        };
        new_node_data.forEach(function(val)
        {
            console.log(val.data);
            cy.add({group: "nodes","data":val.data, position: 
                { x: node_x+(50*Math.cos(angle)), y: node_y+(50*Math.sin(angle)) }});
            angle += angle_rotation;
        });
        new_edge_data.forEach(function(val)
        {
            console.log(val.data);
            cy.add({group: "edges","data":val.data});
        });
        updateCyLegend();
        changeSensitivity();

        cy.elements().qtip({
  content: function() {
      var qtipMsg= "";
     try {
       if(this.isNode()) {
          if(this.data('type')=="Gene")
          {
         qtipMsg= "<b>Name:</b> "+ this.data('name') + "\n" +", <b>Type:</b> "+ this.data('type') + "\n"
         +", <b>Species:</b> "+ this.data('species')+ "\n"
         +", <b>Contig:</b> "+ this.data('contig');
        }
         else
         {
             qtipMsg= "<b>Name:</b> "+ this.data('name') +", <b>Type:</b> "+ this.data('type')
             +", <b>Description:</b> "+ this.data('description')
                    +", <b>Species:</b> "+ this.data('species')
          +", <b>Chromosome:</b> "+ this.data('chromosome');
        }
        }
      else if(this.isEdge()) {
              if(this.data('type')=="HOMOLOG")
              {
              qtipMsg= "<b>Identity:</b> "+ this.data('perc_match')+"%";
              }
             }
      }
      catch(err) { qtipMsg= "Selected element is neither a Concept nor a Relation"; }
      return qtipMsg;
     },
  style: {
    classes: 'qtip-bootstrap',
    tip: {
      width: 12,
      height: 6
    }
  }
});
        
    }
}
