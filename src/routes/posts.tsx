import * as zod from 'zod'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'

import { ModalDeleteComponent } from '../components/ModalDeleteComponent'
import { ModalEditComponent } from '../components/ModalEditComponent'
import { createPost, deletePost, getPosts, updatePost } from '../services/posts'
import { PostCardComponent } from '../components/PostCardComponent'


export const Route = createFileRoute('/posts')({
  component: RouteComponent,
})

type PostFormData = {
  title: string
  content: string
}

type Post = {
  id?: number | null
  username: string
  created_datetime?: string
  title: string
  content: string
}

function RouteComponent() {
  const [currentTime, setCurrentTime] = useState(() => Date.now())
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<number | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [postToEdit, setPostToEdit] = useState<Post | null>(null)
  const [posts, setPosts] = useState<Post[]>([])

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

  const onSubmit = async (data: PostFormData) => {
    const newPost: Post = {
      title: data.title,
      content: data.content,
      username: localStorage.getItem('username') || '@Anonymous',
    }
    await createPost(newPost)
    const fetchedPosts = await getPosts()
    setPosts(fetchedPosts.results)
    reset()
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    getPosts().then(fetchedPosts => {
      setPosts(fetchedPosts.results)
    })
  }, [])

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
                className="bg-indigo-400 text-white px-8 py-2 rounded-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed min-w-30"
              >
                Create
              </button>
            </div>
          </form>
        </article>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCardComponent 
              key={post.id}
              post={post}
              currentTime={currentTime}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              setPostToDelete={setPostToDelete}
              setIsEditModalOpen={setIsEditModalOpen}
              setPostToEdit={setPostToEdit}
            />
          ))}
        </div>
      </div>
      <ModalDeleteComponent 
        isOpen={isDeleteModalOpen} 
        onClose={() => { setIsDeleteModalOpen(false); setPostToDelete(null); }} 
        onDelete={async () => {
            if (postToDelete) {
            await deletePost(postToDelete);
            const fetchedPosts = await getPosts();
            setPosts(fetchedPosts.results);
            }
          setIsDeleteModalOpen(false);
          setPostToDelete(null);
        }}
      />
      <ModalEditComponent 
        isOpen={isEditModalOpen} 
        onClose={() => {setIsEditModalOpen(false); setPostToEdit(null);}}
        onSave={async (title: string, content: string) => {
          if (postToEdit && postToEdit.id) {
            await updatePost(postToEdit.id, { title, content });
            const fetchedPosts = await getPosts();
            setPosts(fetchedPosts.results);
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
