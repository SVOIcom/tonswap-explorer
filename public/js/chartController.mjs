class ChartController {

    constructor() {

        this.colors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(231,233,237)'
        }

        this.color = Chart.helpers.color;

        this.config = {}

    }


    initConfig(type,label, ox, oy){
        self = this;

        ox = ox || [self.randomScaling(), self.randomScaling(), self.randomScaling(), self.randomScaling(), self.randomScaling(), self.randomScaling()];

        oy = oy || [1, 2, 3, 4, 5, 6];

        type = type || 'line';

        label = label || 'label';

        this.config = {
            type: type,
            data: {
                labels: oy,
                datasets: [{
                    label: label,
                    data: ox,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

    }

    drawChart(htmlId){
        var ctx = document.getElementById(htmlId).getContext('2d');
        new Chart(ctx, this.config);
    }

    
    randomScaling() {
        return Math.round(Math.random() * 100);
    };

}

export default ChartController;