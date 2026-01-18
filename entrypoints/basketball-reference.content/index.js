const logTag = "BRHExt";
function clearStyleAttributes(trs) {
  trs.forEach((tr) => {
    tr.querySelectorAll("td").forEach((td) => {
      td.removeAttribute("style");
    });
    tr.removeAttribute("style");
  });
}

function processMessage(body, message, trs) {
  const key = location.origin + location.pathname;
  if (message.command === "clear") {
    //remove background color styling
    console.log(logTag, "clearing styles");
    clearStyleAttributes(trs);
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
    console.log(logTag,"storage-key => ",key);
    // const sessionMessage = await browser.storage.session.get(`session:${key}`);
    console.log(logTag,'Context check:', {
      world: typeof ctx !== 'undefined' ? ctx.world : 'unknown',
      browser: typeof browser,
      chromeRuntime: chrome?.runtime?.id,
    });

    // console.log(logTag,sessionMessage);
    browser.runtime.onMessage.addListener((message) => {
      const body = document.querySelector("body");
      if (body !== null && trs !== null) {
        processMessage(body, message, trs);
      }
    });
  },
});
