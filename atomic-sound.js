// ============================================
// OXYX MARKET - ATOMIC SOUND AUTO PLAY
// LANGSUNG BUNYI TANPA DIPENCET!
// ============================================

(function() {
    // Buat audio element
    const atomicSound = new Audio();
    
    // SUMBER SUARA ATOMIC (pake link langsung)
    atomicSound.src = 'https://www.myinstants.com/media/sounds/i-am-atomic.mp3';
    atomicSound.volume = 0.6;
    atomicSound.loop = false;
    atomicSound.preload = 'auto';
    
    // FUNGSI MAIN SOUND
    function playAtomic() {
        atomicSound.play()
            .then(() => {
                console.log('⚛️ OXYX ATOMIC! Bunyi otomatis');
                showAtomicToast();
            })
            .catch(error => {
                console.log('Autoplay dicegah browser, tapi kita paksa!');
                // Browser biasanya blokir autoplay, tapi kita kasih cara kedua
                forcePlayOnInteraction();
            });
    }
    
    // TAMPILIN TOAST ATOMIC
    function showAtomicToast() {
        const toast = document.createElement('div');
        toast.innerHTML = '⚡ OXYX ATOMIC ⚡';
        toast.style.cssText = `
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #ff00ff, #00ffff);
            color: black;
            padding: 15px 40px;
            border-radius: 50px;
            font-size: 24px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 0 50px #ff00ff;
            border: 2px solid white;
            animation: oxyxPop 0.5s, oxyxFade 0.5s 2.5s forwards;
            text-shadow: 0 0 10px white;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }
    
    // CARA KEDUA: play saat user interaksi pertama
    function forcePlayOnInteraction() {
        // Buat element audio cadangan
        const backupSound = new Audio('https://www.myinstants.com/media/sounds/i-am-atomic.mp3');
        backupSound.volume = 0.6;
        
        // Fungsi untuk play saat interaksi
        function playOnFirstTouch() {
            backupSound.play()
                .then(() => {
                    showAtomicToast();
                    // Hapus semua listener setelah berhasil
                    document.removeEventListener('click', playOnFirstTouch);
                    document.removeEventListener('touchstart', playOnFirstTouch);
                    document.removeEventListener('keydown', playOnFirstTouch);
                })
                .catch(e => console.log('Masih gagal, coba lain kali'));
        }
        
        // Pasang listener ke berbagai event interaksi user
        document.addEventListener('click', playOnFirstTouch, { once: true });
        document.addEventListener('touchstart', playOnFirstTouch, { once: true });
        document.addEventListener('keydown', playOnFirstTouch, { once: true });
        
        // Tampilin notif kecil
        const hint = document.createElement('div');
        hint.innerHTML = '⚡ Klik di mana aja buat suara OXYX ATOMIC ⚡';
        hint.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
            color: #00ffff;
            font-size: 14px;
            padding: 10px;
            background: rgba(0,0,0,0.7);
            z-index: 9999;
            animation: fadePulse 2s infinite;
        `;
        document.body.appendChild(hint);
        
        setTimeout(() => hint.remove(), 5000);
    }
    
    // CARA PALING KERAS: pake Web Audio API
    function superForcePlay() {
        // Buat audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        const audioCtx = new AudioContext();
        
        // Resume audio context (bisa bypass autoplay policy di beberapa browser)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => {
                // Coba play lagi
                const audio = new Audio('https://www.myinstants.com/media/sounds/i-am-atomic.mp3');
                audio.volume = 0.6;
                audio.play()
                    .then(() => {
                        showAtomicToast();
                        console.log('⚛️ Berhasil pake Web Audio API');
                    })
                    .catch(e => console.log('Tetep gagal'));
            });
        }
    }
    
    // TAMBAH CSS ANIMASI
    const style = document.createElement('style');
    style.textContent = `
        @keyframes oxyxPop {
            0% { transform: translateX(-50%) scale(0); opacity: 0; }
            70% { transform: translateX(-50%) scale(1.1); }
            100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
        @keyframes oxyxFade {
            to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
        @keyframes fadePulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // EKSEKUSI: Coba play langsung
    setTimeout(() => {
        playAtomic();
        // Backup pake super force
        setTimeout(superForcePlay, 1000);
    }, 800);
})();
