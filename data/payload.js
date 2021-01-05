const presetSetionData = [
  {
    arrCode: 'CAN',
    sendCode: 'SHA',
    departureDate: ['2021-01-13'],
    flightCode: ['HO1077', 'HO1037'],
  },
];

const payloads = presetSetionData
  .map((section) => section.departureDate.map((date) => ({
    arrCode: section.arrCode,
    sendCode: section.sendCode,
    departureDate: date,
    flightCode: section.flightCode,
  })))
  .flat();

module.exports = payloads;
