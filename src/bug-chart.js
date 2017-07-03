import * as d3 from 'd3';
import styles from './index.css';
export default (chartSelector, data, chartOptions = {
	width: 500,
	height: 500,
	margin: [20, 20, 20, 20]
}) => {
	const {width, height, margin} = chartOptions;
	const bugs = _formatData(data);
	const xScale = _createXScale(bugs, width);
	const yScale = _createYScale(bugs, height);

	const svg = _createChartSvg({chartSelector, height, width, margin, styles, scalingMethod: _responsivefy});

	svg
		.append('g')
			.attr('transform', `translate(0, ${height})`)
			.call(d3.axisBottom(xScale));

	_addElements({svg, yScale, xScale, bugs, styles})

};

const _formatData = (data) => {
	const parseTime = d3.timeParse('%m/%d/%Y %H:%M');
	return data.map(item=>({
		created: parseTime(item.Created),
		resolved: parseTime(item.Resolved),
		key: item.Key,
		resolution: item.Resolution
	}));
};

const _createChartSvg = (options) => {
	const {chartSelector, scalingMethod, height, width, margin, styles} = options;
	return d3.select(chartSelector)
		.classed(styles.chart, true)
		.append('svg')
		.attr('width', width+margin[1]+margin[3])
		.attr('height', height+margin[0]+margin[2])
		.call(scalingMethod)
		.append('g')
		.attr('transform', `translate(${margin[3]}, ${margin[0]})`);
};

const _createXScale = (data, width) => {
	return d3.scaleTime()
		.domain([
			d3.min(data, bug=>bug.created),
			d3.max(data, bug=>bug.resolved)
		])
		.range([0, width]);
};

const _createYScale = (data, height) => {
	return d3.scaleLinear()
		.domain([0, data.length])
		.range([0, height]);
};

const _addElements = (options) => {
	const {svg, yScale, xScale, bugs, styles} = options;
	const items = svg.selectAll('.bug')
		.data(bugs)
		.enter()
		.append('g')
		.attr('class', 'bug')
		.attr('transform', (d, i) => {
			return `translate(${xScale(d.created)}, ${yScale(i)})`;
		});

	const width = d =>{
		const resolved = d.resolved || xScale.domain()[1];
		return Math.max(xScale(resolved) - xScale(d.created), 10);
	};

	items.append('rect')
		.attr('width', width)
		.attr('height', 2);

	items.append('circle')
		.attr('class', `${styles.open}`)
		.attr('cx', 0)
		.attr('cy', 1)
		.attr('r', 2);

	items.append('circle')
		.attr('class', d => `${styles[d.resolution.toLowerCase().replace(/[\s']/g, '')]} ${d.resolution.toLowerCase().replace(/[\s']/g, '-')}`)
		.attr('cx', width)
		.attr('cy', 1)
		.attr('r', 2);

	items.append('div')
		.attr('class', styles.tooltip)
		.html('test');
};

const _responsivefy = (svg) => {
	const resize = () => {
		var targetWidth = parseInt(container.style("width"));
		svg.attr("width", targetWidth);
		svg.attr("height", Math.round(targetWidth / aspect));
	};

	const container = d3.select(svg.node().parentNode),
		width = parseInt(svg.style("width")),
		height = parseInt(svg.style("height")),
		aspect = width / height;

	svg.attr("viewBox", "0 0 " + width + " " + height)
		.attr("preserveAspectRatio", "xMinYMid")
		.call(resize);

	d3.select(window).on("resize." + container.attr("id"), resize);
};
