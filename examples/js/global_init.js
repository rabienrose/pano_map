export var cur_mode="none"
$(document).ready(function(){
    console.log("init global")
    const e = React.createElement;
    var mode_chooser=e(
      ModeChooser,
      {mode:"node"}
    )
    ReactDOM.render(
      mode_chooser,
      document.getElementById('panel_2_2_1')
    );
})


class ModeChooser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        mode:props.mode
    }
    this.choose_mode = this.choose_mode.bind(this);
  }
  
  choose_mode(event) {
    this.setState({mode: event.target.value});
    cur_mode=event.target.value;
    console.log(cur_mode)
  }
  
  render() {
    const e = React.createElement;
    return e("div",
             {},
             e("input",
               {type:"radio", value:"node",checked:this.state.mode=="node", onChange:this.choose_mode}
              ),
             e("label",
               {htmlFor:"node"},
               "Node  "
              ),
             e("input",
               {type:"radio", value:"path",checked:this.state.mode=="path", onChange:this.choose_mode}
              ),
             e("label",
               {htmlFor:"path"},
               "Path  "
              ),
             e("input",
               {type:"radio", value:"path_play",checked:this.state.mode=="path_play", onChange:this.choose_mode}
              ),
             e("label",
               {htmlFor:"path_play"},
               "Path Play  "
              ),
             e("input",
               {type:"radio", value:"free_play",checked:this.state.mode=="free_play", onChange:this.choose_mode}
              ),
             e("label",
               {htmlFor:"free_play"},
               "Free Play  "
              ),
             e("input",
               {type:"radio", value:"edit_play",checked:this.state.mode=="edit_play", onChange:this.choose_mode}
              ),
             e("label",
               {htmlFor:"edit_play"},
               "Edit Play  "
              )
            )
  }
}
