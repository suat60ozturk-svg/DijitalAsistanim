import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

export function WhatsAppSupport() {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const phoneNumber = '905551234567';
    const message = encodeURIComponent(
      'Merhaba! SiparişAsistanım hakkında bilgi almak istiyorum.'
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 z-50 animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <MessageCircle size={28} />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl p-6 w-80 z-50 border-2 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 p-2 rounded-full">
              <MessageCircle className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">WhatsApp Destek</h3>
              <p className="text-sm text-gray-600">Online - Hemen yanıt veriyoruz</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Herhangi bir sorunuz mu var? WhatsApp üzerinden bize ulaşın!
          </p>
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
          >
            WhatsApp ile Konuş
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-2 text-gray-600 hover:text-gray-900 text-sm"
          >
            Kapat
          </button>
        </div>
      )}
    </>
  );
}
