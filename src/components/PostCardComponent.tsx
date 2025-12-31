import * as zod from 'zod';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react';
import { getTimeAgo } from '../utils/time';
import { MdDeleteForever, MdComment } from "react-icons/md";
import { PiNotePencilBold, PiHeartFill } from 'react-icons/pi';

type PostCardProps = {
  post: {
    id?:  number | null;
    username: string;
    title: string;
    content: string;
    created_datetime?: string;
  };
  currentTime: number;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  setPostToDelete: (postId: number | null) => void;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setPostToEdit: (post: {
    id?: number | null;
    username: string;
    title: string;
    content: string;
    created_datetime?: string;
  }) => void;
};

type CommentFormData = {
  username: string;
  comment: string;
};

export function PostCardComponent({post, currentTime, setIsDeleteModalOpen, setIsEditModalOpen, setPostToDelete, setPostToEdit}: PostCardProps) {
  const currentUsername = useMemo(() => localStorage.getItem('username'), [])
  const [likes, setLikes] = useState<number>(0);
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [comments, setComments] = useState<Array<{username: string; content: string;}>>([]);

  const schema = zod.object({
    comment: zod.string().min(1, 'Content is required'),
  });

  const {
    register,
    handleSubmit,
  } = useForm<Omit<CommentFormData, "username">>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = (data: Omit<CommentFormData, "username">) => {
    const newComment = {
      username: currentUsername || 'Anonymous',
      content: data.comment,
    };
    setComments([...comments, newComment]);
    setIsCommenting(false);
    setContent('');
  };

  return (
    <article
      key={post.id}
      className="bg-white border border-gray-300 overflow-hidden rounded-2xl"
    >
      <div className="bg-indigo-400 text-white py-6 px-6 flex justify-between items-center">
        <h3 className="text-xl font-bold">{post.title}</h3>
        <div className="flex gap-4">
          {post.username === currentUsername && (
            <>
              <button className="hover:opacity-80" title="Delete" onClick={() => { setPostToDelete(post.id ?? null); setIsDeleteModalOpen(true); }}>
                <MdDeleteForever color='white' size={32} />
              </button>
              <button className="hover:opacity-80" title="Edit" onClick={() => { setPostToEdit({ ...post, id: post.id ?? null, created_datetime: post.created_datetime ?? '' }); setIsEditModalOpen(true); }}>
                <PiNotePencilBold color='white' size={32} />
              </button>
            </>
          )}
           <button className="hover:opacity-80" title="Comment" onClick={() => setIsCommenting(!isCommenting)}>
                <MdComment color='white' size={32} />
            </button>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-4 text-gray-600 text-sm">
          <span className="font-bold">@{post.username}</span>
          <span>{post.created_datetime ? getTimeAgo(new Date(post.created_datetime), currentTime) : 'Just now'}</span>
        </div>
        <p className="text-base whitespace-pre-line text-gray-800">
          {post.content}
        </p>
      </div>
      <div className="px-6 pb-6 flex items-center gap-2">
        <button 
          className="hover:opacity-80 transition-opacity cursor-pointer"
          title="Like"
          onClick={() => {
            setLikes(likes + 1);
          }}
        >
         <PiHeartFill className='fill-indigo-400' size={24} />
        </button>
        <span className="text-gray-600 text-sm font-medium">
          {`${likes} likes`}
        </span>
      </div>

      {comments.length > 0 && (
        <div className='px-6 pb-4'>
          <h4 className='font-bold mb-2'>Comments:</h4>
          <div className='flex flex-col gap-4'>
            {comments.map((comment, index) => (
              <div key={index} className='bg-gray-100 p-4 rounded-lg'>
                <span className='font-bold text-sm text-gray-700'>@{comment.username}</span>
                <p className='text-gray-800 text-sm mt-1 whitespace-pre-line'>{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isCommenting && (
        <form action="" className='px-6 pb-8 flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <textarea {...register("comment")} id="comment" onChange={(e) => setContent(e.target.value)} className="border border-gray-400 rounded-lg w-full px-3 py-2 text-sm resize-none" />
          <div className='float-right gap-3 sm:gap-4 flex w-full sm:w-auto'>
            <button className="h-8 border border-gray-400 text-black font-bold text-center px-8 rounded-lg cursor-pointer" onClick={() => setIsCommenting(false)}>Cancel</button>
            <button disabled={!content.trim()} className="h-8 sm:h-8 bg-green-600 text-white px-8 font-bold rounded-lg cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex-1 sm:flex-none">Sent</button>
          </div>
        </form>
      )}
    </article>
  )
}