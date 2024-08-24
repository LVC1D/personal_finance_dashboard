import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

export default function InvestmentChart({
    data,
    height = 450,
    width = 450,
    outerRadius = height / 2 - 10,
    innerRadius = outerRadius * 0.75
}) {
    const chartRef = useRef();

    useEffect(() => {
        // Clear any existing SVG within the container to prevent multiple charts
        d3.select(chartRef.current).select("svg").remove();

        // Set up the SVG element
        const svg = d3.select(chartRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie()
            .value(d => d.amount)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const arcs = svg.selectAll(".arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.asset_name));

    }, [data, height, width, innerRadius, outerRadius]);

    return (
        <div ref={chartRef} id="balanceViz"></div>
    );
}

InvestmentChart.propTypes = {
    data: PropTypes.array.isRequired
}
