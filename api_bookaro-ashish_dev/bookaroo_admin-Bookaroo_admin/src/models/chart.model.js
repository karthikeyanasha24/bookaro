import * as Chart from '../assets/chart'

const setChart = (option = { id: '', type: 'bar', data: [], label: '# of Votes' }) => {
    const ctx = document.getElementById(option.id);
    if (ctx) {
        ctx
        new Chart(ctx, {
            type: option.type,
            data: {
                labels: [...option.data.map(itm => String(itm.x))],
                datasets: [{
                    label: option.label,
                    data: [...option.data.map(itm => itm.y)],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            color: 'rgb(255, 99, 132)'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

const chartModel = { setChart }

export default chartModel