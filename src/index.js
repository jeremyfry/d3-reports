import * as d3 from 'd3';
import moment from 'moment';

const dataPath = './data/bugs.csv';
const data = d3.csv(dataPath, items => {
	const bugs = items.map(item=>({
		created: moment(item.Created).toDate(),
		resolved: moment(item.Resolved).toDate(),
		key: item.Key
	}));
	console.log(bugs);
});

