const getDateRange = (days = 0) => {
  const startDate = new Date();

  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);

  endDate.setDate(endDate.getDate() + days);

  endDate.setHours(23, 59, 59, 999);

  return {
    startDate,
    endDate,
  };
};

export { getDateRange };