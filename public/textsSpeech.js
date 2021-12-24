// export default function textsSpeech() {
    const texts = document.querySelector('.voice__container--texts');

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    const recognition = new window.SpeechRecognition();
    recognition.interimResults = true;
    // recognition.lang = 'en-US';
    const text = document.querySelector('.text');
    let p = document.createElement('p');
    
    recognition.addEventListener('result', (e) => {
        
        const htmlText = Array.from(e.results)
                            .map(result => result[0].transcript)
                            .join('');
        p.innerText = htmlText;
        texts.appendChild(p);
    
        // console.log(htmlText);
        // if(e.results[0].isFinal){
        //     p = document.createElement('p');
        // }
    
        // if(htmlText.includes('Wiadomości')){
            
        // }
        });
    
    recognition.addEventListener('end', e => {
        recognition.start();
    })
    
    recognition.start();
// }




