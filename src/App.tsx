import {useState} from "react";

interface ChatHistory {
  role: string,
  parts: string,
}


const App = () => {
  const [value, setValue] = useState("")
  const [chatHistory, setChatHistory] = useState<[] | ChatHistory[]>([])
  const [error, setError] = useState("")

  const randomOption = [
    "Who won the latest Novel Peace Prize?",
    "Where does pizza come from?",
    "Who do you make a BTL sandwich?"
  ]

  const selectRandomOption = () => {
    const randomValue = randomOption[Math.floor(Math.random() * randomOption.length)]
    setValue(randomValue);
  }

  const getResponse = async ()=> {
    if(!value){
      setError("Error! Please ask a question!")
      return
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }

      const response = await fetch("http://localhost:8000/gemini", options)

      const data = await response.text()

      console.log(data)

      setChatHistory(oldChatHistory => [...oldChatHistory, {
        role: 'user',
        parts: value
      },{
        role: "model",
        parts: data
      }])

      setValue("")

    }catch (error){
      console.error(error)
      setError("Something went wrong! Please try again later.")
    }
  }

  const clear = () => {
    setValue("")
    setError("")
    setChatHistory([])
  }

  return (
        <div className="app">
          <p>What do you want to know?
            <button className="random-option" onClick={selectRandomOption} disabled={!chatHistory}>Random Option</button>
          </p>
          <div className="input-container">
            <input type="text" value={value} placeholder="When is Christmas...?" onChange={(e) =>setValue(e.target.value)}/>
            {!error && <button onClick={getResponse}>Ask me</button>}
            {error && <button onClick={clear}>Clear</button>}
          </div>
          {error && <p>{error}</p>}
          <div className="search-result">
            {chatHistory.map((chatItem, _index)=>
                <div key={_index}>
                  <p className="answer">{chatItem.role}: {chatItem.parts}</p>
                </div>
            )}

          </div>
        </div>
  )
}

export default App
