'use client';
import React from 'react';

type RestoreSessionDialogProps = {
  isOpen: boolean;
  onRestore: () => void;
  onDiscard: () => void;
};

export const RestoreSessionDialog: React.FC<RestoreSessionDialogProps> = ({
  isOpen,
  onRestore,
  onDiscard
}) => {
  if (!isOpen) return null;

 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Restore Unsaved Work?</h2>
        <p>You have an unsaved session. Would you like to restore it?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onDiscard}
            className="px-3 py-1 text-zinc-600 hover:underline"
          >
            Discard
          </button>
          <button
            onClick={onRestore}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Restore
          </button>
        </div>
      </div>
    </div>
  );
};
