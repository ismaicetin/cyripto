import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import { Button } from "react-bootstrap";

const getdate = (value) => {
	let date = new Date(value);
	var dateStr =
		("00" + (date.getMonth() + 1)).slice(-2) +
		"/" +
		("00" + date.getDate()).slice(-2) +
		"/" +
		date.getFullYear() +
		" " +
		("00" + date.getHours()).slice(-2) +
		":" +
		("00" + date.getMinutes()).slice(-2) +
		":" +
		("00" + date.getSeconds()).slice(-2);
	return dateStr;
};

const useOptions = (chartData, sliceCount, name, subtitle, backgroundColor) => {
	return {
		chart: {
			type: "line",
			zoomType: "xy",
			panning: true,
		},
		title: {
			text: name,
		},
		subtitle: {
			text: subtitle,
		},
		xAxis: [
			{
				categories: chartData.category.slice(chartData.category.length - sliceCount, chartData.category.length),
				labels: {
					formatter: function () {
						return getdate(this.value);
					},
				},
			},
		],
		yAxis: [
			{
				title: {
					text: "Number of Employees",
				},
				max: 100,
				min: 0,
				plotLines: [
					{
						color: "black",
						dashStyle: "dot",
						width: 3,
						value: 70,
						label: {
							align: "right",
							style: {
								fontStyle: "italic",
							},
							text: "Satım Yap",
							x: -10,
						},
						zIndex: 3,
					},
					{
						color: "red",
						dashStyle: "dot",
						width: 3,
						value: 30,
						label: {
							align: "right",
							style: {
								fontStyle: "italic",
							},
							text: "Alım Yap",
							x: -10,
						},
						zIndex: 3,
					},
				],
			},
			{
				scrollbar: {
					enabled: true,
				},
				// Secondary yAxis
				title: {
					text: "Tahmin",
					style: {
						color: Highcharts.getOptions().colors[0],
					},
				},
				labels: {
					format: "{value}",
					style: {
						color: Highcharts.getOptions().colors[0],
					},
				},
				// max: chartData.curretCoinPrice * 1.1,
				// min: chartData.curretCoinPrice - chartData.curretCoinPrice * 0.1,
				opposite: true,
			},
		],
		plotOptions: {
			spline: {
				marker: {
					enable: false,
				},
			},
		},
		tooltip: {
			formatter: function () {
				return `${getdate(this.x)} : <strong style=" color: red; ">${this.y}</strong>`;
			},
		},

		series: [
			{
				name: "Installation",
				data: chartData.data.slice(chartData.category.length - sliceCount, chartData.category.length),
			},
			{
				name: "tahminiFiyatArray",
				yAxis: 1,
				data: chartData.tahminiFiyatArray.slice(chartData.tahminiFiyatArray.length - sliceCount),
			},
		],
	};
};

const HighchartsComponent = ({ options, debug, ...props }) => {
	const containerRef = useRef(null);
	const chartRef = useRef(null);

	useEffect(() => {
		chartRef.current = Highcharts.chart(containerRef.current, options);
	}, []);

	useEffect(() => {
		if (debug) console.log("update options");
		chartRef.current.update(options, true, true);
	}, [chartRef, options]);

	return <div ref={containerRef} {...props} />;
};

export default function Chart({ chartData, sliceCount = 30, name, subtitle, backgroundColor, debug }) {
	const options = useOptions(chartData, sliceCount, name, subtitle, backgroundColor);
	return <HighchartsComponent options={options} debug={debug} />;
}
