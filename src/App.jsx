import { useState } from 'react'
import './App.scss'

function App() {

  const API_KEY = '' // '<Your OpenAI API key>'
  const Behaviour = 'Explain like I am 10 years old.'

  const [text, setText] = useState('')
  const [respond, setRespond] = useState(null)
  const [status, setStatus] = useState(false)

  function setValue(inp) {
    setText(inp.target.value)
  }

  const systemMessage = {
    role: 'system',
    content: Behaviour
  }

  async function requestRespond() {
    setRespond(null)
    setStatus(true)

    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
        'model': "gpt-3.5-turbo",
        'messages': [
          systemMessage, 
          { role: 'user', content: text}
        ]
      })
    }).then((data) => {
      return data.json();
    }).then((data) => {
      setStatus(false)
      setRespond(data.choices[0].message.content)
      console.log(data.choices[0].message.content)
    })
  }

  return (
    <div className="App">
      <div className='form'>
        <input value={text.content} type="text" placeholder='Enter the question ...' className='question' name="" onChange={setValue} id="" />
        <button onClick={requestRespond}>Submit</button>
      </div>
      <div className='respond'>
        {status ? <p className='loader-div'><span className='loader'></span></p> : ''}
        {respond ? <p>{respond}</p> : '' }
      </div>
    </div>
  )
}

export default App
