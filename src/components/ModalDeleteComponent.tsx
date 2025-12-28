type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export function ModalDeleteComponent({isOpen, onClose, onDelete}: ModalProps) {
  if (!isOpen) return null;

  return (
    <main className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      <div className='bg-white rounded-2xl flex flex-col p-6 gap-4 relative z-10 min-w-165'>
        <h2 className="font-bold text-xl">Are you sure you want to delete this item?</h2>
        <div className="flex gap-4 justify-end w-full">
          <button className="h-8 border border-gray-400 text-black font-bold text-center px-8 rounded-lg cursor-pointer" onClick={onClose}>Cancel</button>
          <button className="h-8 border bg-red-600 text-white font-bold text-center px-8 rounded-lg cursor-pointer" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </main>
  );
}