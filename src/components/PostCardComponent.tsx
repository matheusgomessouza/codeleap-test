import { useMemo, useState } from 'react';
import { getTimeAgo } from '../utils/time';
import { MdDeleteForever } from "react-icons/md";
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

export function PostCardComponent({post, currentTime, setIsDeleteModalOpen, setIsEditModalOpen, setPostToDelete, setPostToEdit}: PostCardProps) {
  const currentUsername = useMemo(() => localStorage.getItem('username'), [])
  const [likes, setLikes] = useState<number>(0);

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
    </article>
  )
}