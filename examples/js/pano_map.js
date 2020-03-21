import * as THREE from '../../build/three.module.js';

var camera, scene, renderer;
var fix_lon_offset=114
var fix_lon_offset_mark=-65
var isUserInteracting = false,
    lon = 0, lat = 0,
    phi = 0, theta = 0,
    distance = 1.1,
    onPointerDownPointerX = 0,
    onPointerDownPointerY = 0,
    onPointerDownLon = 0,
    onPointerDownLat = 0;
var step_time = 0;
var map_data=null;
var cur_status={};
var video = document.getElementById('video');
var mp4_list={}
var inputNode

function init() {
    var container, mesh;
    container = document.getElementById( 'container' );
    var rate=4.0 / 3.0
    camera = new THREE.PerspectiveCamera( 75, rate, 1, 1100 );
    camera.target = new THREE.Vector3( 0, 0, 0 );
    scene = new THREE.Scene();
    var geometry = new THREE.SphereBufferGeometry( 1000, 60, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale( -1, 1, 1 );
    
    var texture = new THREE.VideoTexture( video );
    var material = new THREE.MeshBasicMaterial( { map: texture } );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( 800, 600);
    container.appendChild( renderer.domElement );
    React.createElement('h1', 'sssss')
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    $("body").on("touchstart", onTouchDown);
    $("body").on("touchmove", onTouchMove);
    $("body").on("touchend", onTouchUp);
    document.addEventListener( 'wheel', onDocumentMouseWheel, false );
    window.addEventListener( 'resize', onWindowResize, false );
    var vol = 0.1;
    var videoElement = video;
    video.addEventListener("timeupdate",update_video,true);
    document.onkeyup = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode === 38) {
            video.volume !== 1 ? videoElement.volume += vol : 1;
            return false;

        } else if (e && e.keyCode === 40) {
            video.volume !== 0 ? videoElement.volume -= vol : 1;
            return false;

        } else if (e && e.keyCode === 37) {
            video.playbackRate = video.playbackRate*1.1;
            return false;

        } else if (e && e.keyCode === 39) {
            video.playbackRate = video.playbackRate*0.9;
            return false;

        } else if (e && e.keyCode === 32) {
            procee_space();
            return false;
        }
    };
    inputNode = document.querySelector('input')
    inputNode.addEventListener('change', playSelectedFile, false)
}

function cal_node_list(){
    var nodes={}
    for (var key in map_data['edges']) {
        var end_node_id = map_data['edges'][key]['v1']
        var node_info = {"edge_id":key, "dir": map_data['edges'][key]["dir_s"]}
        if (end_node_id in nodes){
            nodes[end_node_id]['conns'].push(node_info)
        }else{
            nodes[end_node_id]={'conns':[node_info]}
        }
    }
    map_data['nodes']=nodes
}

function check_edge(c_dir){
    var c_node_id=cur_status['node_id']
    var node=map_data['nodes'][c_node_id]
    if (node==null){
        return null
    }
    for(var id in node['conns']){
        var conn=node['conns'][id]
        var t_edge = get_edge(cur_status['edge_id'])
        var dir_diff = Math.abs(conn['dir']-c_dir)
        if (dir_diff>180){
            dir_diff=360-dir_diff
        }
        if (dir_diff<45){
            return conn['edge_id']
        }
    }
    return null
}

function get_edge(edge_id){
    return map_data['edges'][edge_id]
}

function try_load_first_frame(){
    if (map_data==null){
        return
    }
    if (mp4_list.length==0){
        return
    }
    var t_edge
    for (var edge_id in map_data['edges']) {
        t_edge = get_edge(edge_id)
        cur_status={"bEdge":false,"edge_id":edge_id, "node_id":t_edge['v1']}
        break
    }
    video.src=mp4_list[t_edge['video']]
    video.load()
    var cur_start=t_edge['start']
    video.currentTime=cur_start
    show_arrow()
}

function playSelectedFile(event) {
    mp4_list={}
    map_data=null;
    cur_status={};
    hide_arrow()
    lon = 0
    lat = 0
    phi = 0
    theta = 0
    onPointerDownPointerX = 0
    onPointerDownPointerY = 0
    onPointerDownLon = 0
    onPointerDownLat = 0
    for (var file_id=0; file_id<this.files.length; file_id++){
        var file=this.files[file_id]
        if (file['name'].includes(".json", 0)>0){
            var fr = new FileReader();
            fr.onload = receivedText;
            fr.readAsText(file);
        }
        if (file['name'].includes(".mp4", 0)>0){
            mp4_list[file['name']]=URL.createObjectURL(file)
        }
    }
    try_load_first_frame()
    inputNode.value= null;
}

