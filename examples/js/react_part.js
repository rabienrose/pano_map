import { video_file_list } from './video_part.js'
import { playSelectedFile } from './video_part.js'
import { get_video_sec } from './video_part.js'
import { get_direction } from './three_part.js'
import { set_direction } from './three_part.js'
import { set_node_video_info } from './leaflet_part.js'
import { set_edge_video_info } from './leaflet_part.js'

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value:props.value,
        last_value:props.value
    }
    this.handleChange = this.handleChange.bind(this);
  }
  
  static getDerivedStateFromProps(props, state) {
        if (state.state_up==true){
            state.state_up=false
            return state
        }else{
            return {
              value: props.value,
              last_value: props.value
            };
        }
  }
  handleChange(event) {
    this.setState({value: event.target.value, state_up:true})
    this.props.change_callback(event.target.value)
  }
  
  render() {
    const e = React.createElement;
    return e("label",
             {},
             this.props.name,
             e("input",
               {type:"text", value:this.state.value, onChange:this.handleChange}
              )
            )
  }
}

class ParamForm extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const e = React.createElement;
    return e("a",
             null,
             e(NameForm,
               {name:this.props.name, value:this.props.value, change_callback:this.props.change_callback}),
             e("input",
               {type:"button", value:"Set", onClick:this.props.handleSetClick}),
             e("input",
               {type:"button", value:"Goto", onClick:this.props.handleGoClick})
            )
  }
}

function handleSetClick(){
}

class NodePanel extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
                    frame_time: props.frame_time,
                    angle: props.angle,
                    video:props.video
      };
      this.setFrame = this.setFrame.bind(this);
      this.setDirection = this.setDirection.bind(this);
      this.goFrame = this.goFrame.bind(this);
      this.onTimeChange = this.onTimeChange.bind(this);
      this.onDirChange = this.onDirChange.bind(this);
    }
    setFrame(event) {
        var re=get_video_sec()
        if (re[0]!=-1){
            this.setState({frame_time: re[0]})
            this.setState({video: re[1]})
            set_node_video_info(this.props.node_id, re[0], re[1], this.state.angle)
        }
    }
    setDirection(event) {
        var dir=get_direction()
        dir=Math.floor(dir)
        if (dir != this.state.angle){
            this.setState({angle: dir});
            set_node_video_info(this.props.node_id, this.state.frame_time, this.state.video, dir)
        }
    }
    
    onTimeChange(sec){
        this.setState({frame_time:sec})
        set_node_video_info(this.props.node_id, sec, this.state.video, this.state.angle)
    }
    
    onDirChange(dir){
        this.setState({angle:dir})
        set_node_video_info(this.props.node_id, this.state.frame_time, this.state.video, dir)
    }
    
    goFrame(event) {
        playSelectedFile(this.state.video, this.state.frame_time)
        set_direction(this.state.angle)
    }
    
    render() {
      const e = React.createElement;
      return e("div",
               null,
               e(NameForm,
                 {name:"Video", value:this.state.video}),
               e("br"),
               e(NameForm,
                 {name:"NodeId", value:this.props.node_id}),
               e("br"),
               e(ParamForm,
                 {name:"Time", value:this.state.frame_time, handleSetClick:this.setFrame, handleGoClick:this.goFrame, change_callback:this.onTimeChange}),
               e("br"),
               e(ParamForm,
                 {name:"Direction", value:this.state.angle, handleSetClick:this.setDirection, handleGoClick:this.goFrame, change_callback:this.onDirChange})
              )
    }
}

