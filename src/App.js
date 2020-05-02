import React, { useState } from 'react';
import './App.css';
import { API, graphqlOperation } from "aws-amplify";
import { addAquarium, addOnsen, addShrime } from './graphql/mutations'

const App = () => {

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState('aquarium')

  const amusement = {
    title,
    url,
    summary,
  }

  const post = async () => {
    switch (category) {
      case 'aquarium':
        await API.graphql(graphqlOperation(addAquarium, { amusement }))
        return
      case 'shrime':
        await API.graphql(graphqlOperation(addShrime, { amusement }))
        return
      case 'onsen':
        await API.graphql(graphqlOperation(addOnsen, { amusement }))
        return
      default:
        return
    }
  }

  return (
    <div className="App">
      <div className="select">
        <select value={category} onChange={(e) => setCategory(e.target.value)} >
          <option value={'aquarium'}>オンライン水族館</option>
          <option value={'shrime'}>オンライン神社</option>
          <option value={'onsen'}>オンライン温泉</option>
        </select>
      </div>
      <div className="input">
        title:
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        url:
        <input value={url} onChange={(e) => setUrl(e.target.value)} />
      </div>
      <div>
        summary:
        <input value={summary} onChange={(e) => setSummary(e.target.value)} />
      </div>
      <div className="button">
        <button onClick={post} >submit</button>
      </div>
    </div>
  );
}

export default App;
