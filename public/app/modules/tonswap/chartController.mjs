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

        this.backgroundColor = 'rgb(184,121,18)',
        this.borderColor = 'rgb(235,173,68)',

        // this.color = Chart.helpers.color;

        this.config = {}

        this.chart = {}

    }


    initConfig(type,label, ox, oy){
        self = this;

        ox = ox || [1, 2, 3, 4, 5, 6];

        oy = oy || [self.randomScaling(), self.randomScaling(), self.randomScaling(), self.randomScaling(), self.randomScaling(), self.randomScaling()];

        type = type || 'line';

        label = label || 'label';

        this.config = {
            type: type,

            data: {
                labels: ox,
                datasets: [{
                    hoverBackgroundColor: "rgb(153,105,22)",
                    hoverBorderColor: "rgb(235,173,68)",
                    label: label,
                    data: oy,
                    backgroundColor: this.backgroundColor,
                    borderColor: this.borderColor,
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    
                    y: {
                        beginAtZero: true
                    }
                },

                responsive: true
            }
        };

    }

    drawChart(htmlId){
        self = this;
        var ctx = document.getElementById(htmlId).getContext('2d');
        new Chart(ctx, this.config);
    }

    destroyChart(){
        this.chart.destroy();
    }


    
    randomScaling() {
        return Math.round(Math.random() * 100);
    };

}

export default ChartController;