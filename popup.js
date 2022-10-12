async function clearHistory(event) {
  const clear = document.forms.clear_history.delete_what.value
  let requestElement = document.getElementById("requests");

  if (clear === "all") {
    await browser.storage.local.set({ results: [] });
    clearElements(requestElement);
    let li = document.createElement("li");
    li.textContent = "No data collected yet...";
    requestElement.appendChild(li);
  } else if (clear === "keep_n") {
    const n = parseInt(document.forms.clear_history.keep_last_n.value);
    let { results } = await browser.storage.local.get({ results: [] });
    results.sort((a, b) => a.ts < b.ts || (a.ts == b.ts && a.url <= b.url));
    results.splice(n);
    await browser.storage.local.set({ results });
    addElements(requestElement, results, responseDetails);
  } else if (clear === "keep_days") {
    const days = parseInt(document.forms.clear_history.keep_last_days.value);
    const now = new Date();
    const thresholdMillis = (24 * 60 * 60 * 1000) * days;
    let { results } = await browser.storage.local.get({ results: [] });
    results.sort((a, b) => a.ts < b.ts || (a.ts == b.ts && a.url <= b.url));
    results = results.filter(r => (now - new Date(r.ts)) < thresholdMillis);
    await browser.storage.local.set({results});
    addElements(requestElement, results, responseDetails);
  }
  event.preventDefault();
}

function clearElements(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function addElements(element, array, callback) {
  clearElements(element);

  for (let i = 0; i < array.length; i++) {

    let listItem = document.createElement("li");
    listItem.appendChild(callback(array[i]));
    element.appendChild(listItem);
  }
}

function appendDef(list, key, value) {
  let dt = document.createElement("dt");
  dt.textContent = key;
  let dd = document.createElement("dd");
  dd.textContent = value;
  list.appendChild(dt);
  list.appendChild(dd);
}

function responseDetails(response) {
  const reqTime = new Date(response.timeStamp).toLocaleString("en", { dateStyle: "short", timeStyle: "medium" });

  let detailsEl = document.createElement("details");
  let summary = detailsEl.appendChild(document.createElement("summary"));
  summary.textContent = `${reqTime} - ${response.url} (${response.state})`

  let dl = detailsEl.appendChild(document.createElement("dl"));

  appendDef(dl, "Type", response.type);
  appendDef(dl, "Method", response.method);
  appendDef(dl, "Incognito?", response.incognito);
  appendDef(dl, "From cache?", response.fromCache);
  appendDef(dl, "IP Address", response.ip);
  appendDef(dl, "TLS version", response.protocolVersion);
  appendDef(dl, "Cipher", response.cipherSuite);
  appendDef(dl, "Key Algo", response.keaGroupName);
  appendDef(dl, "Sig Scheme", response.signatureSchemeName);
  appendDef(dl, "HSTS?", response.hsts);
  appendDef(dl, "CA Transparency", response.certificateTransparencyStatus);
  appendDef(dl, "EV?", response.isExtendedValidation);
  appendDef(dl, "Domain mismatch?", response.isDomainMismatch);
  appendDef(dl, "Invalid time?", response.isNotValidAtThisTime);
  appendDef(dl, "Untrusted?", response.isUntrusted);
  if (response.urlClassification !== undefined) {
    if (response.urlClassification.firstParty.length > 0) {
      appendDef(dl, "URL Classification (1st-party)", response.urlClassification.firstParty.join());
    }

    if (response.urlClassification.thirdParty.length > 0) {
      appendDef(dl, "URL Classification (3rd-party)", response.urlClassification.thirdParty.join())

    }
  }




  return detailsEl;
}

function responseError(error) {
  let dl = document.createElement("dl");

  appendDef(dl, "Error", error);

  return dl;
}

let gettingStoredInfo = browser.storage.local.get({ results: [], errors: [] });
gettingStoredInfo.then(({ results, errors }) => {
  if (results.length === 0 && errors === 0) {
    return;
  }

  let requestElement = document.getElementById("requests");
  results.sort((a, b) => a.requestId < b.requestId);

  addElements(requestElement, results, responseDetails);

  let errorElement = document.getElementById("errors");
  addElements(errorElement, errors, responseError);

});

document.getElementById("clear_history").addEventListener("click", clearHistory, false);
