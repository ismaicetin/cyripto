import React, { useEffect } from "react";
import Highcharts from "highcharts";

const Bar = ({ chartData, sliceCount = 30, name, subtitle, backgroundColor }) => {
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

	useEffect(() => {
		Highcharts.chart(`container${name}`, {
			chart: {
				type: "line",
			},
			title: {
				text: name,
			},
			subtitle: {
				text: subtitle,
			},
			xAxis: {
				categories: chartData.category.slice(chartData.category.length - sliceCount, chartData.category.length),
				labels: {
					formatter: function () {
						return getdate(this.value);
					},
				},
			},
			yAxis: {
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
			],
		});
	}, [name]);

	return <div id={`container${name}`}></div>;
};

export default Bar;
