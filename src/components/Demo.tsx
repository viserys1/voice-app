import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  Plus,
  Trash2,
  AlertCircle,
  ShoppingCart,
} from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { extractItemAndPrice, formatToRupiah } from '../utils/speechProcessing';
import { useVoiceCart } from '../hooks/useVoiceCart';

interface DemoProps {
  t: any;
}

// Interface definitions
interface Item {
  id: number;
  name: string;
  price: number;
}

interface StatusMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

// Add the missing OptimizedBackgroundDecorations component
const OptimizedBackgroundDecorations: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl"></div>
    </div>
  );
};

const Demo: React.FC<DemoProps> = ({ t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: '-50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Custom hook that handles all the cart logic
  const {
    items,
    inputMode,
    manualName,
    manualPrice,
    statusMessage,
    totalPrice,
    itemCount,
    setInputMode,
    setManualName,
    setManualPrice,
    handleDeleteItem,
    handleManualAdd,
    handleClearCart,
    addItem,
    setStatusWithClear,
  } = useVoiceCart();

  // Speech recognition callbacks
  const handleSpeechResult = (transcript: string) => {
    console.log('Processing transcript:', transcript);

    setStatusWithClear(`Memproses: "${transcript}"`, 'info');

    const extractedData = extractItemAndPrice(transcript);

    if (extractedData) {
      addItem(extractedData.itemName, extractedData.price);
    } else {
      setStatusWithClear(
        `❌ Tidak dapat memahami: "${transcript}". Coba ucapkan seperti "mangga lima puluh ribu"`,
        'error',
        6000
      );
    }
  };

  const handleSpeechError = (error: string) => {
    console.error('Speech recognition error:', error);
    setStatusWithClear(error, 'error', 5000);
  };

  // Speech recognition hook
  const { isListening, startListening, stopListening, isSupported } =
    useSpeechRecognition({
      language: 'id-ID',
      onResult: handleSpeechResult,
      onError: handleSpeechError,
    });

  // Toggle voice recognition
  const toggleVoiceRecognition = () => {
    if (isListening) {
      stopListening();
      setStatusWithClear('🔇 Pengenalan suara dihentikan', 'info', 2000);
    } else {
      if (!isSupported) {
        setStatusWithClear(
          '❌ Speech recognition tidak didukung di browser ini. Gunakan Chrome atau Edge.',
          'error',
          5000
        );
        return;
      }
      startListening();
      setStatusWithClear(
        '🎤 Mendengarkan... Ucapkan nama produk dan harga (contoh: "mangga lima puluh ribu")',
        'info'
      );
    }
  };

  const handleInputModeChange = (mode: 'voice' | 'manual') => {
    if (isListening) {
      stopListening();
    }
    setInputMode(mode);
  };

  return (
    <section
      ref={sectionRef}
      id="demo"
      className={`min-h-screen py-12 bg-gradient-to-b from-gray-900 via-indigo-950 to-black relative overflow-hidden transition-all duration-1000 will-change-transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ 
        contain: 'layout style paint',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      <OptimizedBackgroundDecorations />

      <div className={`container mx-auto px-4 md:px-6 max-w-6xl relative z-10 transition-all duration-700 delay-300 will-change-transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700 delay-200 will-change-transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {t.demo.title}
          </h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
            {t.demo.subtitle}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className={`bg-gray-900/40 rounded-2xl border border-gray-700/50 overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.1)] transition-all duration-700 delay-500 will-change-transform ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ 
            backdropFilter: 'blur(12px)',
            transform: 'translateZ(0)'
          }}>
            <StatusMessageDisplay statusMessage={statusMessage} />

            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <InputSection
                  inputMode={inputMode}
                  onInputModeChange={handleInputModeChange}
                  isListening={isListening}
                  isSupported={isSupported}
                  onToggleVoice={toggleVoiceRecognition}
                  manualName={manualName}
                  manualPrice={manualPrice}
                  onManualNameChange={setManualName}
                  onManualPriceChange={setManualPrice}
                  onManualAdd={handleManualAdd}
                  t={t.demo}
                />

                <ShoppingCartSection
                  items={items}
                  itemCount={itemCount}
                  totalPrice={totalPrice}
                  onDeleteItem={handleDeleteItem}
                  onClearCart={handleClearCart}
                  t={t.demo}
                />
              </div>
            </div>
          </div>
        </div>

        <InstructionsFooter isVisible={isVisible} t={t.demo} />
      </div>
    </section>
  );
};

// Subcomponents remain the same, just ensure they use the correct properties from t prop
const StatusMessageDisplay: React.FC<{ statusMessage: StatusMessage }> = ({ statusMessage }) => {
  if (!statusMessage) return null;
  
  return (
    <div className={`p-4 border-b border-gray-700/50 flex items-center gap-2 ${
      statusMessage.type === 'error' ? 'bg-red-500/10 text-red-200' :
      statusMessage.type === 'success' ? 'bg-green-500/10 text-green-200' :
      'bg-blue-500/10 text-blue-200'
    }`}>
      <AlertCircle className="h-5 w-5" />
      <p>{statusMessage.text}</p>
    </div>
  );
};

const InputSection: React.FC<{
  inputMode: 'voice' | 'manual';
  onInputModeChange: (mode: 'voice' | 'manual') => void;
  isListening: boolean;
  isSupported: boolean;
  onToggleVoice: () => void;
  manualName: string;
  manualPrice: string;
  onManualNameChange: (value: string) => void;
  onManualPriceChange: (value: string) => void;
  onManualAdd: () => void;
  t: any;
}> = ({
  inputMode,
  onInputModeChange,
  isListening,
  isSupported,
  onToggleVoice,
  manualName,
  manualPrice,
  onManualNameChange,
  onManualPriceChange,
  onManualAdd,
  t,
}) => {
  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => onInputModeChange('voice')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            inputMode === 'voice'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {t.voiceInput}
        </button>
        <button
          onClick={() => onInputModeChange('manual')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            inputMode === 'manual'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {t.manualInput}
        </button>
      </div>

      {inputMode === 'voice' ? (
        <div className="text-center">
          <button
            onClick={onToggleVoice}
            disabled={!isSupported}
            className={`w-24 h-24 rounded-full transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-purple-500 hover:bg-purple-600'
            } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? (
              <MicOff className="h-8 w-8 mx-auto text-white" />
            ) : (
              <Mic className="h-8 w-8 mx-auto text-white" />
            )}
          </button>
          <p className="mt-4 text-gray-300">
            {isListening ? t.listening : t.tapMicrophone}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.productName}
            </label>
            <input
              type="text"
              value={manualName}
              onChange={(e) => onManualNameChange(e.target.value)}
              placeholder={t.enterProductName}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.price}
            </label>
            <input
              type="text"
              value={manualPrice}
              onChange={(e) => onManualPriceChange(e.target.value)}
              placeholder={t.enterPrice}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={onManualAdd}
            className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            {t.addToCart}
          </button>
        </div>
      )}
    </div>
  );
};

