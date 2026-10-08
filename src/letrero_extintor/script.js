
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioContext;
}

// sonido que simula fuego
function playFireSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    

    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(3, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
}


function playSirenSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    
  
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(850, now + 0.3);
    osc.frequency.linearRampToValueAtTime(400, now + 0.6);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
}

// 3. SONIDO DE ALARMA 
function playAlarmSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); 

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
}


document.addEventListener('DOMContentLoaded', () => {
    
    // A. Clic en la A verde -> Sonido de Sirena
    const greenA = document.getElementById('green-a');
    greenA.addEventListener('click', () => {
        playSirenSound();
        triggerVisualEffect(greenA);
    });

    // B. Clic en el basurero -> Sonido de Fuego
    const fireTrash = document.getElementById('fire-trash');
    fireTrash.addEventListener('click', () => {
        playFireSound();
        triggerVisualEffect(fireTrash);
    });

    // C. Clic en EXTINTOR (letras de arriba) -> Sonido de Alarma
    const extintorHeader = document.getElementById('extintor-header');
    extintorHeader.addEventListener('click', () => {
        playAlarmSound();
        triggerVisualEffect(extintorHeader);
    });

    // D. Clic en las líneas diagonales de abajo -> Sonido de Alarma
    const diagonalStripes = document.getElementById('diagonal-stripes');
    diagonalStripes.addEventListener('click', () => {
        playAlarmSound();
        triggerVisualEffect(diagonalStripes);
    });

});

//  hacer un pequeño destello  al presionar cada elemento
function triggerVisualEffect(element) {
    element.style.transform = 'scale(0.92)';
    setTimeout(() => {
        element.style.transform = '';
    }, 150);
}