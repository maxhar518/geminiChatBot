import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'

const ChatGPTClone = () => {
  const [messages, setMessages] = useState([
    { id: 1, content: "Hello! How can I assist you today?", sender: "ai" }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (inputMessage.trim() !== "") {
      const newUserMessage = { id: messages.length + 1, content: inputMessage, sender: "user" }
      setMessages([...messages, newUserMessage])
      setInputMessage("")
      setIsLoading(true)

      try {
        const response = await fetch('http://localhost:3002/api/content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: inputMessage }),
        })
        const data = await response.json()
        const newAiMessage = { id: messages.length + 2, content: data.result, sender: "ai" }
        setMessages(prevMessages => [...prevMessages, newAiMessage])
      } catch (error) {
        console.error('Error:', error)
        const errorMessage = { id: messages.length + 2, content: "An error occurred. Please try again.", sender: "ai" }
        setMessages(prevMessages => [...prevMessages, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Custom renderer for code blocks
  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter
          style={darcula}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'} mb-4`}>
            <div className={`flex ${message.sender === 'ai' ? 'flex-row' : 'flex-row-reverse'} items-start max-w-[80%]`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${message.sender === 'ai' ? 'bg-blue-500' : 'bg-green-500'}`}>
                {message.sender === 'ai' ? 'AI' : 'U'}
              </div>
              <div className={`mx-2 p-3 rounded-lg ${message.sender === 'ai' ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
                {message.sender === 'ai' ? (
                  <ReactMarkdown components={renderers}>
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex flex-row items-start max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                AI
              </div>
              <div className="mx-2 p-3 rounded-lg bg-gray-200">
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 mr-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatGPTClone
