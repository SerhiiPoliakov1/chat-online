import React, { useEffect, useState, useCallback } from 'react'
import jwt_decode from "jwt-decode";
import '../App.css';


const Home = (props) => {



  let [users, setUsers] = useState([]);

  const [message, setMessage] = useState('')

  let [currentUser, setCurrentUser] = useState(null);

  const [recipientName, setRecipientName] = useState('')
  const [listOfUsers, setListOfUsers] = useState([])
  let [userStartChat, setuserStartChat] = useState(null)
  let [chat, setChat] = useState({})
  const [messages, setMessages] = useState([])


  useEffect(() => {
    getCurrentUser();
    getAllUsers();

  }, []);

  useEffect(() => {
    setTimeout(()=>{getMessagesFromChat()},5000)

  });

 


  const getAllUsers = async (e) => {

    const response = await fetch("https://chat-online-baackend.herokuapp.com/users", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '.concat(sessionStorage.getItem('jwt')),
        'Access-Control-Allow-Origin': '*'
      }
    })
    const allUsers = await response.json()
    setUsers(allUsers)

  }



  const submit1 = async (e) => {
    e.preventDefault();
    await fetch("https://chat-online-baackend.herokuapp.com/users", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '.concat(sessionStorage.getItem('jwt')),
        'Access-Control-Allow-Origin': '*'
      }
    }).then(response => response.json())
      .then((data) => {
        users = data
        console.log(users)
      })
      .catch((error) => {
        console.error(error);
      });
  }


  function onUsername(e) {
    setRecipientName(e.target.value)

  }

  function onMessage(e) {
    setMessage(e.target.value)

  }


  const getChat = async () => {
    const response = await fetch("https://chat-online-baackend.herokuapp.com/api/user/".concat(currentUser.id).concat("/chat/recipient/").concat(userStartChat.id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '.concat(sessionStorage.getItem('jwt')),
        'Access-Control-Allow-Origin': '*'
      }
    })
    const c = await response.json()
    setChat(c)
  }

  const findByUsername = async (e) => {
    e.preventDefault();

    const result = users.find(user => user.username === recipientName)
    if (result !== undefined) {
      setuserStartChat(result)
      if (checkChatOnExist(result.id, currentUser.id) !== 200)
        createChat(result)
      else getChat()
    }


  }


  const checkChatOnExist = async (recipientId, senderId) => {
    const response = await fetch("https://chat-online-baackend.herokuapp.com/api/user/".concat(senderId).concat("/chat/recipient/").concat(recipientId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '.concat(sessionStorage.getItem('jwt')),
        'Access-Control-Allow-Origin': '*'
      }
    })
    const chatCheck = await response.json()
    if (response.status == 200) {

      return 200;
    }
    return 500

  }




  const getCurrentUser = async () => {

    const response = await fetch("https://chat-online-baackend.herokuapp.com/users/current",
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '.concat(sessionStorage.getItem('jwt')),
          'Access-Control-Allow-Origin': '*'
        }
      })
    const cu = await response.json();


    setCurrentUser(cu)
    console.log(currentUser);
  }

  const createChat = async (recipient) => {
    const response = await fetch("https://chat-online-baackend.herokuapp.com/api/user/".concat(currentUser.id).concat("/chat/add/").concat(recipient.id),
      {
        method: 'POST',
        headers: {

          'Authorization': 'Bearer '.concat(sessionStorage.getItem('jwt'))

        }
      })
    const newChat = await response.json();
    setChat(newChat)

    console.log(newChat);

  }



  const sendMessage = async (e) => {
    let mess = {
      recipientId: userStartChat.id,
      senderId: currentUser.id,
      message: message
    }
    e.preventDefault();
    console.log(userStartChat)
    console.log(currentUser)
    await fetch("https://chat-online-baackend.herokuapp.com/api/user/".concat(currentUser.id).concat("/message/send"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '.concat(sessionStorage.getItem('jwt')),
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(mess)
    }).then(response => response.json())
      .then((data) => {

        console.log(data)
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(chat)
  }



  const getMessagesFromChat =
    async () => {
      console.log('2 - ', userStartChat);
      if (currentUser && currentUser.id !== undefined && userStartChat && userStartChat.id !== undefined) {
        const response = await fetch("https://chat-online-baackend.herokuapp.com/api/user/".concat(currentUser.id).concat("/chat/").concat(userStartChat.id).concat("/message"),
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '.concat(sessionStorage.getItem('jwt')),
              'Access-Control-Allow-Origin': '*'
            }
          })

        const listOfMessages = await response.json()
        setMessages(listOfMessages)
        console.log(messages);

      }
    }




  return (

    <div className="container">
      <div className="row mysettings-menu mysettings-find-button" >
        <form className="d-flex" onSubmit={findByUsername}>
          <input className="form-control me-2" type="search" placeholder="Recipient`s username" aria-label="Search" onChange={onUsername} name="username" />
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>

      <div>

        {messages.map(m => <li key={m.id}> {m.time} <br /> {m.message}  <b>{m.author}</b></li>)}
      </div>


      <form onSubmit={sendMessage}>
        <div className="mysettings-send-message-button" >
          <input type="text" className="form-control" placeholder="Message" aria-label="Recipient's username" onChange={onMessage} aria-describedby="button-addon2" />
          <button className="btn btn-outline-secondary" type="submit" id="button-addon2" >Send</button>

        </div>
      </form>

    </div>

  )
}
export default Home;