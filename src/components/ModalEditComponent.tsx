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
    <main className="fixed inset-0 flex items-center justify-center z-50" key={`${isOpen}-${initialTitle}-${initialContent}`}>
      <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleCancel}></div>
      <div className='bg-white rounded-2xl flex flex-col p-6 gap-4 relative z-10 min-w-165 max-w-md w-full mx-4'>
        <h2 className="font-bold text-xl">Edit Item</h2>
        
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="edit-title" className="block text-base mb-2">
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
            <label htmlFor="edit-content" className="block text-base mb-2">
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

        <div className="flex gap-4 justify-end w-full">
          <button 
            className="h-8 border border-black text-black font-bold text-center px-8 rounded-lg cursor-pointer" 
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            className="h-8 bg-green-600 text-white font-bold text-center px-8 rounded-lg cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed" 
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
