const fetch = require('node-fetch');

const workshopApi = 'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/';

const bodyBuilder = (idArray) => {
  const { length } = idArray;
  const tmp = { itemcount: length };
  idArray.forEach((id, index) => {
    tmp[`publishedfileids[${index}]`] = id;
  });
  return tmp;
};

async function workshopFetcher(idArray) {
  const response = await fetch(workshopApi, {
    method: 'POST',
    body: new URLSearchParams(bodyBuilder(idArray)),
  });
  const result = await response.json();
  return result.response.publishedfiledetails.map(
    ({ publishedfileid, title }) => ({ publishedfileid, title }),
  );
}

module.exports = workshopFetcher;
