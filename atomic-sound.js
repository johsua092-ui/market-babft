// ============================================
// ATOMIC SOUND - "I AM ATOMIC"
// File terpisah, gak perlu otak-atik file lain
// ============================================

(function() {
    // Buat audio element
    const atomicSound = new Audio();
    
    // Coba beberapa sumber suara (biar aman)
    const soundSources = [
        'https://www.myinstants.com/media/sounds/i-am-atomic.mp3',
        'https://www.myinstants.com/media/sounds/atomic-i-am.mp3',
        'https://www.myinstants.com/media/sounds/atomic-sound.mp3'
    ];
    
    let currentSource = 0;
    
    function tryNextSource() {
        if (currentSource < soundSources.length) {
            atomicSound.src = soundSources[currentSource];
            currentSource++;
            atomicSound.load();
            atomicSound.play().catch(tryNextSource);
        } else {
            // Kalau semua gagal, tampil tombol manual
            showAtomicButton();
        }
    }
    
    // Setting sound
    atomicSound.volume = 0.6;
    atomicSound.loop = false;
    
    // Fungsi main sound
    function playAtomicSound() {
        // Reset ke sumber pertama
        currentSource = 0;
        atomicSound.src = soundSources[0];
        atomicSound.load();
        
        atomicSound.play()
            .then(() => {
                console.log('⚛️ ATOMIC! Sound playing');
                showAtomicToast();
            })
            .catch(() => {
                console.log('Gagal play, coba sumber lain...');
                tryNextSource();
            });
    }
    
    // Toast notifikasi
    function showAtomicToast() {
        const toast = document.createElement('div');
        toast.innerHTML = '⚛️ I AM ATOMIC! ⚛️';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #00ffff, #ff00ff);
            color: black;
            padding: 15px 40px;
            border-radius: 50px;
            font-size: 24px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 0 50px #00ffff;
            border: 2px solid white;
            animation: atomicPop 0.5s, atomicFade 0.5s 2.5s forwards;
            text-shadow: 0 0 10px white;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }
    
    // Tombol backup kalau autoplay diblokir
    function showAtomicButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '⚛️ I AM ATOMIC ⚛️';
        btn.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #00ffff, #ff00ff);
            color: black;
            border: 3px solid white;
            border-radius: 60px;
            padding: 18px 40px;
            font-size: 22px;
            font-weight: bold;
            z-index: 9999;
            cursor: pointer;
            box-shadow: 0 0 50px #00ffff;
            animation: atomicPulse 1.5s infinite;
            letter-spacing: 3px;
        `;
        
        btn.onclick = function() {
            currentSource = 0;
            atomicSound.src = soundSources[0];
            atomicSound.play()
                .then(() => {
                    showAtomicToast();
                    this.remove();
                })
                .catch(() => {
                    alert('⚛️ Klik izinkan dulu buat suara!');
                });
        };
        
        document.body.appendChild(btn);
    }
    
    // Tambah CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes atomicPop {
            0% { transform: translateX(-50%) scale(0); opacity: 0; }
            70% { transform: translateX(-50%) scale(1.1); }
            100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
        @keyframes atomicFade {
            to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
        @keyframes atomicPulse {
            0%, 100% { transform: translateX(-50%) scale(1); box-shadow: 0 0 50px #00ffff; }
            50% { transform: translateX(-50%) scale(1.05); box-shadow: 0 0 80px #ff00ff; }
        }
    `;
    document.head.appendChild(style);
    
    // Jalankan pas website selesai loading
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(playAtomicSound, 800); // Delay 0.8 detik
        });
    } else {
        setTimeout(playAtomicSound, 800);
    }
})();
