import { show_node_info } from './react_part.js'
import { show_edge_info } from './react_part.js'

var mymap
var next_id=0
var circleOpt= {
    radius: 10,
    color:"blue",
    fill:true,
    fillColor:"blue",
    fillOpacity:0.3
}
var _mouseStartingLat
var _mouseStartingLng
var _circleStartingLat
var _circleStartingLng
var node_list=[]
var moving_target=null
var select_target=null
var first_start=true
var is_dragging=false
var is_moving=false
var disable_mapclick=false
var node_list=[]
var edge_list=[]
var cur_path_nodes=[]

function show_map(){
    var map_root = document.getElementById("panel_1_2");
    var div_map = document.createElement("div");
    div_map.id="map";
    map_root.appendChild(div_map);
//    var options = {
//        crs: L.CRS.Baidu,
//        layers: [new L.tileLayer.baidu({ layer: 'custom' })],
//        maxZoom: 22,
//        maxNativeZoom: 17
//    };
//    mymap = L.map(div_map, options);
//    mymap.setView([23.128994281453547, 113.29616546630861], 18);
//    mymap._container.style.cursor = 'crosshair'
    
    mymap = L.map('map').setView([51.505, -0.09], 18);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 22,
        maxNativeZoom: 19
    }).addTo(mymap);
    L.control.scale({imperial:false}).addTo(mymap)
    mymap._container.style.cursor = 'crosshair'
    mymap.on ('click', _mouseClick);
}

function mouseover_circle(e){
}

function mousedown_circle(e){
    is_dragging=true
    mymap.dragging.disable();  // turn of moving of the map during drag of a circle
    mymap.off ('click', _mouseClick);
    _mouseStartingLat = e.latlng.lat;
    _mouseStartingLng = e.latlng.lng;
    _circleStartingLat = e.target._latlng.lat;
    _circleStartingLng = e.target._latlng.lng;
    mymap.on ('mousemove', _dragCircleMousemove);
    mymap.on ('mouseup', _dragCircleMouseup);
    moving_target=e.target
}

function get_new_edge_videoinfo(){
    return {video_c:"none", video_u:"none", time1c:0, time2c:0, time1u:0, time2u:0, angle1c:0, angle2c:0, angle1u:0, angle2u:0}
}

function create_line(select_target, target, id){
    var latlngs = [
        [select_target._latlng.lat, select_target._latlng.lng, 1],
        [target._latlng.lat, target._latlng.lng, 0]
    ];
    var options={
        min: 0,
        max: 1,
        palette: {
            0.0: '#0000ff',
            1.0: '#ff0000'
        },
        weight: 4,
        outlineWidth: 0
    }
    var polyline = L.hotline(latlngs, options).addTo(mymap);
    //var polyline = new L.polyline(latlngs, {color: 'red'}).addTo(mymap);
    polyline.on('click', click_line)
    polyline.id=id
    polyline.v1=select_target
    polyline.v2=target
    polyline.videoinfo = get_new_edge_videoinfo()
    select_target.edges.push(polyline)
    target.edges.push(polyline)
    edge_list.push(polyline)
    return polyline
}

function remove_line_in_circle(circle, line){
    var new_line_list=[]
    for(var i=0;i<circle.edges.length; i++){
        if (circle.edges[i]!=line){
            new_line_list.push(circle.edges[i])
        }
    }
    circle.edges=new_line_list
}

function remove_item_in_list(item_id, list){
    var new_list=[]
    for(var i=0;i<list.length; i++){
        if (list[i].id!=item_id){
            new_list.push(list[i])
        }
    }
    return new_list
}

function del_line(line){
    remove_line_in_circle(line.v1, line)
    remove_line_in_circle(line.v2, line)
    edge_list=remove_item_in_list(line.id, edge_list)
    line.remove()
}

