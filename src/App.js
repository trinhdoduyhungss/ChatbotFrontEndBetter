import avatar from './assets/user.svg';
import home_default from './assets/home-default.svg';
import home_selected from './assets/home-selected.svg';
import message_default from './assets/message-default.svg';
import message_selected from './assets/message-selected.svg';
import setting_default from './assets/setting-default.svg';
import setting_selected from './assets/setting-selected.svg';
import refresh from './assets/refresh.svg';
import add from './assets/add.svg';
import send from './assets/send.svg';
import logo_dh from './assets/logodhbk.jpg';
import logo_it from './assets/logodhbkit.jpg';
import './App.css';
import React from 'react';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      msgList: [],
      list_all_keys: [],
      message_text: "",
      token: "",
      status_online: "offline",
      page: "login",
      api_test: "https://va-ftech.dev.ftech.ai/rocketchat/send_message/1",
      is_scroll: false,
      sender_id: "",
      update_component: false,
      login: false,
      register: true,
      inputValue_Name: "",
      inputValue_Email: "",
    }
    this.onChangeId = this.onChangeId.bind(this)
    this.onFullSize = this.onFullSize.bind(this)
    this.onChange = this.onChange.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.onChangeAPI = this.onChangeAPI.bind(this);
    this.convertTime = this.convertTime.bind(this);
    this.onInputChange_Email = this.onInputChange_Email.bind(this);
    this.onInputChange_Name = this.onInputChange_Name.bind(this);
    this.onLoginPress = this.onLoginPress.bind(this);
  }
  onLoginPress() {
    if(this.state.register){
      let gen_sender_id = ''
      fetch("https://apichatbotcomet.herokuapp.com/ip",{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .then(data => {
        gen_sender_id = data.ip+'_'+this.state.inputValue_Name+'_'+this.state.inputValue_Email
        this.setState({
          sender_id: gen_sender_id,
          register: false,
          login: true,
          page: "chat",
          update_component: true,
          is_scroll: false
        })
        localStorage.setItem('sender_id', gen_sender_id)
        // this.componentDidUpdate()
      })
    }
  }
  onInputChange_Email(e) {
    const { value } = e.target;
    this.setState({
      inputValue_Email: value
    });

  }
  onInputChange_Name(e) {
    const { value } = e.target;
    this.setState({
      inputValue_Name: value
    });

  }
  onFullSize(id) {
    let modal = document.getElementById("myModal");
    let img = document.getElementById(id);
    let modalImg = document.getElementById("img-modal");
    modal.style.display = "block";
    modalImg.src = img.src;
  }
  onChangeId(senderid) {
    console.log(senderid)
    this.setState({
      sender_id: senderid,
      update_component: true,
      is_scroll: false
    })
    this.componentDidUpdate()
  }
  onChange = (e) => {
    this.setState({
      message_text: e.target.value
    })
  }
  convertTime = (time_diff) => {
    let new_time = ''
    if (time_diff > 60000) {
      if (time_diff > 31536000000) {
        new_time = Math.floor(time_diff / 31536000000) + " years ago"
      }
      if (time_diff > 2592000000 && time_diff < 31536000000) {
        new_time = Math.floor(time_diff / 2592000000) + " months ago"
      }
      if (time_diff > 86400000 && time_diff < 2592000000) {
        new_time = Math.round(time_diff / 86400000) + " days ago"
      }
      if (time_diff > 3600000 && time_diff < 86400000) {
        new_time = Math.floor(time_diff / 3600000) + " hours ago"
      }
      if (time_diff > 60000 && time_diff < 3600000) {
        new_time = Math.floor(time_diff / 60000) + " minutes ago"
      }
    } else {
      new_time = "Just now"
    }
    return new_time
  }
  onSendMessage = (text_input) => {
    if (text_input.length > 0) {
      fetch(this.state.api_test, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "text": text_input,
          "meta": {
            "user_id": this.state.sender_id,
          }
        })
      }).then(res => res.json()).then(data => {
        let data_new_struct = {}
        data_new_struct["text"] = text_input
        data_new_struct["rule"] = "user"
        this.setState({ message_text: "", is_scroll: false, msgList: [...this.state.msgList, data_new_struct] })
        data_new_struct = {}
        data_new_struct["text"] = data.text
        data_new_struct["rule"] = "bot"
        if (Object.keys(data._meta).length > 0) {
          if (data._meta.buttons) {
            data_new_struct["buttons"] = data._meta.buttons
          } else {
            data_new_struct["buttons"] = []
          }
          if (data._meta.image) {
            if (typeof (data._meta.image) === 'string') {
              data_new_struct["images"] = [data._meta.image]
            } else {
              data_new_struct["images"] = data._meta.image
            }
          } else {
            data_new_struct["images"] = []
          }
        } else {
          data_new_struct["buttons"] = []
          data_new_struct["images"] = []
        }
        this.setState({ message_text: "", is_scroll: false, msgList: [...this.state.msgList, data_new_struct] })
        console.log('check')
        this.scrollToBottom();
      }).catch(err => {
        console.log(err)
      })
    } else {
      if (this.state.message_text.length > 0) {
        fetch(this.state.api_test, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "text": this.state.message_text,
            "meta": {
              "user_id": this.state.sender_id,
            }
          })
        }).then(res => res.json()).then(data => {
          let data_new_struct = {}
          data_new_struct["text"] = this.state.message_text
          data_new_struct["rule"] = "user"
          this.setState({ message_text: "", is_scroll: false, msgList: [...this.state.msgList, data_new_struct] })
          data_new_struct = {}
          data_new_struct["text"] = data.text
          data_new_struct["rule"] = "bot"
          if (Object.keys(data._meta).length > 0) {
            if (data._meta.buttons) {
              data_new_struct["buttons"] = data._meta.buttons
            } else {
              data_new_struct["buttons"] = []
            }
            if (data._meta.image) {
              if (typeof (data._meta.image) === 'string') {
                data_new_struct["images"] = [data._meta.image]
              } else {
                data_new_struct["images"] = data._meta.image
              }
            } else {
              data_new_struct["images"] = []
            }
          } else {
            data_new_struct["buttons"] = []
            data_new_struct["images"] = []
          }
          this.setState({ message_text: "", is_scroll: false, msgList: [...this.state.msgList, data_new_struct] })
          this.scrollToBottom();
        }).catch(err => {
          console.log('err: ', err)
        })
      } else {
        alert("Please enter message")
      }
    }
  }
  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log("Enter key pressed")
      this.onSendMessage('');
    }
  }
  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView();
      this.setState({ is_scroll: true })
    }
  }
  componentDidUpdate() {
    if ((this.state.is_scroll === false && this.state.page === "chat") || this.state.update_component === true) {
      if(window.location !== window.parent.location && window.innerHeight === window.parent.innerHeight){
        window.top.location.reload();
        console.log(window.innerHeight)
      }
      setTimeout(() => {
        console.log("Waiting for render message")
      }, 150)
      fetch('https://va-ftech.dev.ftech.ai/api/tracker_redis_storage/get_trackers_by_sender_id/' + this.state.sender_id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(data => {
        if (data.length > 0) {
          let data_new_struc = []
          for (let item in data) {
            let each_item = {}
            each_item['text'] = data[item].usr_utterance.text
            each_item['rule'] = 'user'
            data_new_struc.push(each_item)
            each_item = {}
            each_item['text'] = data[item].sys_utterance.text
            each_item['rule'] = 'bot'
            each_item['time_stamp'] = data[item].time_stamp
            data['time_stamp'] = each_item['time_stamp']
            if(data[item].raw_sys_acts){
              each_item['intent'] = data[item].raw_sys_acts[0].intent
            }else{
              each_item['intent'] = "utter_faq/unknown"
            }
            if (Object.keys(data[item].sys_utterance._meta).length > 0) {
              if (data[item].sys_utterance._meta.buttons) {
                each_item['buttons'] = data[item].sys_utterance._meta.buttons
              } else {
                each_item['buttons'] = []
              }
              if (data[item].sys_utterance._meta.image) {
                if (typeof (data[item].sys_utterance._meta.image) === 'string') {
                  each_item['images'] = [data[item].sys_utterance._meta.image]
                } else {
                  each_item['images'] = data[item].sys_utterance._meta.image
                }
              } else {
                each_item['images'] = []
              }
            } else {
              each_item['buttons'] = []
              each_item['images'] = []
            }
            data_new_struc.push(each_item)
          }
          let last_time_stamp = data_new_struc[data_new_struc.length - 1]
          if (last_time_stamp.rule === 'bot') {
            last_time_stamp = last_time_stamp.time_stamp * 1000
            let time_now = new Date().getTime()
            let time_diff = time_now - last_time_stamp
            data['time_stamp'] = this.convertTime(time_diff)
          }
          this.setState({ msgList: data_new_struc, status_online: data.time_stamp, update_component: false })
          if (this.state.page === "chat") {
            this.scrollToBottom();
          }
        } else {
          this.setState({ msgList: [], status_online: "offline", update_component: false, is_scroll: true })
        }
      })
      fetch('https://va-ftech.dev.ftech.ai/api/tracker_redis_storage/list_all_keys', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(data => {
        this.setState({ list_all_keys: data, update_component: false })
      })
    }
  }
  componentDidMount() {
    if (localStorage.getItem('sender_id')) {
      console.log(localStorage.getItem('sender_id'))
      this.setState({ sender_id: localStorage.getItem('sender_id'), register:false, login:true, page: "chat" })
      if(this.state.sender_id.length > 0){
        fetch('https://va-ftech.dev.ftech.ai/api/tracker_redis_storage/get_trackers_by_sender_id/' + localStorage.getItem('sender_id'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json()).then(data => {
          if (data.length > 0) {
            let data_new_struc = []
            for (let item in data) {
              let each_item = {}
              each_item['text'] = data[item].usr_utterance.text
              each_item['rule'] = 'user'
              data_new_struc.push(each_item)
              each_item = {}
              each_item['text'] = data[item].sys_utterance.text
              each_item['rule'] = 'bot'
              each_item['time_stamp'] = data[item].time_stamp
              data['time_stamp'] = each_item['time_stamp']
              each_item['intent'] = data[item].raw_sys_acts[0].intent
              if (Object.keys(data[item].sys_utterance._meta).length > 0) {
                if (data[item].sys_utterance._meta.buttons) {
                  each_item['buttons'] = data[item].sys_utterance._meta.buttons
                } else {
                  each_item['buttons'] = []
                }
                if (data[item].sys_utterance._meta.image) {
                  if (typeof (data[item].sys_utterance._meta.image) === 'string') {
                    each_item['images'] = [data[item].sys_utterance._meta.image]
                  } else {
                    each_item['images'] = data[item].sys_utterance._meta.image
                  }
                } else {
                  each_item['images'] = []
                }
              } else {
                each_item['buttons'] = []
                each_item['images'] = []
              }
              data_new_struc.push(each_item)
            }
            let last_time_stamp = data_new_struc[data_new_struc.length - 1]
            if (last_time_stamp.rule === 'bot') {
              last_time_stamp = last_time_stamp.time_stamp * 1000
              let time_now = new Date().getTime()
              let time_diff = time_now - last_time_stamp
              data['time_stamp'] = this.convertTime(time_diff)
            }
            this.setState({ msgList: data_new_struc, message_text: "", status_online: data.time_stamp, is_scroll: false })
            this.scrollToBottom();
          } else {
            this.setState({ msgList: [], message_text: "", status_online: "offline", is_scroll: false })
          }
        })
        fetch('https://va-ftech.dev.ftech.ai/api/tracker_redis_storage/list_all_keys', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json()).then(data => {
          this.setState({ list_all_keys: data })
        })
      }
    }
  }
  onChangePage(e) {
    this.setState({
      page: e,
      update_component: true,
      is_scroll: false
    })
  }
  onChangeAPI(e) {
    this.setState({
      api_test: e.target.value
    })
  }
  render() {
    const { inputValue_Email, inputValue_Name } = this.state;
    return (
      <div className="App">
        {this.state.login?<div className="MenuDashboard">
            <img src={logo_it} className="user-icon" alt="avatar" />
            <p className="user-name">Sam</p>
            {this.state.page === "home" ?
              <div className="MenuDashboard-item item-hovered" onClick={() => this.onChangePage('home')}>
                <div className="MenuDashboard-Selected"></div>
                <img src={home_selected} className="menu-icon" alt="grid" />
                <p className="title-name">Home</p>
              </div> :
              <div className="MenuDashboard-item" onClick={() => this.onChangePage('home')}>
                <div className="MenuDashboard-Selected"></div>
                <img src={home_default} className="menu-icon" alt="grid" />
                <p className="title-name">Home</p>
              </div>
            }
            {this.state.page === "chat" ?
              <div className="MenuDashboard-item item-hovered" onClick={() => this.onChangePage('chat')}>
                <div className="MenuDashboard-Selected"></div>
                <img src={message_selected} className="menu-icon" alt="chat" />
                <p className="title-name">Chat</p>
              </div> :
              <div className="MenuDashboard-item" onClick={() => this.onChangePage('chat')}>
                <div className="MenuDashboard-Selected"></div>
                <img src={message_default} className="menu-icon" alt="chat" />
                <p className="title-name">Chat</p>
              </div>
            }
            {this.state.page === "setting" ?
              <div className="MenuDashboard-item item-hovered" onClick={() => this.onChangePage('setting')}>
                <div className="MenuDashboard-Selected"></div>
                <img src={setting_selected} className="menu-icon" alt="setting" />
                <p className="title-name">Setting</p>
              </div> :
              <div className="MenuDashboard-item" onClick={() => this.onChangePage('setting')}>
                <div className="MenuDashboard-Selected"></div>
                <img src={setting_default} className="menu-icon" alt="setting" />
                <p className="title-name">Setting</p>
              </div>
            }
            <div className="users-container">
              <ul className="list-users">
                {this.state.list_all_keys.map((item, index) => {
                  return (
                    <li className="item-user" key={index} onClick={() => this.onChangeId(item)}>
                      <img src={"https://www.w3schools.com/w3css/img_avatar" + (Math.floor(Math.random() * 5) + 1).toString() + ".png"} className="item-user-avatar" alt={item} title={item} />
                      <div className="item-user-content">
                        <span className="item-user-content-name">{item}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="MenuDashboard-refresh" onClick={() => { window.location.reload(false); this.setState({ is_scroll: false, update_component: true }); this.scrollToBottom(); }}>
              <div className="MenuDashboard-Selected"></div>
              <img src={refresh} className="menu-icon" alt="refresh" />
              <p className="title-name">Refresh</p>
            </div>
        </div>:null}
        {this.state.page === "login" ?<div className="container-login100" id="main">
          <div className="wrap-login100">
            <div className="login100-pic js-tilt" data-tilt>
              <img src={logo_dh} alt="IMG" title='Mát hem?'/>
            </div>
            <form className="login100-form validate-form">
              <span className="login100-form-title"> Member Login</span>
              <div className="wrap-input100 validate-input">
                <input className="input100" type="text" name="name" placeholder=" Username" spellCheck="false" value={inputValue_Name} onChange={e => this.onInputChange_Name(e)} />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </span>
              </div>
              <div className="wrap-input100 validate-input" data-validate="Email is required">
                <input className="input100" type="text" name="email" placeholder=" Email" spellCheck="false" value={inputValue_Email} onChange={e => this.onInputChange_Email(e)} />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>
              <div className="container-login100-form-btn">
                <button type="button" className="login100-form-btn" onClick={this.onLoginPress}>{this.state.register?'Register':'Login'}</button>
              </div>
              <div className="text-center p-t-136">
                <a className="txt2" href="#">Welcome to Sam</a>
              </div>
            </form>
          </div>
        </div>:null}
        {this.state.page === "home" ? <div>
        </div> : null}
        {this.state.page === "chat" ? <div>
          <div className="ContentDashboard">
            <div className="Chatboard">
              <div className="Chatboard-header">
                <div className="Chatboard-header-left">
                  <img src={logo_it} className="user-chat-icon" alt="avatar" />
                  <div className="Chatboard-header-info">
                    <p className="user-chat-name">Sam</p>
                    <p className="user-chat-time">{this.state.status_online}</p>
                  </div>
                </div>
              </div>
              <div className="Chatboard-body">
                <div className="Chatboard-body-chatbox" onScroll={() => { this.setState({ is_scroll: true }) }}>
                  {
                    this.state.msgList.map((msg, index) => {
                      if (msg.rule === "user") {
                        return (
                          <div className="Message user" ref={(el) => { this.messagesEnd = el; }} key={index}>
                            <div className="Message-content">
                              {msg.text}
                            </div>
                            <img src={avatar} className="message-chat-icon" alt="avatar" />
                          </div>
                        )
                      }
                      if (msg.rule === "bot") {
                        return (
                          <div ref={(el) => { this.messagesEnd = el; }} key={index}>
                            <div className="Message bot">
                              <img src={logo_it} className="message-chat-icon" alt="avatar" />
                              <div className="Message-content">
                                {msg.text}
                              </div>
                            </div>
                            <div className="Message-check">
                              <p>{msg.intent} <input type="checkbox" label="Checkbox" key={index} /></p>
                            </div>
                            {msg.buttons.length > 0 ?
                              <div className="Message-action">
                                {msg.buttons.map((button_item, index) => {
                                  return (
                                    <button className="btn-action" onClick={() => this.onSendMessage(button_item.title)} key={index}>{button_item.title}</button>
                                  )
                                })}
                              </div> : null}
                            {
                              msg.images.length > 0 ?
                                <div className="Message-grid-row">
                                  {msg.images.map((image_item, index) => {
                                    return (
                                      <div className="Message-grid-col" key={index}>
                                        <img src={image_item} className="message-image" alt="image" key={index} id={"img" + image_item.split('/')[image_item.split('/').length - 1].split('.')[0]} onClick={() => this.onFullSize("img" + image_item.split('/')[image_item.split('/').length - 1].split('.')[0])} />
                                      </div>
                                    )
                                  })}
                                </div> : null
                            }
                          </div>
                        )
                      }
                    })
                  }
                </div>
                <div className="Chatboard-body-input">
                  <div className="Chatboard-body-button add">
                    <img src={add} className="chatbody-icon" alt="logo" />
                  </div>
                  <input className="chatbody-input" type="text" placeholder="Type a message..." onChange={e => this.onChange(e)} onKeyDown={e => this.handleKeyDown(e)} value={this.state.message_text} />
                  <div className="Chatboard-body-button send" onClick={() => this.onSendMessage('')}>
                    <img src={send} className="chatbody-icon" alt="logo" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> : null}
        {this.state.page === "setting" ? <div>
          <div className="ContentDashboard">
            <div className="Chatboard">
              <div className="Chatboard-header">
                <div className="Chatboard-header-left">
                  <img src={logo_it} className="user-chat-icon" alt="avatar" />
                  <div className="Chatboard-header-info">
                    <p className="user-chat-name">Sam</p>
                    <p className="user-chat-time">{this.state.status_online}</p>
                  </div>
                </div>
              </div>
              <div className="Chatboard-body setting">
                <div className="Chatboard-body-input setting">
                  <p className="title-name-setting">API ADDRESS: </p>
                  <input className="chatbody-input" type="text" placeholder="API ADDRESS..." onChange={e => this.onChangeAPI(e)} value={this.state.api_test} />
                </div>
              </div>
            </div>
          </div>
        </div> : null}
      </div>
    );
  }
}

export default App;
