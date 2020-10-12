const presetSetionData = [
  {
    arrCode: 'SHA',
    sendCode: 'SYX',
    departureDate: ['2020-12-27'],
  },
];

const payloads = presetSetionData
  .map((section) => section.departureDate.map((date) => ({
    arrCode: section.arrCode,
    sendCode: section.sendCode,
    departureDate: date,
  })))
  .flat();

module.exports = payloads;