function receivedText(e) {
    var lines = e.target.result;
    var newArr = JSON.parse(lines);
    get_map_data(newArr)
}

function procee_space(){
    if(cur_status["bEdge"]==false){
        var temp_edge_id = check_edge(lon)
        if (temp_edge_id!=null){
            var t_edge = get_edge(temp_edge_id)
            video.src=mp4_list[t_edge['video']]
            video.play()
            cur_status["bEdge"]=true
            cur_status['edge_id']=temp_edge_id
            hide_arrow();
        }
    }else{
        if (video.paused){
            video.play()
        }else{
            video.pause()
        }
    }
}

function update_video(){
    if(cur_status["bEdge"]!=true){
        return
    }
    var t_edge = get_edge(cur_status['edge_id'])
    var cur_start=t_edge['start']
    var cur_end=t_edge['end']
    if(video.currentTime<cur_start){
        video.currentTime=cur_start
    }
    if(video.currentTime>cur_end){
        cur_status["bEdge"]=false
        cur_status['node_id']=t_edge['v2']
        video.pause()
        show_arrow()
    }
}

function get_a_marker(dir){
    var geometry = new THREE.SphereGeometry( 10, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );
    var temp_phi = THREE.Math.degToRad( dir+fix_lon_offset_mark);
    var t_x = Math.cos( temp_phi );
    var t_z = Math.sin( temp_phi );
    console.log(t_x)
    console.log(t_z)
    sphere.position.set( t_x*900, 0, t_z*900 );
    return sphere
}

function show_arrow(){
    var group = new THREE.Group();
    var c_node_id=cur_status['node_id']
    var node=map_data['nodes'][c_node_id]
    if (node==null){
        return null
    }
    for(var id in node['conns']){
        var conn=node['conns'][id]
        var t_edge = get_edge(cur_status['edge_id'])
        var dir_local = conn['dir']
        group.add(get_a_marker(dir_local));
    }
    group.name="marker"
    scene.add( group );
}

function hide_arrow(){
    var selectedObject = scene.getObjectByName("marker");
    if(selectedObject!=null){
        scene.remove( selectedObject );
        animate()
    }
}

function get_map_data(json_dat){
    map_data=json_dat
    cal_node_list()
    try_load_first_frame()
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(JSON.parse(rawFile.responseText));
        }
    }
    rawFile.send(null);
}

function onWindowResize() {
    //camera.aspect = 4.0 / 3.0;
    //camera.updateProjectionMatrix();
    //renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseDown( event ) {
    event.preventDefault();
    isUserInteracting = true;
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
}
function onDocumentMouseMove( event ) {
    if ( isUserInteracting === true ) {
        lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
        lat = ( event.clientY - onPointerDownPointerY ) * -0.1 + onPointerDownLat;
    }
}
function onDocumentMouseUp() {
    isUserInteracting = false;
}

function onTouchDown( e ) {
    event.preventDefault();
    isUserInteracting = true;
    onPointerDownPointerX = e.originalEvent.changedTouches[0].pageX;
    onPointerDownPointerY = e.originalEvent.changedTouches[0].pageY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
}
function onTouchMove( e ) {
    if ( isUserInteracting === true ) {
        lon = ( onPointerDownPointerX - e.originalEvent.changedTouches[0].pageX ) * 0.1 + onPointerDownLon;
        lat = -( e.originalEvent.changedTouches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
    }
}
function onTouchUp() {
    isUserInteracting = false;
}

function onDocumentMouseWheel( event ) {
    //distance += event.deltaY * 0.05;
    //distance = THREE.Math.clamp( distance, 1, 50 );
}

function animate() {
    requestAnimationFrame( animate );
    update();
}

function update() {
    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon+fix_lon_offset );
    camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
    camera.position.y = distance * Math.cos( phi );
    camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );
    camera.lookAt( camera.target );
    renderer.render( scene, camera );
}

$(document).ready(function(){
    init();
    animate();
})
