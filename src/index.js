import * as d3 from 'd3';
import bugChart from './bug-chart';

const dataPath = './data/bugs.csv';
const data = d3.csv(dataPath, items => {
	bugChart('[chart-id=bugs-timeline]', items);
});

