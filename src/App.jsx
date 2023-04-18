import { useState } from 'react'
import './App.scss'

function App() {

  const API_KEY = '' // '<Your OpenAI API key>'
  const Behaviour = 'Explain like I am 10 years old.'

  const [text, setText] = useState('')
  const [status, setStatus] = useState(false)
  const [AllMessages, SetAllMessages] = useState({ messages: [] })

  const setNewMessage = (messages) => {
    SetAllMessages({ messages })
    window.scrollTo(0, document.body.scrollHeight);
  }

  const systemMessage = {
    role: 'system',
    content: Behaviour
  }

  const headerData = {
    'Authorization': 'Bearer ' + API_KEY,
    'Content-Type': 'application/json'
  }

  const getBodyData = () => {
    return [
      systemMessage,
      ...AllMessages.messages
    ]
  }

  const createNewData = (role, content) => {
    return {
      role: role,
      content: content
    }
  }

  async function requestRespond() {
    setStatus(true)
    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: headerData,
      body: JSON.stringify({
        'model': "gpt-3.5-turbo",
        'messages': getBodyData()
      })
    }).then((data) => {
      return data.json();
    }).then((data) => {
      setStatus(false)
      const { messages } = AllMessages
      messages.push(createNewData('assistant', data.choices[0].message.content))
      setNewMessage(messages)
      console.log(AllMessages)
    })
  }

  const Request = () => {
    setText('')
    const { messages } = AllMessages
    messages.push(createNewData('user', text))
    setNewMessage(messages)
    requestRespond()
  }

  return (
    <div className="App">
      {/* request and responses start */}
      <div className='respond'>
        {AllMessages.messages.length > 0 ? AllMessages.messages.map((message, index) => (
          <p key={index} className={message.role}>{message.content}</p>
        )) :
          <p className='no-message'>No messages yet</p>
        }
        {status ? <p className='loader-div system'><span className='loader'></span></p> : ''}
      </div>
      {/* request and responses start */}

      {/* form start*/}
      <div className='form'>
        <input value={text} type="text" placeholder='Enter the question ...' className='question' name="" onChange={e => { setText(e.target.value) }} id="" />
        <button onClick={Request}>Submit</button>
      </div>
      {/* form end*/}
    </div>
  )
}

export default App
