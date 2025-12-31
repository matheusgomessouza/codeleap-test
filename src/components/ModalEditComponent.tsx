import { useState } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
  initialTitle?: string;
  initialContent?: string;
};

export function ModalEditComponent({isOpen, onClose, onSave, initialTitle = '', initialContent = ''}: ModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSave(title, content);
      setTitle('');
      setContent('');
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setContent(initialContent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <main className="fixed inset-0 flex items-center justify-center z-50 p-4" key={`${isOpen}-${initialTitle}-${initialContent}`}>
      <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleCancel}></div>
      <div className='bg-white rounded-2xl flex flex-col p-4 sm:p-6 gap-3 sm:gap-4 relative z-10 w-full max-w-md'>
      <h2 className="font-bold text-lg sm:text-xl">Edit Item</h2>
      
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
        <label htmlFor="edit-title" className="block text-sm sm:text-base mb-2">
          Title
        </label>
        <input
          type="text"
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Hello world"
          className="border border-gray-400 rounded-lg w-full px-3 py-2 text-sm"
        />
        </div>

        <div>
        <label htmlFor="edit-content" className="block text-sm sm:text-base mb-2">
          Content
        </label>
        <textarea
          id="edit-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content here"
          rows={4}
          className="border border-gray-400 rounded-lg w-full px-3 py-2 text-sm resize-none"
        />
        </div>
      </div>

      <div className="flex gap-2 sm:gap-4 justify-end w-full">
        <button 
        className="h-8 sm:h-10 border border-black text-black font-bold text-sm sm:text-base text-center px-4 sm:px-8 rounded-lg cursor-pointer flex-1 sm:flex-none" 
        onClick={handleCancel}
        >
        Cancel
        </button>
        <button 
        className="h-8 sm:h-10 bg-green-600 text-white font-bold text-sm sm:text-base text-center px-4 sm:px-8 rounded-lg cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex-1 sm:flex-none" 
        onClick={handleSave}
        disabled={!title.trim() || !content.trim()}
        >
        Save
        </button>
      </div>
      </div>
    </main>
  );
}
