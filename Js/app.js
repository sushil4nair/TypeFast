document.addEventListener('DOMContentLoaded', ()=>{
    let sentence = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque ipsum modi, autem ducimus, non dignissimos pariatur, quo illum esse totam adipisci et itaque aperiam recusandae aliquid omnis quaerat reiciendis nulla?';
    let timer;

    let status = {
        correctType : 0,
        wrongType : 0,
        totalType:0,
        wpm: 0,
        chartData: []
    }

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
                span.classList.add('word', 'currentWord', 'cursor'); 
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
        const nextWordSibling = currentWord?.nextElementSibling;

        status.chartData.push(remainingtime)
        status.totalType += 1;

        if(e.code === 'Space'){
            status.correctType += 1;
            currentWord?.classList.remove('currentWord');

            currentWords.classList.add('completed');
            currentWords.classList.remove('currentWords');
            nextWordsSibling.classList.add('currentWords');
            
            nextWordsSibling.firstElementChild.classList.add('currentWord');

            removeAllCursor(currentWords);

            moveCursor(currentWord, nextWordsSibling.firstElementChild)

            return true;
        }
        
        if(currentText == e.key){
            initiateTimer();
            status.correctType += 1;

            currentWord.classList.remove('currentWord');
            currentWord.classList.add('correct');

            nextWordSibling?.classList.add('currentWord');

            moveCursor(currentWord, nextWordSibling);

        }
        else{
            status.wrongType += 1;

            if(currentWord == null){

                removeAllCursor(currentWords);

                let span = document.createElement('span');
                span.classList.add('word', 'extra', 'cursorExtraWord')
                span.innerText = e.key;
                currentWords.appendChild(span);
                return true;
            }

            currentWord.classList.remove('currentWord');
            currentWord.classList.add('wrong');

            nextWordSibling?.classList.add('currentWord');

            moveCursor(currentWord, nextWordSibling);
        }
    });

    document.addEventListener('keyup', (e)=>{
        if(e.code === 'Backspace'){

            console.log(e)
        }

    });

    let remainingtime = 0;

    let initiateTimer = () => {
        if (!timer) {
            let timeContent = document.querySelector('.time-content');
            let seconds = 15;
            remainingtime = 0; 
            timer = setInterval(() => {
                remainingtime++; 
                timeContent.innerText = remainingtime;

                if (remainingtime >= seconds) {
                    clearInterval(timer); 

                    status.wpm = (status.totalType / 5) * (60 / seconds);
                    //status.chartData = chartDataConvert(status.chartData);

                    console.log(status)
                }
            }, 1000);
        }
    }


    let moveCursor = (currentWord, nextWordSibling) =>{
        currentWord?.classList.remove('cursor');
        if(!nextWordSibling){
            currentWord?.classList.add('cursorExtraWord');
        }else{
            nextWordSibling?.classList.add('cursor');
        }
    }

    let removeAllCursor = (currentWords)=>{
        for (let child of currentWords.children) {
            if (child.classList.contains('cursorExtraWord')) {
                child.classList.remove('cursorExtraWord');
            }
        }
    }

    let chartDataConvert = (arr) => {
        return arr.reduce((acc, curr) => {
            const lastEntry = acc[acc.length - 1];

            if (lastEntry && lastEntry.sec === curr) {
                lastEntry.count++;
            } else {
                acc.push({ sec: curr, count: 1 });
            }
    
            return acc;
        }, []);
    }

});