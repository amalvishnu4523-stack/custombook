import { useState, useRef } from 'react'
import { MessageSquare, Trash2, Bold, Italic, Underline } from 'lucide-react'

const INITIAL_COMMENTS = [
  { id: 1, author: 'Amal Vishnu', date: '08/09/2026 02:50 PM', text: 'nice' },
  { id: 2, author: 'Amal Vishnu', date: '08/09/2026 02:50 PM', text: 'ddd' },
]

function Comments() {

  
  const [comments, setComments] = useState(INITIAL_COMMENTS)
  const [text, setText]         = useState('')
  const editorRef               = useRef()

  /* ── Rich text toolbar actions ── */
  function execFormat(cmd) {
    editorRef.current?.focus()
    document.execCommand(cmd, false, null)
  }

  function handleAdd() {
    const raw = editorRef.current?.innerText?.trim()
    if (!raw) return
    const now = new Date()
    const date = `${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} ${now.getHours()>=12?'PM':'AM'}`

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    const author = currentUser.name || currentUser.username || 'You'

    setComments(prev => [
      ...prev,
      { id: Date.now(), author, date, text: raw },
    ])
    if (editorRef.current) editorRef.current.innerText = ''
    setText('')
  }

  function handleDelete(id) {
    setComments(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="p-6 max-w-2xl">

      {/* ── Editor ── */}
      <div className="rounded-lg border border-gray-200 overflow-hidden mb-6">

        {/* Toolbar */}
        <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-2">
          {[
            { icon: Bold,      cmd: 'bold',      title: 'Bold' },
            { icon: Italic,    cmd: 'italic',    title: 'Italic' },
            { icon: Underline, cmd: 'underline', title: 'Underline' },
          ].map(({ icon: Icon, cmd, title }) => (
            <button
              key={cmd}
              type="button"
              onMouseDown={e => { e.preventDefault(); execFormat(cmd) }}
              title={title}
              className="flex h-7 w-7 items-center justify-center rounded text-gray-600 hover:bg-gray-200 transition"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Editable area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={e => setText(e.currentTarget.innerText)}
          className="min-h-[80px] px-4 py-3 text-sm text-gray-800 outline-none"
        />

        {/* Add Comment button */}
        <div className="border-t border-gray-200 px-3 py-2">
          <button
            type="button"
            onClick={handleAdd}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Add Comment
          </button>
        </div>
      </div>

      {/* ── Comments list ── */}
      {comments.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              All Comments
            </span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {comments.length}
            </span>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">

                {/* Icon */}
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-500">
                  <MessageSquare className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{comment.author}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{comment.date}</span>
                  </div>
                  <div className="flex items-start justify-between rounded-lg bg-gray-50 px-4 py-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      className="ml-4 shrink-0 text-gray-400 hover:text-red-500 transition"
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {comments.length === 0 && (
        <p className="text-sm text-gray-400">No comments yet.</p>
      )}

    </div>
  )
}

export default Comments
