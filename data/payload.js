const presetSetionData = [
  {
    arrCode: 'SHA',
    sendCode: 'CKG',
    departureDate: ['2020-10-09', '2020-10-08', '2020-10-10', '2020-10-11'],
  },
  {
    arrCode: 'SHA',
    sendCode: 'CTU',
    departureDate: ['2020-10-09', '2020-10-08', '2020-10-10', '2020-10-11'],
  },
  {
    arrCode: 'SHA',
    sendCode: 'SYX',
    departureDate: ['2020-12-27'],
  },
  /* {
    arrCode: 'SHA',
    sendCode: 'MIG',
    departureDate: ['2020-10-08'],
  }, */
];

const payloads = presetSetionData
  .map((section) => section.departureDate.map((date) => ({
    arrCode: section.arrCode,
    sendCode: section.sendCode,
    departureDate: date,
  })))
  .flat();

module.exports = payloads;
