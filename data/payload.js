const presetSetionData = [
  {
    arrCode: 'CAN',
    sendCode: 'SHA',
    departureDate: ['2021-01-12'],
    flightCode: ['HO1077', 'HO1037'],
    comments: '上海-广州 去程',
  },
];

const payloads = presetSetionData
  .map((section) => section.departureDate.map((date) => ({
    arrCode: section.arrCode,
    sendCode: section.sendCode,
    departureDate: date,
    flightCode: section.flightCode,
    comments: section.comments,
  })))
  .flat();

module.exports = payloads;
