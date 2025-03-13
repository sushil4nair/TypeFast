let sentence
let timer;
let allow = true;
let selectedTime = 15;
let scroll = 100;
let userData = [];

async function fetchJsonData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching JSON:', error);
      return null;
    }
}

async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return null;
    }
}
  


document.addEventListener('DOMContentLoaded', ()=>{

    let status = {
        missed : 0,
        correctType : 0,
        wrongType : 0,
        totalType:0,
        wpm: 0,
        typePerSec: [],
        chartData: [],
        accuracy : 0,
        seconds: selectedTime,
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

    fetchJsonData('../DataSet/UserData.json')
    .then(data => {
      if (data) {
        console.log(data);
        userData = data;
      } else {
        console.log('No data returned due to an error.');
      }
    });

    fetchJsonData('../DataSet/SentenceData.json')
    .then(data => {
      if (data) {
        const keys = Object.keys(data);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        sentence = data[randomKey];
        convertTextToHtml();
      } else {
        console.log('No data returned due to an error.');
      }
    });
    
    

    document.addEventListener('keypress', (e)=>{
        if(allow){
            const currentWords = document.querySelector('.currentWords');
            const nextWordsSibling = currentWords?.nextElementSibling
    
            const currentWord = document.querySelector('.currentWord');
            const currentText = currentWord?.innerText;
            const nextWordSibling = currentWord?.nextElementSibling;
    
            status.typePerSec.push(remainingtime + 1)
            status.totalType += 1;
    
            if(e.code === 'Space'){
                status.correctType += 1;
                currentWord?.classList.remove('currentWord');
    
                currentWords.classList.add('completed');
                currentWords.classList.remove('currentWords');
                nextWordsSibling.classList.add('currentWords');
                
                nextWordsSibling.firstElementChild.classList.add('currentWord');
    
                validateIsRemaning(currentWords);
                removeAllCursor(currentWords);
    
                moveCursor(currentWord, nextWordsSibling.firstElementChild)
                letscroll();
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
            let seconds = selectedTime;
            remainingtime = 0; 
            timer = setInterval(() => {
                remainingtime++; 
                timeContent.innerText = remainingtime;

                if (remainingtime >= seconds) {
                    allow = false;
                    clearInterval(timer); 
                    status.wpm = (status.totalType / 5) * (60 / seconds);
                    status.chartData = chartDataConvert(status.typePerSec);
                    status.accuracy = calculateAccuracy(status);

                    bindStatusOrClearModel(status);
                    bindhart(status.chartData);
                    showModel('.modelPopUpStats');

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

    let calculateAccuracy = (data)=>{
        const accuracy = (data.correctType / data.totalType) * 100;
        return `${accuracy.toFixed(2)}%`;
    }

    let showModel = (clsName)=>{
        let model = document.querySelector(clsName);
        model.classList.add('showModel');
        model.classList.remove('hideModel');
    }

    let hideModel = (clsName)=>{
        let model = document.querySelector(clsName);
        model.classList.add('hideModel');
        model.classList.remove('showModel');
    }

    document.querySelector('.close').addEventListener('click', ()=>{
        resetAll();
        hideModel('.modelPopUpStats');
    });

    document.querySelector('.reset').addEventListener('click', ()=>{
        resetAll();
    });

    document.querySelectorAll('.selectSecondBtn').forEach((button) => {
        button.addEventListener('click', (event) => {

            document.querySelector('.selectSecondBtn.selected')?.classList.remove('selected');
            event.target.classList.add('selected');
            
            selectedTime = parseInt(event.target.dataset.sec);
        });
    });

    

    let bindStatusOrClearModel = (data) => {
        if (!data) return; 
        const setText = (elementId, text) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerText = text;
            }
        };

        setText('totWordsSecId', `${data.totalType} / ${data.seconds}`);
        setText('correctCountId', data.correctType);
        setText('errorCountId', data.wrongType);
        setText('wpmId', data.wpm);
        setText('accuracyId', data.accuracy);
    };

    let bindhart = (data) => {
        const labels = data.map(item => item.sec);
        const counts = data.map(item => item.count);
    
        const ctx = document.getElementById('myChart').getContext('2d');
        
        if (window.myChart instanceof Chart) {
            window.myChart.destroy();
        }

        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Chart',
                    data: labels.map((sec, index) => ({
                        y: counts[index],
                        x: sec
                    })),
                    backgroundColor: 'rgb(118, 171, 174)',
                    borderColor: 'rgb(118, 171, 174)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Seconds',
                            color: 'white'
                        },
                        ticks: {
                            color: 'white'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Letter per seconds',
                            color: 'white'
                        },
                        ticks: {
                            color: 'white'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                }
            }
        });
    };
    

    let letscroll = ()=>{        
        const cursor = document.querySelector('.cursor').getBoundingClientRect();
        const rect = document.getElementById("scrollFromhere").getBoundingClientRect();

        if (cursor.bottom >= rect.top) {
                
                
            document.querySelector('.text-content').scroll({
                top: scroll,
                behavior: "smooth",
                });

                scroll += 100;
        }else{
        }
          
    }

    let validateIsRemaning = (currentWords)=>{
        for (let child of currentWords.children) {
            if (!child.classList.contains('correct') || child.classList.contains('wrong')) {
                child.classList.add('wrong');
                status.missed += 1
            }
        }
    }

    let resetAll = ()=>{
        clearInterval(timer); 

        fetchJsonData('../DataSet/SentenceData.json')
            .then(data => {
            if (data) {
                const keys = Object.keys(data);
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                sentence = data[randomKey];
                convertTextToHtml();
            } else {
                console.log('No data returned due to an error.');
            }
        });

        allow = true;
        timer = null;
        scroll = 100; 
        document.querySelector('.time-content').innerHTML = 0;
        status = {
            missed : 0,
            correctType : 0,
            wrongType : 0,
            totalType:0,
            wpm: 0,
            typePerSec: [],
            chartData: [],
            accuracy : 0,
            seconds: selectedTime,
        }
    }

    let validateUserExist = async () => {
        try {
            let currentIp = await getIPAddress();
            console.log(currentIp);
            
            if (currentIp) {
                let filteredData = userData.filter(x => x.userIp === `${currentIp}`);
                
                if(filteredData.length){
                    console.log('User Exist');
                }else{
                    console.log('User Not Exist');
                }
            }
        } catch (error) {
            console.error("Error getting IP address:", error);
        }
    }
    
    let UpdateJsonFile = ()=>{
        const fs = require('fs');
        fs.readFile('../DataSet/UserData.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const jsonData = JSON.parse(data);
        const newUser = {
            name: 'John Doe',
            age: 30,
        };

        jsonData.users.push(newUser);

        fs.writeFile('../DataSet/UserData.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                } else {
                console.log('Data successfully pushed to the JSON file');
                }
            });
        });

    }

    validateUserExist();
    //UpdateJsonFile()

    

});


// [
//     {
//         "userIp" : "106.201.228.171",
//         "userName" : "Person1",
//         "score" : 25.1
//     },
//     {
//         "userIp" : "192.168.19.2",
//         "userName" : "Person2",
//         "score" : 25.2
//     },
//     {
//         "userIp" : "192.168.19.3",
//         "userName" : "Person3",
//         "score" : 25.3
//     },
//     {
//         "userIp" : "192.168.19.4",
//         "userName" : "Person4",
//         "score" : 25.4
//     },
//     {
//         "userIp" : "192.168.19.5",
//         "userName" : "Person5",
//         "score" : 25.5
//     }
// ]