class EdgePanel extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
                    time1c: props.time1c,
                    time2c: props.time2c,
                    time1u: props.time1u,
                    time2u: props.time2u,
                    angle1c: props.angle1c,
                    angle2c: props.angle2c,
                    angle1u: props.angle1u,
                    angle2u: props.angle2u,
                    video_c:props.video_c,
                    video_u:props.video_u
      };
      this.goFrame1c = this.goFrame1c.bind(this);
      this.goFrame2c = this.goFrame2c.bind(this);
      this.goFrame1u = this.goFrame1u.bind(this);
      this.goFrame2u = this.goFrame2u.bind(this);
      this.setFrame1c = this.setFrame1c.bind(this);
      this.setDirection1c = this.setDirection1c.bind(this);
      this.onTimeChange1c = this.onTimeChange1c.bind(this);
      this.onDirChange1c = this.onDirChange1c.bind(this);
      this.setFrame2c = this.setFrame2c.bind(this);
      this.setDirection2c = this.setDirection2c.bind(this);
      this.onTimeChange2c = this.onTimeChange2c.bind(this);
      this.onDirChange2c = this.onDirChange2c.bind(this);
      this.setFrame1u = this.setFrame1u.bind(this);
      this.setDirection1u = this.setDirection1u.bind(this);
      this.onTimeChange1u = this.onTimeChange1u.bind(this);
      this.onDirChange1u = this.onDirChange1u.bind(this);
      this.setFrame2u = this.setFrame2u.bind(this);
      this.setDirection2u = this.setDirection2u.bind(this);
      this.onTimeChange2u = this.onTimeChange2u.bind(this);
      this.onDirChange2u = this.onDirChange2u.bind(this);
      this.onVideoChange_c = this.onVideoChange_c.bind(this);
      this.onVideoChange_u = this.onVideoChange_u.bind(this);
    }
    
    setFrame1c(event) {
        var re=get_video_sec()
        if (re[0]!=-1){
            this.setState({time1c: re[0]})
            this.setState({video_c: re[1]})
            set_edge_video_info(this.props.edge_id, re[1], this.state.video_u,re[0], this.state.time2c, this.state.time1u, this.state.time2u, this.state.angle1c, this.state.angle2c, this.state.angle1u, this.state.angle2u)
        }
    }
    setFrame2c(event) {
        var re=get_video_sec()
        if (re[0]!=-1){
            this.setState({time2c: re[0]})
            this.setState({video_c: re[1]})
            set_edge_video_info(this.props.edge_id, re[1], this.state.video_u, this.state.time1c, re[0], this.state.time1u, this.state.time2u, this.state.angle1c, this.state.angle2c, this.state.angle1u, this.state.angle2u)
        }
    }
    setFrame1u(event) {
        var re=get_video_sec()
        if (re[0]!=-1){
            this.setState({time1u: re[0]})
            this.setState({video_u: re[1]})
            set_edge_video_info(this.props.edge_id, this.state.video_c, re[1], this.state.time1c, this.state.time2c, re[0], this.state.time2u, this.state.angle1c, this.state.angle2c, this.state.angle1u, this.state.angle2u)
        }
    }
    setFrame2u(event) {
        var re=get_video_sec()
        if (re[0]!=-1){
            this.setState({time2u: re[0]})
            this.setState({video_u: re[1]})
            set_edge_video_info(this.props.edge_id, this.state.video_c, re[1], this.state.time1c, this.state.time2c, this.state.time1u, re[0], this.state.angle1c, this.state.angle2c, this.state.angle1u, this.state.angle2u)
        }
    }
    setDirection1c(event) {
        var dir=get_direction()
        dir=Math.floor(dir)
        if (dir != this.state.angle1c){
            this.setState({angle1c: dir});
            set_edge_video_info(this.props.edge_id, this.state.video_c, this.state.video_u, this.state.time1c, this.state.time2c, this.state.time1u, this.state.time2u, dir, this.state.angle2c, this.state.angle1u, this.state.angle2u)
        }
    }
    setDirection2c(event) {
        var dir=get_direction()
        dir=Math.floor(dir)
        if (dir != this.state.angle2c){
            this.setState({angle2c: dir});
            set_edge_video_info(this.props.edge_id, this.state.video_c, this.state.video_u, this.state.time1c, this.state.time2c, this.state.time1u, this.state.time2u, this.state.angle1c, dir, this.state.angle1u, this.state.angle2u)
        }
    }
    setDirection1u(event) {
        var dir=get_direction()
        dir=Math.floor(dir)
        if (dir != this.state.angle1u){
            this.setState({angle1u: dir});
            set_edge_video_info(this.props.edge_id, this.state.video_c, this.state.video_u, this.state.time1c, this.state.time2c, this.state.time1u, this.state.time2u, this.state.angle1c, this.state.angle2c, dir, this.state.angle2u)
        }
    }
    setDirection2u(event) {
        var dir=get_direction()
        dir=Math.floor(dir)
        if (dir != this.state.angle2u){
            this.setState({angle2u: dir});
            set_edge_video_info(this.props.edge_id, this.state.video_c, this.state.video_u, this.state.time1c, this.state.time2c, this.state.time1u, this.state.time2u, this.state.angle1c, this.state.angle2c, this.state.angle1u, dir)
        }
    }
    onTimeChange1c(sec){
        sec=parseInt(sec)
        this.setState({time1c: sec})
        set_edge_video_info(this.props.edge_id, this.state.video_c, this.state.video_u, sec, this.state.time2c, this.state.time1u, this.state.time2u, this.state.angle1c, this.state.angle2c, this.state.angle1u, this.state.angle2u)
    }
    onTimeChange2c(sec){
        sec=parseInt(sec)
        this.setState({time2c: sec})
        set_edge_video_info(this.props.edge_id, this.state.video_c, this.state.video_u, this.state.time1c, sec, this.state.time1u, this.state.time2u, this.state.angle1c, this.state.angle2c, this.state.angle1u, this.state.angle2u)
    }
    onTimeChange1u(sec){
        sec=parseInt(sec)
        this.setState({time1u: sec})
        set_edge_video_info(this.props.edge_id, this.state.video_c, this.state.video_u, this.state.time1c, this.state.time2c, sec, this.state.time2u, this.state.angle1c, this.state.angle2c, this.state.angle1u, this.state.angle2u)
    }
    onTimeChange2u(sec){
        sec=parseInt(sec)
        this.setState({time2u: sec})
        set_edge_video_info(this.props.edge_id, this.state.video_c, this.state.video_u, this.state.time1c, this.state.time2c, this.state.time1u, sec, this.state.angle1c, this.state.angle2c, this.state.angle1u, this.state.angle2u)
    }
    onDirChange1c(dir){
        dir=parseInt(dir)
        this.setState({angle1c: dir})
        set_edge_video_info(this.props.edge_id, this.state.video_c, this.state.video_u, this.state.time1c, this.state.time2c, this.state.time1u, this.state.time2u, dir, this.state.angle2c, this.state.angle1u, this.state.angle2u)
    }
    onDirChange2c(dir){
        dir=parseInt(dir)
        this.setState({angle2c: dir})
        set_edge_video_info(this.props.edge_id, this.state.video_c, this.state.video_u, this.state.time1c, this.state.time2c, this.state.time1u, this.state.time2u, this.state.angle1c, dir, this.state.angle1u, this.state.angle2u)
    }
    onDirChange1u(dir){
        dir=parseInt(dir)
        this.setState({angle1u: dir})
        set_edge_video_info(this.props.edge_id, this.state.video_c, this.state.video_u, this.state.time1c, this.state.time2c, this.state.time1u, this.state.time2u, this.state.angle1c, this.state.angle2c, dir, this.state.angle2u)
    }
    onDirChange2u(dir){
        dir=parseInt(dir)
        this.setState({angle2u: dir})
        set_edge_video_info(this.props.edge_id, this.state.video_c, this.state.video_u, this.state.time1c, this.state.time2c, this.state.time1u, this.state.time2u, this.state.angle1c, this.state.angle2c, this.state.angle1u, dir)
    }
    onVideoChange_c(video){
        this.setState({video_c: video})
        set_edge_video_info(this.props.edge_id, video, this.state.video_u, this.state.time1c, this.state.time2c, this.state.time1u, this.state.time2u, this.state.angle1c, this.state.angle2c, this.state.angle1u, this.state.angle2u)
    }
    onVideoChange_u(dir){
        this.setState({video_u: video})
        set_edge_video_info(this.props.edge_id, this.state.video_c, video, this.state.time1c, this.state.time2c, this.state.time1u, this.state.time2u, this.state.angle1c, this.state.angle2c, this.state.angle1u, this.state.angle2u)
    }
    goFrame1c(event) {
        playSelectedFile(this.state.video_c, this.state.time1c)
        set_direction(this.state.angle1c)
    }
    goFrame2c(event) {
        playSelectedFile(this.state.video_c, this.state.time2c)
        set_direction(this.state.angle2c)
    }
    goFrame1u(event) {
        playSelectedFile(this.state.video_u, this.state.time1u)
        set_direction(this.state.angle1u)
    }
    goFrame2u(event) {
        playSelectedFile(this.state.video_u, this.state.time2u)
        set_direction(this.state.angle2u)
    }
    
    render() {
      const e = React.createElement;
      return e("div",
               null,
               e(NameForm,
                 {name:"EdgeId", value:this.props.edge_id}),
               e("br"),
               e(NameForm,
                 {name:"Video_c", value:this.state.video_c, change_callback:this.onVideoChange_c}),
               e("br"),
               e(ParamForm,
                 {name:"Time1c", value:this.state.time1c, handleSetClick:this.setFrame1c, handleGoClick:this.goFrame1c, change_callback:this.onTimeChange1c}),
               e("br"),
               e(ParamForm,
                 {name:"Time2c", value:this.state.time2c, handleSetClick:this.setFrame2c, handleGoClick:this.goFrame2c, change_callback:this.onTimeChange2c}),
               e("br"),
               e(ParamForm,
                 {name:"Direction1c", value:this.state.angle1c, handleSetClick:this.setDirection1c, handleGoClick:this.goFrame1c, change_callback:this.onDirChange1c}),
               e("br"),
               e(ParamForm,
                 {name:"Direction2c", value:this.state.angle2c, handleSetClick:this.setDirection2c, handleGoClick:this.goFrame2c, change_callback:this.onDirChange2c}),
               e("br"),
               e(NameForm,
                 {name:"Video_u", value:this.state.video_u, change_callback:this.onVideoChange_u}),
               e("br"),
               e(ParamForm,
                 {name:"Time1u", value:this.state.time1u, handleSetClick:this.setFrame1u, handleGoClick:this.goFrame1u, change_callback:this.onTimeChange1u}),
               e("br"),
               e(ParamForm,
                 {name:"Time2u", value:this.state.time2u, handleSetClick:this.setFrame2u, handleGoClick:this.goFrame2u, change_callback:this.onTimeChange2u}),
               e("br"),
               e(ParamForm,
                 {name:"Direction1u", value:this.state.angle1u, handleSetClick:this.setDirection1u, handleGoClick:this.goFrame1u, change_callback:this.onDirChange1u}),
               e("br"),
               e(ParamForm,
                 {name:"Direction2u", value:this.state.angle2u, handleSetClick:this.setDirection2u, handleGoClick:this.goFrame2u, change_callback:this.onDirChange2u})
              )
    }
}

