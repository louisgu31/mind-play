
import React, { useState, useEffect } from 'react';
import { MERCHANT_DIALOGUES } from '../../constants/shopData';

interface MerchantAvatarProps {
  dialogueType?: 'welcome' | 'success' | 'failure';
}

export const MerchantAvatar: React.FC<MerchantAvatarProps> = ({ dialogueType = 'welcome' }) => {
  const [dialogue, setDialogue] = useState<string>('');

  useEffect(() => {
    const dialogues = MERCHANT_DIALOGUES[dialogueType];
    setDialogue(dialogues[Math.floor(Math.random() * dialogues.length)]);
  }, [dialogueType]);

  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg border-4 border-yellow-300">
        🧙‍♂️
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-md relative max-w-xs">
        <div className="absolute -left-3 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
        <p className="text-gray-700 font-medium">{dialogue}</p>
      </div>
    </div>
  );
};
