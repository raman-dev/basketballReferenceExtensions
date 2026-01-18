const logTag = "BRHExt";

async function getSessionData(key) {
  let data = null;
  await browser.runtime.sendMessage({
    command: "storage.get",
    key: key,
  }).then ((response) => {
    data = response;
  });
  return data;
}

async function setSessionData(key, data) {
  return await browser.runtime.sendMessage({
    command: "storage.set",
    key: key,
    data: data,
  });
}
function clearStyleAttributes(trs) {
  trs.forEach((tr) => {
    tr.querySelectorAll("td").forEach((td) => {
      td.removeAttribute("style");
    });
    tr.removeAttribute("style");
  });
}

function processMessage(body, message, trs) {
  const key = location.pathname;
  if (message.command === "clear") {
    //remove background color styling
    console.log(logTag, "clearing styles");
    clearStyleAttributes(trs);
    
    setSessionData(key, { command: "clear" });
  } else if (message.command === "highlightCellsOnConditions") {
    console.log(logTag, "highlightCellsOnConditions", message);
    clearStyleAttributes(trs);

    const conditions = message.conditions;
    const conditionFunction = message.conditionFunc;

    trs.forEach((tr) => {
      let allTrue = null;
      conditions.forEach((condition) => {
        const statCell = tr.querySelector(`td[data-stat='${condition.stat}']`);

        if (statCell !== null) {
          const statValue = parseInt(statCell.innerText);
          const conditionVal = parseInt(condition.value);
          let highlight = false;

          switch (condition.type) {
            case "over":
              highlight = statValue >= conditionVal;
              break;
            case "under":
              highlight = statValue <= conditionVal;
              break;
            case "exact":
              highlight = statValue === conditionVal;
              break;
          }
          // allTrue = allTrue && highlight;
          if (allTrue === null) {
            allTrue = highlight;
          }
          allTrue = allTrue && highlight;
          if (conditionFunction === "or") {
            // console.log(conditionFunction, highlight);
            if (highlight) {
              statCell.style.backgroundColor = "green";
            } else {
              statCell.style.backgroundColor = "orangered";
            }
          }
        }
      });

      if (allTrue !== null && allTrue === true && conditionFunction === "and") {
        tr.style.backgroundColor = "lightgreen";
      }
    });
    setSessionData(key, message);
  }
}
export default defineContentScript({
  matches: ["https://www.basketball-reference.com/players/*/*/gamelog/*/"],
  async main(ctx) {

    console.log(logTag, "Basketball Reference Content Script Loaded.");

    const trs = Array.from(
      document.querySelectorAll(".stats_table tbody tr")
    ).filter((element, idx, array) => {
      return element.hasAttribute("id");
    });

    console.log(logTag, trs);
    //get path from page
    const key = document.location.pathname;
    const storedData = await getSessionData(key);

    console.log(logTag,"storedData => ",storedData);
    if (storedData !== undefined && storedData !== null && Object.keys(storedData).length > 0) {
      let message = null;
      if ("key" in storedData){
        message = storedData.key[key];
      }
      else{
        message = storedData[key];
      }
      processMessage(document.querySelector("body"), message, trs);
    }
    browser.runtime.onMessage.addListener((message) => {
      const body = document.querySelector("body");
      if (body !== null && trs !== null) {
        processMessage(body, message, trs);
      }
    });
  },
});
