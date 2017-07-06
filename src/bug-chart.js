import * as d3 from 'd3';
import styles from './bug-chart.css';
export default (chartSelector, data, chartOptions = {
	width: 500,
	height: 500,
	margin: [20, 20, 20, 20]
}) => {
	const {width, margin} = chartOptions;
	const bugs = _formatData(data);
	const height = bugs.length * 12;
	const xScale = _createXScale(bugs, width);
	const yScale = _createYScale(bugs, height);
	const chartSvg = _createChartSvg({chartSelector, height, width, margin, styles, scalingMethod: _responsivefy});
    _addDropShadowFilter(chartSvg);
	const svg = chartSvg.append('g')
        .attr('transform', `translate(${margin[3]}, ${margin[0]})`);
	svg
		.append('g')
			.attr('transform', `translate(0, ${height})`)
			.call(d3.axisBottom(xScale));

	_addBugElementsToChart({svg, yScale, xScale, bugs, styles})

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
		.call(scalingMethod);

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

const _addBugElementsToChart = (options) => {
	const {svg, yScale, xScale, bugs, styles} = options;
	const items = svg.selectAll('.bug')
		.data(bugs)
		.enter()
		.append('g')
		.attr('class', styles.bug)
		.attr('transform', (d, i) => {
			return `translate(${xScale(d.created)}, ${yScale(i)})`;
		})
        .on('mouseover', function() {
            d3.select(this)
				.selectAll(function() { return this.childNodes; })
				.style('filter', 'url(#drop-shadow)');
        })
        .on('mouseout', function() {
            d3.select(this)
                .selectAll(function() { return this.childNodes; })
				.style('filter', 'none');
        });

	const width = d =>{
		const resolved = d.resolved || xScale.domain()[1];
		return Math.max(xScale(resolved) - xScale(d.created), 10);
	};
	const circleRadius = 4;

	items.append('rect')
		.attr('width', width)
		.attr('height', 2)
		.attr('class', styles.bugLine);

	items.append('circle')
		.attr('class', `${styles.bugEndPoint} ${styles.open}`)
		.attr('cx', 0)
		.attr('cy', circleRadius/2)
		.attr('r', circleRadius);

	items.append('circle')
		.attr('class', d => `${styles[d.resolution.toLowerCase().replace(/[\s']/g, '')]} ${d.resolution.toLowerCase().replace(/[\s']/g, '-')} ${styles.bugEndPoint}`)
		.attr('cx', width)
		.attr('cy', circleRadius/2)
		.attr('r', circleRadius);

	items.append('div')
		.attr('class', styles.tooltip)
		.html('test');
};

const _showToolTip = () => {

};

const _hideToolTip = () => {

};

const _populateToolTip = () => {

};

const _addDropShadowFilter = (svg) => {
    const defs = svg.append('defs');
    const filter = defs.append('filter')
        .attr('id', 'drop-shadow')
        .attr('height', '200%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('x', '-50%');

    filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', 1.5)
        .attr('result', 'blur');

    filter.append('feOffset')
        .attr('in', 'blur')
        .attr('dx', 1)
        .attr('dy', 1)
        .attr('result', 'offsetBlur');

    const feMerge = filter.append('feMerge');

    feMerge.append('feMergeNode')
        .attr('in', 'offsetBlur');
    feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');
};

const _responsivefy = (svg) => {
	const resize = () => {
		let targetWidth = parseInt(container.style('width'));
		svg.attr('width', targetWidth);
		svg.attr('height', Math.round(targetWidth / aspect));
	};

	const container = d3.select(svg.node().parentNode),
		width = parseInt(svg.style('width')),
		height = parseInt(svg.style('height')),
		aspect = width / height;

	svg.attr('viewBox', '0 0 ' + width + ' ' + height)
		.attr('preserveAspectRatio', 'xMinYMid')
		.call(resize);

	d3.select(window).on('resize.' + container.attr('id'), resize);
};