function jump_to_map(){
    var avg_lon=0
    var avg_lat=0
    var node_count=node_list.length
    for(var i in node_list){
        var latlon=node_list[i].getLatLng()
        avg_lon=avg_lon+latlon['lng']/node_count
        avg_lat=avg_lat+latlon['lat']/node_count
    }
    var min_x=9999;
    var min_y=9999;
    var max_x=-9999;
    var max_y=-9999;
    for(var i=0; i<node_list.length; i++){
        var pt = node_list[i].getLatLng()
        if(pt['lng']<min_x){
            min_x=pt['lng'];
        }
        if(pt['lat']<min_y){
            min_y=pt['lat'];
        }
        if(pt['lng']>max_x){
            max_x=pt['lng'];
        }
        if(pt['lat']>max_y){
            max_y=pt['lat'];
        }
    }
    //mymap.setView([avg_lat, avg_lon], 16);
    var bounds = [[min_y,min_x], [max_y,max_x]];
    mymap.fitBounds(bounds);
}

export function switch_to_path_mode(){
    for(var i in node_list){
        var node=node_list[i]
         node.setStyle({color: '#aaaaaa', fillColor: '#aaaaaa'})
    }
}

function get_next_path_nodes(cur_node_id){

}


function click_circle(e){
    if (is_moving==true){
        is_moving=false
        return
    }
    if(mode=="path"){
        if (cur_path_nodes.length==0){
            node.setStyle({color: '#0000ff', fillColor: '#0000ff'})
            re_nodes = get_next_path_nodes(node.id)
            
        }
    }else if(mode=="map"){
        if(e.originalEvent.shiftKey){
            unselect_obj(e.target)
            while(e.target.edges.length>0){
                del_line(e.target.edges[e.target.edges.length-1])
            }
            node_list=remove_item_in_list(e.target.id, node_list)
            e.target.remove()
        }else if(e.originalEvent.altKey){
            if (e.target!=select_target && select_target!=null && "edges" in select_target){
                create_line(select_target, e.target, next_id)
                next_id=next_id+1
            }
        }else{
            select_obj(e.target)
            show_node_info(e.target.id, e.target.video, e.target.time, e.target.dir)
        }
    }
}

function unselect_obj(obj){
    if (select_target!=obj){
        return
    }
    select_target=null
    if ("v1" in obj){
        obj.setStyle({weight: 4})
    }else if("edges" in obj){
        obj.setStyle({color: '#0000ff', fillColor:'#0000ff'})
    }
}

function select_obj(obj){
    if (select_target==obj){
        return
    }
    if(select_target!=null){
        unselect_obj(select_target)
    }
    select_target=obj
    if ("v1" in obj){
        obj.setStyle({weight: 6})
    }else if("edges" in obj){
        obj.setStyle({color: '#ff0000', fillColor: '#ff0000'})
    }
}

function click_line(e){
    disable_mapclick=true
    if(e.originalEvent.shiftKey){
        unselect_obj(e.target)
        remove_line_in_circle(e.target.v1, e.target)
        remove_line_in_circle(e.target.v2, e.target)
        edge_list=remove_item_in_list(e.target.id, edge_list)
        e.target.remove()
    }
    select_obj(e.target)
    var info = e.target.videoinfo
    show_edge_info(e.target.id, info.video_c, info.video_u, info.time1c, info.time2c, info.time1u, info.time2u, info.angle1c, info.angle2c, info.angle1u, info.angle2u)
}

export function set_node_video_info(node_id, sec, video, dir){
    var node = find_node_by_id(node_id)
    if (node!=null){
        node.time=sec
        node.video=video
        node.dir=dir
    }
}

export function set_edge_video_info(edge_id, video_c, video_u, time1c, time2c, time1u, time2u, angle1c, angle2c, angle1u, angle2u){
    var edge = find_edge_by_id(edge_id)
    if (edge!=null){
        edge.videoinfo={video_c:video_c, video_u:video_u, time1c:time1c, time2c:time2c, time1u:time1u, time2u:time2u, angle1c:angle1c, angle2c:angle2c, angle1u:angle1u, angle2u:angle2u}
    }
}

function download(text, name) {
    var a = document.getElementById("download");
    var file = new Blob([text], {type: "json"});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.style.display = "block"
}

function clear_map(){
    for (var item in node_list){
        node_list[item].remove()
    }
    node_list=[]
    edge_list=[]
    moving_target=null
    select_target=null
}