const ShoppingCartSection: React.FC<{
  items: Item[];
  itemCount: number;
  totalPrice: number;
  onDeleteItem: (id: number) => void;
  onClearCart: () => void;
  t: any;
}> = ({ items, itemCount, totalPrice, onDeleteItem, onClearCart, t }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          {t.cart}
        </h3>
        {itemCount > 0 && (
          <button
            onClick={onClearCart}
            className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            {t.deleteAll}
          </button>
        )}
      </div>

      {itemCount === 0 ? (
        <div className="text-center py-8">
          <ShoppingCart className="h-12 w-12 mx-auto text-gray-600 mb-4" />
          <h4 className="text-lg font-medium text-gray-300 mb-2">
            {t.emptyCart}
          </h4>
          <p className="text-gray-500">{t.emptyCartDesc}</p>
        </div>
      ) : (
        <div>
          <div className="space-y-2 mb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-gray-400">{formatToRupiah(item.price)}</p>
                </div>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700/50 pt-4">
            <div className="flex items-center justify-between text-lg font-semibold mb-4">
              <span className="text-gray-300">{t.total}</span>
              <span className="text-white">{formatToRupiah(totalPrice)}</span>
            </div>
            <button className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors">
              {t.readyToCheckout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InstructionsFooter: React.FC<{
  isVisible: boolean;
  t: any;
}> = ({ isVisible, t }) => {
  return (
    <div className={`mt-12 grid md:grid-cols-2 gap-8 transition-all duration-700 delay-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="bg-gray-900/40 rounded-xl border border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {t.voiceInputTips}
        </h3>
        <ul className="space-y-2 text-gray-300">
          <li>• "Mangga lima puluh ribu"</li>
          <li>• "Apel dua puluh lima ribu"</li>
          <li>• "Jeruk tiga puluh ribu"</li>
        </ul>
      </div>
      <div className="bg-gray-900/40 rounded-xl border border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {t.manualInputTips}
        </h3>
        <ul className="space-y-2 text-gray-300">
          <li>• {t.productsInCart}</li>
        </ul>
      </div>
    </div>
  );
};

export default Demo;