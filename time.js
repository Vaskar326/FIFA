document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".container");
    if (!container) return;

    const tzWrapper = document.createElement("div");
    tzWrapper.className = "timezone-container";
    
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn-tz";
    toggleBtn.textContent = "Switch to BDT (Bangladesh Time)";
    tzWrapper.appendChild(toggleBtn);
    
    container.parentNode.insertBefore(tzWrapper, container);

    const timeElements = document.querySelectorAll(".time-highlight");
    const originalTimes = [];

    timeElements.forEach((el, index) => {
        const row = el.closest("tr");
        let origDateStr = "";
        if (row) {
            const dateCell = row.querySelector("td:first-child");
            if (dateCell) origDateStr = dateCell.textContent.trim();
        }

        originalTimes.push({
            element : el,
            row : row,
            origTimeStr : el.textContent.trim(),
            origDateStr : origDateStr
        });
    });

    let currentTZ = "IST"; 

    toggleBtn.addEventListener("click", function () {
        if (currentTZ === "IST") {
            originalTimes.forEach(item => {
                const converted = convertISTtoBDT(item.origTimeStr, item.origDateStr);
                item.element.textContent = converted.time;
                
                if (item.row && converted.dateChanged) {
                    const dateCell = item.row.querySelector("td:first-child");
                    if (dateCell) dateCell.textContent = converted.newDate;
                }
            });

            toggleBtn.textContent = "Switch to IST (India Time)";
            toggleBtn.classList.add("active");
            currentTZ = "BDT";
        } else {
            originalTimes.forEach(item => {
                item.element.textContent = item.origTimeStr;
                if (item.row) {
                    const dateCell = item.row.querySelector("td:first-child");
                    if (dateCell) dateCell.textContent = item.origDateStr;
                }
            });

            toggleBtn.textContent = "Switch to BDT (Bangladesh Time)";
            toggleBtn.classList.remove("active");
            currentTZ = "IST";
        }
    });

    function convertISTtoBDT(timeStr, dateStr) {
        const matches = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
        if (!matches) return { time : timeStr, dateChanged : false };

        let hours = parseInt(matches[1], 10);
        let minutes = parseInt(matches[2], 10);
        const ampm = matches[3].toUpperCase();

        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;

        minutes += 30;
        if (minutes >= 60) {
            minutes -= 60;
            hours += 1;
        }

        let dateChanged = false;
        let newDate = dateStr;

        if (hours >= 24) {
            hours -= 24;
            dateChanged = true;

            if (dateStr && dateStr.includes("/")) {
                let parts = dateStr.split("/");
                let day = parseInt(parts[0], 10);
                let month = parseInt(parts[1], 10);
                let year = parts[2];

                day += 1; 
                
                let dayStr = day < 10 ? "0" + day : day;
                let monthStr = month < 10 ? "0" + month : month;
                newDate = `${dayStr}/${monthStr}/${year}`;
            }
        }

        let outputAMPM = "AM";
        if (hours >= 12) {
            outputAMPM = "PM";
            if (hours > 12) hours -= 12;
        }
        if (hours === 0) hours = 12;

        let outputHours = hours < 10 ? "0" + hours : hours;
        let outputMinutes = minutes < 10 ? "0" + minutes : minutes;

        return {
            time : `${outputHours}:${outputMinutes} ${outputAMPM}`,
            dateChanged : dateChanged,
            newDate : newDate
        };
    }
});