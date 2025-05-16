const progress = document.querySelector(".progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNum = 0;
let percent = 0;
let leaderboardInterval = null;

function updateProgressbar() {
    progressSteps.forEach((progressStep, index) => {
        if ( index < formStepsNum + 1 ) {
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
    let step = 0;

    const stepInterval = setInterval(() => {
        formStepsNum = step;
        updateProgressbar();

        step++;

        // Once we reach 4 steps, stop and restart after 3 minutes
        if (step > 3) {
            clearInterval(stepInterval);
        }
    }, 60000);
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
            counterElement.innerHTML = endValue + ` New Hair`; // Final value
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
        const response = await fetch('https://grivy.app/api/games/engagements/sessions/statistic/1f03174b-52b5-6a50-d7b4-4660bc88ad05', {
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

function switchToPage2() {
    document.getElementById("page-1").classList.add("d-none");
    document.getElementById("page-1").classList.remove("d-flex");

    document.getElementById("page-2").classList.remove("d-none");
    document.getElementById("page-2").classList.add("d-flex");

    const page1 = document.getElementById("page-1");
    const page2 = document.getElementById("page-2");

    QRCode.toDataURL('https://dovekuatdariakar.com/c/dove-hair-tonic-game-810?game_session_id=1f03174b-52b5-6a50-d7b4-4660bc88ad05', function (err, url) {
        if (err) throw err;
        document.getElementById('qr-code').src = url;
    });

    fadeOut(page1);
    fadeIn(page2);
    // Start counting on page load
    formStepsNum = 0;
    percent = 0;
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

    leaderboardInterval = setInterval(fetchLeaderboard, 5000);

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

    // After 1 minute, go back to page-2 again
    setTimeout(() => {
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
});