// ============================================
// ATOMIC SOUND - AUTO PLAY TANPA DIPENCET
// LANGSUNG BUNYI PAS WEB KE BUKA
// ============================================

(function() {
    // Buat audio element
    const atomicSound = new Audio();
    
    // Gunakan sumber suara yang paling stabil
    atomicSound.src = 'https://www.myinstants.com/media/sounds/i-am-atomic.mp3';
    atomicSound.volume = 0.5; // Volume 50%
    atomicSound.loop = false;
    atomicSound.preload = 'auto';
    
    // Fungsi untuk play sound
    function playAtomic() {
        atomicSound.play()
            .then(() => {
                console.log('⚛️ ATOMIC! Bunyi otomatis');
                showAtomicToast();
            })
            .catch(error => {
                console.log('Autoplay dicegah browser, coba cara lain...');
                // Coba play dengan cara berbeda
                tryPlayAlternative();
            });
    }
    
    // Cara alternatif 1: pake AudioContext
    function tryPlayAlternative() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();
            
            if (audioCtx.state === 'suspended') {
                audioCtx.resume().then(() => {
                    const audio = new Audio('https://www.myinstants.com/media/sounds/i-am-atomic.mp3');
                    audio.volume = 0.5;
                    audio.play()
                        .then(() => {
                            showAtomicToast();
                            console.log('⚛️ Berhasil pake AudioContext');
                        })
                        .catch(() => {
                            // Kalau masih gagal, kasih tombol kecil
                            showAtomicButton();
                        });
                });
            }
        } catch (e) {
            showAtomicButton();
        }
    }
    
    // Cara alternatif 2: pake iframe (ekstrim)
    function tryIframeMethod() {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'https://www.myinstans.com/sound.html';
        document.body.appendChild(iframe);
        
        setTimeout(() => {
            const audio = new Audio('https://www.myinstants.com/media/sounds/i-am-atomic.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => showAtomicButton());
        }, 1000);
    }
    
    // Tampilkan toast notifikasi atomic
    function showAtomicToast() {
        const toast = document.createElement('div');
        toast.innerHTML = '⚛️ OXYX ATOMIC ⚛️';
        toast.style.cssText = `
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #b300ff, #6a0dad);
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            font-size: 24px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 0 50px #b300ff;
            border: 2px solid white;
            animation: popIn 0.5s, fadeOut 0.5s 2.5s forwards;
            letter-spacing: 2px;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }
    
    // Tombol cadangan (tapi kecil dan gak ganggu)
    function showAtomicButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '⚛️';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #b300ff;
            color: white;
            border: 2px solid white;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 0 30px #b300ff;
            z-index: 9999;
            opacity: 0.7;
            transition: 0.3s;
        `;
        btn.onclick = function() {
            const audio = new Audio('https://www.myinstants.com/media/sounds/i-am-atomic.mp3');
            audio.volume = 0.5;
            audio.play();
            showAtomicToast();
            this.remove();
        };
        document.body.appendChild(btn);
        
        // Hilangin tombol setelah 30 detik
        setTimeout(() => {
            if (btn.parentNode) btn.remove();
        }, 30000);
    }
    
    // Tambah CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popIn {
            0% { transform: translateX(-50%) scale(0); opacity: 0; }
            70% { transform: translateX(-50%) scale(1.1); }
            100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
        @keyframes fadeOut {
            to { opacity: 0; transform: translateX(-50%) translateY(-30px); }
        }
    `;
    document.head.appendChild(style);
    
    // COBA PLAY SAAT HALAMAN SIAP
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Delay 1 detik biar gak kaget
            setTimeout(playAtomic, 1000);
        });
    } else {
        setTimeout(playAtomic, 1000);
    }
    
    // Backup: coba lagi setelah 3 detik kalau gagal
    setTimeout(tryPlayAlternative, 3000);
})();
