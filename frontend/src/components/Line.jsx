import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import api from "../api";

import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

const useChartData = () => {
  const [curData, setCurData] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [averageSum, setAverageSum] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reverseValues, setReverseValues] = useState([])
  const [reverseDates, setReverseDates] = useState([])
  const getChartData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("http://localhost:8000/api/chart-data");
      setCurData(response.data);
      console.log(response.data)
      console.log(curData)
      setIsLoading(false);
    } catch (error) {
      console.error("Could not fetch chart data:", error);
      setError("Failed to fetch Chart Data");
      setIsLoading(false);
    }
  };

  const calculateAverageSum = () => {
    if (!Array.isArray(curData) || curData.length === 0) return;

    const dateSum = {};
    const dateCount = {};
    const dataAverage = [];

    curData.forEach((item) => {
      if (!dateSum[item.date]) {
        dateSum[item.date] = item.value;
        dateCount[item.date] = 1;
      } else {
        dateSum[item.date] += item.value;
        dateCount[item.date] += 1;
      }
    });

    for (const date in dateSum) {
      dataAverage.push(dateSum[date] / dateCount[date]);
    }

    setAverageSum(dataAverage);
    setReverseValues(averageSum.reverse())
  };

  useEffect(() => {
    getChartData();
  }, []);

  useEffect(() => {
    if (Array.isArray(curData) && curData.length > 0) {
      const unique = [...new Set(curData.map((data) => data.date))];
      setUniqueDates(unique);
      setReverseDates(uniqueDates.reverse())
      calculateAverageSum();
    }
  }, [curData]);

  return { reverseDates, reverseValues, isLoading, error };
};

const LineGraph = () => {
  const { reverseDates, reverseValues, isLoading, error } = useChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Study Percentage Chart',
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Percentage'
        },
        min: 0,
        max: 100
      }
    }
  };

  const data = {
    labels: reverseDates,
    datasets: [
      {
        label: "Study Percentage",
        data: reverseValues,
        fill: false,
        backgroundColor: "rgba(246, 0, 49, 0.87)",
        borderColor: "rgba(70, 57, 255, 0.51)",
      },
    ],
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <Line options={options} data={data} />;
};

export default LineGraph;