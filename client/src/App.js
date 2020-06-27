import React, { useState, useEffect } from 'react'
import socketIOClient from "socket.io-client"
import uuid from 'react-uuid'
import AceEditor from "react-ace"
import './App.css'

const ENDPOINT = "/";

function App() {
    const [socket, setSocket] = useState(null)
    const [editorText, setEditorText] = useState(null)
    const [userId, setUserId] = useState(uuid())

    useEffect(() => {
        setSocket(socketIOClient(ENDPOINT))
    }, [])

    useEffect(() => {
        if(socket) {
            socket.emit("join", {
                userId
            }, response => {
                console.log(response)
            })

            socket.on("textAreaChangeResponse", response => {
                setEditorText(response.data)
            })
        }
    }, [socket])

    const onChange = data => {
        setEditorText(data)
        if(socket) {
            socket.emit("textAreaChange", {
                userId,
                data: data
            })
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <AceEditor
                    placeholder="Type your javascript code here"
                    mode="javascript"
                    theme="monokai"
                    name="editor"
                    onChange={onChange}
                    value={editorText}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    setOptions={{
                        enableBasicAutocompletion: false,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                    }} />
            </header>
        </div>
    );
}

export default App;
