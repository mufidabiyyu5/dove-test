const progress = document.querySelector(".progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNum = 0;
let percent = 0;
let leaderboardInterval = null;
let urlGreevy = 'https://grivy.app/api/games/engagements/';
let urlDove = 'https://dovekuatdariakar.com/c/dove-hair-tonic-game-810?game_session_id=';
let sessionId = '';
let deviceId = 'display-001';
let campaignPublicCode = 'dove-hair-tonic-game-810';
let urlSessionID = 'https://flashscore.prisma-ads.com/vending-machine-client/api/';

const audio = new Audio('./assets/Music_BG.mp3');
const audioCountdown = new Audio('./assets/10_Sec_CD.mp3');
const audioCring = new Audio('./assets/Cring_01.mp3');
audio.loop = true;
audio.volume = 1.0;
audio.play();

function updateProgressbar() {
    progressSteps.forEach((progressStep, index) => {
        if (index < formStepsNum + 1) {
            progressStep.classList.add('progress-step-active')


        } else {
            progressStep.classList.remove('progress-step-active')
        }
    })
    // progress.style.width = ((formStepsNum) / (progressSteps.length - 1)) * 100 + "%";
}

function timer(id) {
    let timeLeft = 60;
    const timerElement = document.getElementById(id);

    const countDown = setInterval(() => {
        timeLeft--;
        if (timeLeft < 10) {
            timerElement.textContent = '00 : 0' + timeLeft;
        } else {
            timerElement.textContent = '00 : ' + timeLeft;
        }

        if (timeLeft <= 0) {
            clearInterval(countDown);
        }
    }, 1000);
}

function startLoopingProgressbar() {
    audio.volume = 1.0;
    if (formStepsNum > 3) {
        return;
    }

    if (formStepsNum == 0) {
        formStepsNum++;
        startLoopingProgressbar();
    } else if(formStepsNum == 3) {
        setTimeout(() => {
            updateProgressbar();
            audioCring.play();
        }, 55000)
    } else {
        setTimeout(() => {
            updateProgressbar();
            formStepsNum++;
            audio.volume = 0.2;
            audioCring.play();

            startLoopingProgressbar();
        }, 60000) 
    }
}

function countTo2700(duration = 179000) {
    const counterElement = document.getElementById('counter');
    const start = performance.now();
    const endValue = 2700;

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const currentCount = Math.floor(progress * endValue);

        counterElement.innerHTML = '+' + currentCount + ` New Hair`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            counterElement.innerHTML = '+' + endValue + ` New Hair`; // Final value
            console.log('Finished counting to 2700');
        }
    }

    requestAnimationFrame(update);
}

function fadeOut(element) {
    element.classList.remove("show");
    setTimeout(() => {
        element.style.display = "none";
    }, 1000); // matches CSS transition
}

function fadeIn(element) {
    element.style.display = "block";
    setTimeout(() => {
        element.classList.add("show");
    }, 10); // slight delay to trigger transition
}

async function fetchLeaderboard() {
    try {
        const response = await fetch(`${urlGreevy}sessions/statistic/${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'peSJx0bA17u0m9TwSRCQrLGer52ZpceUlR6pKlzqAd9XVt30M0U36U1cAUbPQo2X'
            }
        });

        const result = await response.json();
        console.log('data leaderboard: ', result.top_users);

        const list = document.getElementById('list-leaderboard');
        list.innerHTML = ''; // Clear previous list

        result.top_users.slice(0, 5).forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name;

            const span = document.createElement('span');
            span.textContent = ` ${item.total_interactions} Pumps`;

            li.appendChild(span);
            list.appendChild(li);
        });

    } catch (error) {

    }
}

function switchToPage3() {
    document.getElementById("page-2").classList.add("d-none");
    document.getElementById("page-2").classList.remove("d-flex");

    document.getElementById("page-3").classList.remove("d-none");
    document.getElementById("page-3").classList.add("d-flex");

    const page1 = document.getElementById("page-2");
    const page2 = document.getElementById("page-3");
    const video = document.getElementById('video-3');

    fadeOut(page1);
    fadeIn(page2);
    video.play();
    timer('timer-3');

    setTimeout(() => {
        video.pause();
        video.currentTime = 0;
        switchToPage1();
    }, 60000);
}

async function switchToPage2() {
    const sessionId = await createSession();

    const list = document.getElementById('list-leaderboard');
    list.innerHTML = '';

    document.getElementById("page-1").classList.add("d-none");
    document.getElementById("page-1").classList.remove("d-flex");

    document.getElementById("page-2").classList.remove("d-none");
    document.getElementById("page-2").classList.add("d-flex");

    const page1 = document.getElementById("page-1");
    const page2 = document.getElementById("page-2");

    QRCode.toDataURL(`${urlDove}${sessionId}`, function (err, url) {
        if (err) throw err;
        document.getElementById('qr-code').src = url;
        document.getElementById('qr-code-kiri').src = url;
        // document.getElementById('qr-code-frame-3').src = url;
    });

    fadeOut(page1);
    fadeIn(page2);
    // Start counting on page load
    formStepsNum = 0;
    percent = 0
    updateProgressbar();
    const progressBarInterval = setInterval(() => {
        progress.style.width = percent + '%';
        percent++;

        if (percent > 100) {
            clearInterval(progressBarInterval);
        }
    }, 180000 / 100);

    countTo2700();
    startLoopingProgressbar();

    leaderboardInterval = setInterval(fetchLeaderboard, 1000);

    // After 3 minutes, go back to page-1
    setTimeout(() => {
        clearInterval(leaderboardInterval);
        switchToPage3();
    }, 180000); // 3 minutes = 180000ms
}

function switchToPage1() {
    document.getElementById("page-3").classList.add("d-none");
    document.getElementById("page-3").classList.remove("d-flex");

    document.getElementById("page-1").classList.remove("d-none");
    document.getElementById("page-1").classList.add("d-flex");

    const page1 = document.getElementById("page-1");
    const page2 = document.getElementById("page-2");
    const video = document.getElementById('video-1');

    fadeOut(page2);
    fadeIn(page1);
    video.play();
    timer('timer-1');

    setTimeout(() => {
        audio.volume = 0.2;
        audioCountdown.play();
    }, 50000);

    // After 1 minute, go back to page-2 again
    setTimeout(() => {
        audio.volume = 1.0;
        video.pause();
        video.currentTime = 0;
        switchToPage2();
    }, 60000); // 1 minute = 60000ms
}

// Start the loop: after 1 minute from load, go to page-2
setTimeout(() => {
    switchToPage2();
}, 60000); // Start page-2 after 1 minute

window.addEventListener('DOMContentLoaded', () => {
    timer('timer-1');

    setTimeout(() => {
        audio.volume = 0.2;
        audioCountdown.play();
    }, 50000);
});

async function createSession() {
    const response = await fetch(`${urlGreevy}sessions/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'peSJx0bA17u0m9TwSRCQrLGer52ZpceUlR6pKlzqAd9XVt30M0U36U1cAUbPQo2X'
        },
        body: JSON.stringify({
            "device_id": deviceId,
            "campaign_public_code": campaignPublicCode
        })
    });

    const result = await response.json();
    sessionId = result.session_id;

    // store the sessin id to database
    await fetch(`${urlSessionID}project-led/save_qr_code_dove`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId })
    });
    console.log('result create session: ', result);
    return result.session_id;
}