export function load_map(json_str){
    clear_map()
    var max_id=-1
    var map = JSON.parse(json_str)
    for (var i in map['nodes']){
        var node_info=map['nodes'][i]
        var node = create_node(node_info.latlng, node_info.id)
        node.time=node_info.sec
        node.video=node_info.video
        node.dir=node_info.dir
        if(node_info.id>max_id){
            max_id=node_info.id
        }
    }
    for (var i in map['edges']){
        var edge_info=map['edges'][i]
        var node1=find_node_by_id(edge_info.v1_id)
        var node2=find_node_by_id(edge_info.v2_id)
        var edge = create_line(node1, node2, edge_info.id)
        edge.videoinfo=edge_info.videoinfo
        if(edge_info.id>max_id){
            max_id=edge_info.id
        }
    }
    next_id= max_id+1
    jump_to_map()
}

function save_graph(){
    var map={nodes:[], edges:[]}
    for (var i in node_list){
        var node_item={}
        node_item.id=node_list[i].id
        node_item.sec=node_list[i].time
        node_item.video=node_list[i].video
        node_item.dir=node_list[i].dir
        node_item.latlng=node_list[i].getLatLng()
        map['nodes'].push(node_item)
    }
    for (var i in edge_list){
        var edge_item={}
        edge_item.id=edge_list[i].id
        edge_item.videoinfo=edge_list[i].videoinfo
        edge_item.v1_id=edge_list[i].v1.id
        edge_item.v2_id=edge_list[i].v2.id
        map['edges'].push(edge_item)
    }
    download(JSON.stringify(map), "map.json")
    
}

function find_node_by_id(node_id){
    for (var item in node_list){
        if (node_list[item].id==node_id){
            return node_list[item]
        }
    }
    return null
}

function find_edge_by_id(edge_id){
    for (var item in edge_list){
        if (edge_list[item].id==edge_id){
            return edge_list[item]
        }
    }
    return null
}

function move_line(v, new_posi, line){
    var new_posis=line.getLatLngs()
    new_posis[0]['alt']=1
    new_posis[1]['alt']=0
    if (line.v1==v){
        new_posis[0]={'lat':new_posi['lat'], lng:new_posi['lng'], alt:1}
        line.setLatLngs(new_posis)
    }else{
        new_posis[1]={'lat':new_posi['lat'], lng:new_posi['lng'], alt:0}
        line.setLatLngs(new_posis)
    }
}

function _dragCircleMousemove(e){
    is_moving=true
    var mouseNewLat = e.latlng.lat;
    var mouseNewLng = e.latlng.lng;
    var latDifference = mouseNewLat - _mouseStartingLat;
    var lngDifference = mouseNewLng - _mouseStartingLng;
    var currentCircleCoords = L.latLng (_circleStartingLat + latDifference, _circleStartingLng + lngDifference);
    moving_target.setLatLng (currentCircleCoords);
    for (var i=0; i<moving_target.edges.length; i++){
        move_line(moving_target, currentCircleCoords, moving_target.edges[i])
    }
}

function _dragCircleMouseup(e){
    mymap.off ('mousemove', _dragCircleMousemove);
    mymap.off ('mouseup', _dragCircleMouseup);
    mymap.on ('click', _mouseClick);
    mymap.dragging.enable();
}

function create_node(latlng, id){
    var circle_vis=new L.CircleMarker (latlng, circleOpt).addTo(mymap)
    circle_vis.on('mousedown', mousedown_circle)
    circle_vis.on('click', click_circle)
    circle_vis.edges=[]
    circle_vis.id=id
    circle_vis.video="none"
    circle_vis.time="-1"
    circle_vis.dir="0"
    node_list.push(circle_vis)
    return circle_vis
}

function _mouseClick(e) {
    if (disable_mapclick==true){
        disable_mapclick=false
        return
    }
    
    //var temp_node= new Node(e.latlng)
    //temp_node.vis.on('mouseover', temp_node.mouseover_fn, temp_node)
    if (is_dragging==true){
        is_dragging=false
        return
    }
    create_node(e.latlng, next_id)
    next_id=next_id+1
}

$(document).ready(function(){
    console.log("init map")
    show_map()
    var inputNode = document.getElementById("save");
    inputNode.addEventListener('click', save_graph, false)
})

