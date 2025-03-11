document.addEventListener('DOMContentLoaded', ()=>{
    let sentence = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque ipsum modi, autem ducimus, non dignissimos pariatur, quo illum esse totam adipisci et itaque aperiam recusandae aliquid omnis quaerat reiciendis nulla?';

    let convertTextToHtml = (e) => {
        const textContainer = document.querySelector('#text-content');
        const afterSplit = sentence.split(' ');
    
        textContainer.innerHTML = ''; 
    
        afterSplit.forEach((char, wordIndex) => {
            const content = createDomContent(char, wordIndex === 0, wordIndex);
            textContainer.appendChild(content);
        });
    };
    
    let createDomContent = (char, isFirstWord, wordIndex) => {
        const afterSplit = char.split('');
        
        let words = document.createElement('div');
        if (isFirstWord && wordIndex === 0) {
            words.classList.add('words', 'currentWords'); 
        } else {
            words.classList.add('words');
        }
        
        afterSplit.forEach((char, charIndex) => {
            let span = document.createElement('span');
            if (isFirstWord && charIndex === 0) {
                span.classList.add('word', 'currentWord'); 
            } else {
                span.classList.add('word');
            }
            span.innerText = char;
            words.appendChild(span);
        });
    
        return words;
    };
    
    convertTextToHtml();

    document.addEventListener('keypress', (e)=>{
        const currentWords = document.querySelector('.currentWords');
        const nextWordsSibling = currentWords?.nextElementSibling

        const currentWord = document.querySelector('.currentWord');
        const currentText = currentWord?.innerText;
        const nextWordSibling = currentWord?.nextElementSibling

        if(e.code === 'Space'){
            currentWord?.classList.remove('currentWord');

            currentWords.classList.add('completed');
            currentWords.classList.remove('currentWords');
            nextWordsSibling.classList.add('currentWords');
            
            nextWordsSibling.firstElementChild.classList.add('currentWord');

            return true;
        }

        if(currentText == e.key){
            //initiateTimer();
            currentWord.classList.remove('currentWord');
            currentWord.classList.add('correct');

            nextWordSibling?.classList.add('currentWord');
        }
        else{

            if(currentWord == null){
                let span = document.createElement('span');
                span.classList.add('word', 'extra')
                span.innerText = e.key;
                currentWords.appendChild(span);
                return true;
            }

            currentWord.classList.remove('currentWord');
            currentWord.classList.add('wrong');

            nextWordSibling?.classList.add('currentWord');
        }
    });

    document.addEventListener('keyup', (e)=>{
        if(e.code === 'Backspace'){

            console.log(e)
        }

    });

    let initiateTimer = ()=>{
        let timeContent = document.querySelector('.time-content');
        let seconds = parseInt(timeContent.innerText);
        const timer = setInterval(() => {
            timeContent.innerText = seconds;
            seconds--;
          
            if (seconds < 0) {
              clearInterval(timer); 
              console.log("Time's up!");
            }
          }, 1000);
    }

});