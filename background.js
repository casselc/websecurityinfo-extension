async function securityInfoListener(details) {
  let { results, errors } = await browser.storage.local.get({ results: [], errors: [] });
  try {
    const securityInfo = await browser.webRequest.getSecurityInfo(details.requestId, { certificateChain: true });
    results.push({ ...details, ...securityInfo });
    await browser.storage.local.set({ results });
  } catch (error) {
    console.log(error);
    errors.push(error);
    await browser.storage.local.set({ errors });
  }
}




// function initDB() {
//   const db = idb.openDB('privacyInfo', 2, {
//     upgrade(db) {
//       const store = db.createObjectStore('data', { keyPath: 'requestId' });
//     }
//   });

//   return {
//     get: key => db.then(db => db.get('data', key)),
//     set: value => db.then(db => db.put('data', value)),
//     keys: () => db.then(db => db.getAllKeys('data')), 
//     items: () => db.then(db => db.getAll('data')),
//     db
//   }
// }

if (!browser.webRequest.onHeadersReceived.hasListener(securityInfoListener)) {
  browser.webRequest.onHeadersReceived.addListener(
    securityInfoListener,
    { urls: ["<all_urls>"], types: ["main_frame", "sub_frame", "xmlhttprequest"] },
    ["blocking"]
  );
}