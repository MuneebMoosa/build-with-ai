import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface CropSelectorProps {
  crops: string[];
  activeCrop: string;
  onSelectCrop: (crop: string) => void;
  onAddCrop: (crop: string) => void;
  onRemoveCrop: (crop: string) => void;
}

export const CropSelector: React.FC<CropSelectorProps> = ({ crops, activeCrop, onSelectCrop, onAddCrop, onRemoveCrop }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCropName, setNewCropName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCropName.trim() && !crops.includes(newCropName.trim())) {
      onAddCrop(newCropName.trim());
      setNewCropName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="mb-6 bg-white p-5 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
        നിങ്ങളുടെ കൃഷികൾ <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Your Crops</span>
      </h2>
      <div className="flex flex-wrap gap-3">
        {crops.map((crop) => (
          <div
            key={crop}
            className={`flex items-center rounded-2xl transition-all duration-300 transform active:scale-95 border-2 ${
              activeCrop === crop
                ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/30'
                : 'bg-white border-green-100 text-gray-700 hover:bg-green-50 hover:border-green-300 shadow-sm'
            }`}
          >
            <button
              onClick={() => onSelectCrop(activeCrop === crop ? '' : crop)}
              className="px-5 py-3 text-base font-semibold focus:outline-none min-h-[44px]"
            >
              {crop}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveCrop(crop);
              }}
              className={`pr-4 pl-1 py-3 text-base focus:outline-none transition-colors min-h-[44px] flex items-center justify-center ${
                activeCrop === crop ? 'text-green-200 hover:text-white' : 'text-gray-400 hover:text-red-500'
              }`}
              title="Remove crop"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
        {isAdding ? (
          <form onSubmit={handleAdd} className="flex items-center gap-2">
            <div className="flex bg-white border-2 border-green-400 rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-green-500/20 transition-all shadow-md">
              <input
                type="text"
                autoFocus
                value={newCropName}
                onChange={(e) => setNewCropName(e.target.value)}
                placeholder="കൃഷിയുടെ പേരും Emoji..."
                className="px-4 py-3 focus:outline-none text-base w-40 bg-transparent text-gray-800 font-medium min-h-[44px]"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-green-500 text-white hover:bg-green-600 transition-colors text-base font-bold min-h-[44px]"
              >
                ചേർക്കുക
              </button>
            </div>
            <button
               type="button"
               onClick={() => {
                 setIsAdding(false);
                 setNewCropName('');
               }}
               className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center border border-transparent min-h-[44px] min-w-[44px]"
               title="റദ്ദാക്കുക"
            >
              <X className="w-6 h-6" />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-5 py-3 rounded-2xl text-base font-semibold bg-gray-50 border-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 transform active:scale-95 shadow-sm min-h-[44px]"
          >
            <Plus className="w-5 h-5 mr-2" />
            കൃഷി ചേർക്കുക
          </button>
        )}
      </div>
    </div>
  );
};
