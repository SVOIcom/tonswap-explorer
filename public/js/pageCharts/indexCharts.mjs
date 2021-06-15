import ChartController from "/js/chartController.mjs";

let chartController = new ChartController();
chartController.initConfig("line");
chartController.drawChart("chartLine");

chartController.initConfig("bar");
chartController.drawChart("chartBar");