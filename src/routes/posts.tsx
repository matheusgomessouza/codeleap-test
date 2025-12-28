import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useState, useEffect } from 'react'
import { ModalDeleteComponent } from '../components/ModalDeleteComponent'
import { ModalEditComponent } from '../components/ModalEditComponent'

export const Route = createFileRoute('/posts')({
  component: RouteComponent,
})

type PostFormData = {
  title: string
  content: string
}

type Post = {
  id: string
  title: string
  content: string
  username: string
  timestamp: Date
}

function RouteComponent() {
  const [currentTime, setCurrentTime] = useState(() => Date.now())
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [postToEdit, setPostToEdit] = useState<Post | null>(null)
  const [posts, setPosts] = useState<Post[]>(() => [
    {
      id: '1',
      title: 'My First Post at CodeLeap Network!',
      content: 'Curabitur suscipit suscipit tellus. Phasellus consectetuer vestibulum elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas egestas arcu quis ligula mattis placerat. Duis vel nibh at velit scelerisque suscipit.\n\nDuis lobortis massa imperdiet quam. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Fusce a quam. Nullam vel',
      username: 'Victor',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
    },
    {
      id: '2',
      title: 'My Second Post at CodeLeap Network!',
      content: 'Curabitur suscipit suscipit tellus. Phasellus consectetuer vestibulum elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas egestas arcu quis ligula mattis placerat. Duis vel nibh at velit scelerisque suscipit.\n\nDuis lobortis massa imperdiet quam. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Fusce a quam. Nullam vel',
      username: 'Vini',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const schema = zod.object({
    title: zod.string().min(1, 'Title is required'),
    content: zod.string().min(1, 'Content is required'),
  })

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data: PostFormData) => {
    const newPost: Post = {
      id: crypto.randomUUID(),
      title: data.title,
      content: data.content,
      username: localStorage.getItem('username') || '@Anonymous',
      timestamp: new Date(),
    }
    setPosts([newPost, ...posts])
    reset()
  }

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((currentTime - date.getTime()) / 60000)
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`
    const days = Math.floor(hours / 24)
    return `${days} days ago`
  }

  return (
    <main className="bg-[#DDDDDD] min-h-screen w-full flex justify-center">
      <div className="w-full max-w-3xl h-min-screen bg-white p-6 space-y-6 relative pt-26">
        <header className="bg-indigo-400 text-white py-6 px-6 mb-0 absolute top-0 left-0 w-full">
          <h1 className="text-2xl font-bold">CodeLeap Network</h1>
        </header>

        <article className="bg-white border border-gray-300 px-6 py-6 mb-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-6">What's on your mind?</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-base mb-2">
                Title
              </label>
              <input
                {...register('title')}
                type="text"
                id="title"
                placeholder="Hello world"
                className="border border-gray-400 rounded-lg w-full px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-base mb-2">
                Content
              </label>
              <textarea
                {...register('content')}
                id="content"
                placeholder="Content here"
                rows={4}
                className="border border-gray-400 rounded-lg w-full px-3 py-2 text-sm resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!isValid}
                className="bg-indigo-400 text-white px-8 py-2 rounded-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </form>
        </article>

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-gray-300 overflow-hidden rounded-2xl"
            >
              <div className="bg-indigo-400 text-white py-6 px-6 flex justify-between items-center">
                <h3 className="text-xl font-bold">{post.title}</h3>
                <div className="flex gap-4">
                  {post.username === localStorage.getItem("username") && (
                    <>
                      <button className="hover:opacity-80" title="Delete" onClick={() => { setPostToDelete(post.id); setIsDeleteModalOpen(true); }}>
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button className="hover:opacity-80" title="Edit" onClick={() => { setPostToEdit(post); setIsEditModalOpen(true); }}>
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                  </>
                )}
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="flex justify-between items-center mb-4 text-gray-600 text-sm">
                  <span className="font-bold">@{post.username}</span>
                  <span>{getTimeAgo(post.timestamp)}</span>
                </div>
                <p className="text-base whitespace-pre-line text-gray-800">
                  {post.content}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <ModalDeleteComponent 
        isOpen={isDeleteModalOpen} 
        onClose={() => { setIsDeleteModalOpen(false); setPostToDelete(null); }} 
        onDelete={() => {
          if (postToDelete) {
            setPosts(posts.filter(p => p.id !== postToDelete));
          }
          setIsDeleteModalOpen(false);
          setPostToDelete(null);
        }}
      />
      <ModalEditComponent 
        isOpen={isEditModalOpen} 
        onClose={() => { setIsEditModalOpen(false); setPostToEdit(null); }} 
        onSave={(title: string, content: string) => {
          if (postToEdit) {
            setPosts(posts.map(p => p.id === postToEdit.id ? { ...p, title, content } : p));
          }
          setIsEditModalOpen(false);
          setPostToEdit(null);
        }}
        initialTitle={postToEdit?.title || ''}
        initialContent={postToEdit?.content || ''}
      />
    </main>
  )
}
