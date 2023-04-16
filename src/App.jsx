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

  const requestBody = {
    'model': "gpt-3.5-turbo",
    'messages': [
      systemMessage,
      ...AllMessages.messages
    ]
  }

  async function requestRespond() {
    setStatus(true)
    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      setStatus(false)
      const newData = {
        role: 'assistant',
        content: data.choices[0].message.content
      }
      const { messages } = AllMessages
      messages.push(newData)
      setNewMessage(messages)
      console.log(AllMessages)
    })
  }

  const Request = () => {
    const newData = {
      role: 'user',
      content: text
    }

    setText('')
    const { messages } = AllMessages
    messages.push(newData)
    setNewMessage(messages)
    requestRespond()
  }

  return (
    <div className="App">
      <div className='respond'>
        {AllMessages.messages.length > 0 ? AllMessages.messages.map((message) => (
          <p className={message.role}>{message.content}</p>
        )) :
          <p className='no-message'>No messages yet</p>
        }
        {status ? <p className='loader-div system'><span className='loader'></span></p> : ''}
      </div>
      <div className='form'>
        <input value={text} type="text" placeholder='Enter the question ...' className='question' name="" onChange={e => { setText(e.target.value) }} id="" />
        <button onClick={Request}>Submit</button>
      </div>
    </div>
  )
}

export default App
