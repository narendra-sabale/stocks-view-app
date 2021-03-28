export const config = () => {
  return {
    layout: {
      backgroundColor: '#ffffff',
      textColor: 'rgba(33, 56, 77, 1)',
    },
    grid: {
      vertLines: {
        color: 'rgba(197, 203, 206, 0.7)',
      },
      horzLines: {
        color: 'rgba(197, 203, 206, 0.7)',
      },
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
    },
    priceScale: {
      scaleMargins: {
        top: 0.3,
        bottom: 0.25
      },
      borderVisible: false
    },
    timezone: "Asia/Kolkata",
  }
}