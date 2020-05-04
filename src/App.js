import React, { useState } from 'react'
import './App.css'
import { useEffectAsync } from '@availity/hooks'
import { API, graphqlOperation } from 'aws-amplify'
import {
  Button,
  Input,
  TextareaAutosize,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent
} from '@material-ui/core'
import { addAquarium, addOnsen, addShrime } from './graphql/mutations'
import { buildReplyText } from 'line-message-builder'

const categories = {
  aquarium: 'オンライン水族館',
  shrime: 'オンライン神社',
  onsen: 'オンライン温泉',
}

const liff = window.liff

const App = () => {

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState('aquarium')
  const [writedTitle, setWritedTitle] = useState(false)
  const [writedUrl, setWritedUrl] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  useEffectAsync(async () => {
    await liff.init({ liffId: process.env.REACT_APP_LIFF_ID })
    if (!liff.isLoggedIn()) {
      liff.login()
    }
  })

  const shareToFriends = async () => {
    await liff.shareTargetPicker([
      buildReplyText(`suggest@online.lifeで${categories[category]}について投稿したよ`),
      buildReplyText('よかったら↓を友達登録をして見てみてください'),
      buildReplyText('https://lin.ee/jffKuHOU')
    ])
  }

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
    setOpenDialog(true)
    clearAll()
  }

  return (
    <div className="App">
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="common-dialog-title"
        aria-describedby="common-dialog-description"
      >
        <DialogContent>
          <div>ありがとうございます！</div>
          <div>投稿したことを早速お友達とシェアしませんか？</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={async () => {
            setOpenDialog(false)
            await shareToFriends()
          }} color="primary">
            する
          </Button>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            しない
          </Button>
        </DialogActions>
      </Dialog>
      <div className="category">
        <div>カテゴリ</div>
        <div>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} >
            <MenuItem value={'aquarium'}>{categories.aquarium}</MenuItem>
            <MenuItem value={'shrime'}>{categories.shrime}</MenuItem>
            <MenuItem value={'onsen'}>{categories.onsen}</MenuItem>
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
