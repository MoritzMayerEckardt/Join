async function initSummary() {
    await includeHTML();
    addBackgroundColor(0);
    greetBasedOnTime();
}


function greetBasedOnTime() {
    const now = new Date();
    const hour = now.getHours();
    let greeting = "";

    if (hour >= 3 && hour < 12) {
        greeting = "Good morning,";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon,";
    } else {
        greeting = "Good evening,";
    }
    document.getElementById('greet').innerHTML = greeting;
}

