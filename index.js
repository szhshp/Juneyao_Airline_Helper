/* eslint-disable no-console */
const axios = require('axios');
const alert = require('alert');
const { SMTPClient } = require('emailjs');
const config = require('./data/config');
const FLIGHT_STATUS = require('./constants');
const payloads = require('./data/payload');

const client = new SMTPClient(config.emailConfig);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const DEBUG = config.debug;
const DURATION = config.duration;
const REQUEST_COUNT = config.times;

const f = async ({ departureDate, arrCode, sendCode }) => {
  const res = {
    msg: '',
    departureDate,
    arrCode,
    sendCode,
    flightStatus: [
      // {
      //   status: "",
      //   carrierNoName: "",
      //   depCityName: "",
      //   depAirportName: "",
      //   arrCityName: "",
      //   arrAirportName: "",
      //   depDateTime: "",
      //   arrDateTime: "",
      // },
    ],
  };

  try {
    const data = await axios({
      method: 'post',
      url: 'https://m.juneyaoair.com/server/v2/flight/AvFare',
      data: {
        arrAirportCode: null,
        ...config.payloadConfig,
        arrCode,
        sendCode,
        departureDate,
        returnDate: null,
        sendAirportCode: null,
      },
      headers: {
        clientVersion: '1.7.0',
        versionCode: '17000',
        channelCode: 'MWEB',
        platforminfo: 'MWEB',
      },
    });

    if (DEBUG) console.log(data);

    const flightInfoDetail = data.data.flightInfoList;

    const juneyaoFlights = flightInfoDetail.filter(
      (flight) => flight.saleInfo === null,
    );

    juneyaoFlights.forEach((flight) => {
      const happyFlight = flight.cabinFareList.filter(
        (cabin) => cabin.cabinLabel === '折扣经济舱'
          && cabin.cabinCode === 'X'
          && cabin.refundedRules.length === 0,
      );

      const flightStatus = {
        msg: [
          `日期: ${departureDate}`,
          // `检测到 ${flightInfoDetail.length} 次航班`,
          // `其中 ${juneyaoFlights.length} 次航班是吉祥承办`,
          `航班: ${flight.carrierNoName}`,
          `${flight.depCityName} ${flight.depAirportName} - ${flight.arrCityName} ${flight.arrAirportName}`,
          `时间: ${flight.depDateTime} - ${flight.arrDateTime}`,
        ].join('\n'),
      };

      if (happyFlight.length === 0) {
        flightStatus.status = FLIGHT_STATUS.FLIGHT_SOLDOUT; // `机票卖完啦`;
      } else if (happyFlight[0].cabinNumber === 'A') {
        flightStatus.status = FLIGHT_STATUS.FLIGHT_AVAILABLE; // 有票
      } else {
        flightStatus.status = FLIGHT_STATUS.FLIGHT_UNAVAILABLE; // `机票有售, 随心飞卖完了`;
      }
      res.msg = '请求成功';
      res.flightStatus.push(flightStatus);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error: ', error);
    res.msg = '网络请求失败';
  }

  const availableFlights = res.flightStatus.filter(
    (singleFlightStatus) => singleFlightStatus.status === FLIGHT_STATUS.FLIGHT_AVAILABLE,
  );

  if (availableFlights.length > 0) {
    const availableFlightMessage = availableFlights
      .map((flight) => flight.msg)
      .join('\n\n');

    if (config.mode === 'alert') {
      alert(availableFlightMessage);
    } else {
      client.send(
        {
          text: availableFlightMessage,
          from: config.emailConfig.user,
          to: config.emailConfig.user,
          subject: 'Flight Available !!! ',
        },
        (err, message) => {
          console.log(err || message);
        },
      );
    }
  }

  console.log('res: ', res);
};

let index = 0;

const requestSinglePayload = () => {
  f(payloads[index]);
  index += 1;
  if (index === payloads.length) index = 0;
};

const requestMultiPayload = () => {
  Array(REQUEST_COUNT)
    .fill('szhshp is cool')
    .forEach(() => {
      requestSinglePayload();
    });
};

requestMultiPayload();
setInterval(requestMultiPayload, DURATION * 1000);
