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
                  t={t}
                />

                <ShoppingCartSection
                  items={items}
                  itemCount={itemCount}
                  totalPrice={totalPrice}
                  onDeleteItem={handleDeleteItem}
                  onClearCart={handleClearCart}
                  t={t}
                />
              </div>
            </div>
          </div>
        </div>

        <InstructionsFooter isVisible={isVisible} t={t} />
      </div>
    </section>
  );
};

// Rest of the component implementations remain the same, just update text content with translations
// All subcomponents should receive t prop and use translations accordingly

export default Demo;