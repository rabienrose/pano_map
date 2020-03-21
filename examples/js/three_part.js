import * as THREE from '../../build/three.module.js';
var camera, scene, renderer
var isUserInteracting = false,
    lon = 0, lat = 0,
    phi = 0, theta = 0,
    distance = 1.1,
    onPointerDownPointerX = 0,
    onPointerDownPointerY = 0,
    onPointerDownLon = 0,
    onPointerDownLat = 0;
var fix_lon_offset=114
var fix_lon_offset_mark=-65

function init() {
    var container,container_query, mesh;
    container = document.getElementById( 'panel_1_1_1' );
    container_query=$("#panel_1_1_1");
    var w = container_query.width();
    var h = container_query.height();
    var rate=w / h
    camera = new THREE.PerspectiveCamera( 60, rate, 1, 1100 );
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
    renderer.setSize( w, h);
    container.appendChild( renderer.domElement );
    container_query.on( 'mousedown', onDocumentMouseDown);
    container_query.on( 'mousemove', onDocumentMouseMove);
    container_query.on( 'mouseup', onDocumentMouseUp);
    container_query.on("touchstart", onTouchDown);
    container_query.on("touchmove", onTouchMove);
    container_query.on("touchend", onTouchUp);
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

function animate() {
    requestAnimationFrame( animate );
    update();
}

export function get_direction(){
    return lon
}

export function set_direction(new_lon){
    lon=new_lon
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
    console.log("init three")
    init();
    animate();
})

