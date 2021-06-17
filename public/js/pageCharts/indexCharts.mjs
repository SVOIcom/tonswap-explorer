import ChartController from "/app/modules/tonswap/chartController.mjs";

let chartController = new ChartController();
chartController.initConfig("line");
chartController.drawChart("chartLine");

chartController.initConfig("bar");
chartController.drawChart("chartBar");