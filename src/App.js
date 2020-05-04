import React, { useState } from 'react'
import './App.css'
import { API, graphqlOperation } from 'aws-amplify'
import { Button, Input, TextareaAutosize, Select, MenuItem } from '@material-ui/core'
import { addAquarium, addOnsen, addShrime } from './graphql/mutations'

const App = () => {

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState('aquarium')
  const [writedTitle, setWritedTitle] = useState(false)
  const [writedUrl, setWritedUrl] = useState(false)

  const clearAll = () => {
    setTitle('')
    setUrl('')
    setSummary('')
    setWritedUrl(false)
    setWritedTitle(false)
  }

  const post = async () => {
    const amusement = {
      title,
      url,
      summary: summary || 'この投稿には説明文がありません',
    }
    switch (category) {
      case 'aquarium':
        await API.graphql(graphqlOperation(addAquarium, { amusement }))
        break
      case 'shrime':
        await API.graphql(graphqlOperation(addShrime, { amusement }))
        break
      case 'onsen':
        await API.graphql(graphqlOperation(addOnsen, { amusement }))
        break
      default:
        break
    }
    alert('投稿ありがとうございます')
    clearAll()
  }

  return (
    <div className="App">
      <div className="category">
        <div>カテゴリ</div>
        <div>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} >
            <MenuItem value={'aquarium'}>オンライン水族館</MenuItem>
            <MenuItem value={'shrime'}>オンライン神社</MenuItem>
            <MenuItem value={'onsen'}>オンライン温泉</MenuItem>
          </Select>
        </div>
      </div>
      <div className="title">
        <div>タイトル</div>
        <Input value={title} className="titleInput" onChange={(e) => {
          setTitle(e.target.value)
          setWritedTitle(!!e.target.value)
        }} />
      </div>
      <div className="url">
        <div>URL</div>
        <Input value={url} className="urlInput" onChange={(e) => {
          setUrl(e.target.value)
          setWritedUrl(!!e.target.value)
        }} />
      </div>
      <div className="description">
        <div>説明（省略可）</div>
        <TextareaAutosize rowsMin={4} value={summary} onChange={(e) => setSummary(e.target.value)} className="textArea" />
      </div>
      <div className="button">
        <Button variant="contained" color="primary" onClick={post} disabled={!(writedUrl && writedTitle)}>
          投稿する
        </Button>
      </div>
    </div>
  )
}

export default App
