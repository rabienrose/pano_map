import { get_direction } from './three_part.js'
import { show_video_list } from './react_part.js'
import { load_map } from './leaflet_part.js'

export var video_file_list={}
var inputNode
function init_video() {
    video.addEventListener("timeupdate",update_video,true);
    document.onkeyup = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        
        if (e && e.keyCode === 87) {
            video.currentTime += (29.5);
            return false;
        }else if (e && e.keyCode === 83) {
            video.currentTime -= (29.5);
            return false;
        }
    };
    inputNode = document.getElementById("load");
    inputNode.addEventListener('change', process_loading, false)
}

function update_video(){
    //console.log(video.currentTime)
}

export function get_video_sec(){
    if ("src_name" in video){
        return [video.currentTime,video.src_name]
    }else{
        return ["-1","none"]
    }
}

export function playSelectedFile(video_name, sec) {
    if (video_name in video_file_list){
        video.src=video_file_list[video_name]
        video.load()
        video.src_name=video_name
        video.currentTime=sec
        return true
    }else{
        return false
    }
}

export function playFrame(sec, video_name){
    if (video_name!=video.src_name){
        if (playSelectedFile(video_name, sec)==false){
            return
        }
    }else{
        video.currentTime=sec
    }
}

function receivedText(e) {
    var lines = e.target.result;
    load_map(lines)
}

function process_loading(){
    for (var file_id=0; file_id<this.files.length; file_id++){
        var file=this.files[file_id]
        if (file['name'].includes(".mp4", 0)>0){
            var video_file=URL.createObjectURL(file)
            video_file_list[file['name']]=video_file
        }else if(file['name'].includes(".json", 0)>0){
            var fr = new FileReader();
            fr.onload = receivedText;
            fr.readAsText(file);
        }
    }
    show_video_list()
}

$(document).ready(function(){
    console.log("init video")
    init_video()
})