class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: props.value};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    playSelectedFile(event.target.value, 0)
  }

  render() {
    const e = React.createElement;
    var items=[]
    for (var i=0; i<this.props.list.length; i++){
        var name=this.props.list[i]
        items.push(e("option",
                     {value:name,key:name},
                     name
                    )
                  )
    }
    return e("select",
              {value:this.state.value, onChange:this.handleChange, className:"span_all"},
              items
            )
  }
}

export function show_node_info(node_id, video, time, direction){
    const e = React.createElement;
    ReactDOM.render(
      e(NodePanel,
        {key:node_id, node_id:node_id, video:video, frame_time:time, angle:direction}),
      document.getElementById('panel_2_3')
    )
}

export function show_edge_info(edge_id, video_c, video_u, time1c, time2c, time1u, time2u, angle1c, angle2c, angle1u, angle2u){
    const e = React.createElement;
    ReactDOM.render(
      e(EdgePanel,
        {key:edge_id, edge_id:edge_id, video_c:video_c, video_u:video_u, time1c:time1c, time2c:time2c, time1u:time1u, time2u:time2u, angle1c:angle1c, angle2c:angle2c, angle1u:angle1u, angle2u:angle2u}),
      document.getElementById('panel_2_3')
    )
}

export function show_video_list() {
    var video_name_list=[]
    for (var key in video_file_list){
        video_name_list.push(key)
    }
    if (video_name_list.length>0){
        const e = React.createElement;
        var video_list=e(
          FlavorForm,
          {list:video_name_list, value:video_name_list[0]}
        )
        ReactDOM.render(
          video_list,
          document.getElementById('video_list')
        );
        playSelectedFile(video_name_list[0], 0)
    }
    
};

$(document).ready(function(){
    console.log("init react")
})


