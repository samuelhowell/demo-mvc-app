let used = 0;
let available = 0;
fetch('/loans/widget', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        },
    })
.then(response => response.json())
.then(data => {
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';
    const ctx = document.querySelector('#myPieChart');
    const myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Denied", "Approved"],
            datasets: [{
                data: [Number(data.denied), Number(data.approved)],
                backgroundColor: ['#e74a3b', '#1cc88a'],
                hoverBackgroundColor: ['#e74a3b', '#17a673'],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            legend: {
                display: false
            },
            cutoutPercentage: 80,
        },
    });
})
.catch((error) => {
    console.error('Error:', error);
});
