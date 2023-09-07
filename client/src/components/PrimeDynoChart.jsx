import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";


export default function PrimeDynoChart({ torque, horsepower, rpm }) {

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const data = {
            labels: rpm,
            datasets: [
                {
                    label: 'Torque',
                    data: torque,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                    yAxisID: 'y1'
                },
                {
                    label: 'Horsepower',
                    data: horsepower,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    tension: 0.4,
                    yAxisID: 'y'
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            animation: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    },
                    display: true,
                    position: 'bottom',
                }
            },
            scales: {
                x: {
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    },
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Horsepower (HP)'
                    }
                },
                y1: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Torque (ft lbs)'
                    }
                }
            },
        };

        setChartData(data);
        setChartOptions(options);
    }, [torque, horsepower]);

    return (
        <div className="card">
            <Chart type="line" data={chartData} options={chartOptions} />
        </div>
    )
}