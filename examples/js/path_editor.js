import { cur_mode } from './global_init.js'
import { switch_to_path_mode } from './leaflet_part.js'

class PathEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.start_path_edit = this.start_path_edit.bind(this);
    this.end_path_edit = this.end_path_edit.bind(this);
  }
  
  start_path_edit(event) {
    //console.log(cur_mode)
    switch_to_path_mode()
  }
  
  end_path_edit(event) {
  }
  
  render() {
    const e = React.createElement;
    return e("div",
             {},
             e("input",
               {type:"button", value:"Start", onClick:this.start_path_edit}
              ),
             e("input",
               {type:"button", value:"End", onClick:this.end_path_edit}
              ),
             e("input",
               {type:"text"}
              )
            )
  }
}


export function show_path_edit_panel() {
    const e = React.createElement;
    var path_edit=e(
      PathEditor,
      null
    )
    ReactDOM.render(
      path_edit,
      document.getElementById('panel_2_2_2')
    );
    
};

$(document).ready(function(){
    console.log("init path")
    show_path_edit_panel()
})


