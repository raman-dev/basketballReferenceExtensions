export default defineContentScript({
  matches: ['https://www.basketball-reference.com/players/*/*/gamelog/*/*'],
  main() {
    console.log("BRHExt",'Basketball Reference Content Script Loaded.');

    const trs = Array.from(document.querySelectorAll(".stats_table tbody tr")).filter((element,idx,array) => {
        return element.hasAttribute('id');
    });
    console.log("BRHExt",trs);
    browser.runtime.onMessage.addListener((message) => {
      const body = document.querySelector("body");
      if (message.command === "changeBackgroundColor") {
        if (body != null){
          body.style.backgroundColor =
            '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
      }
      else if (message.command === "highlightPointsOver"){
        //condition 
        //column header
        console.log("BRHExt","Highlighting stat: ",message);
        trs.forEach((tr) => {
            const statCell = tr.querySelector(`td[data-stat='${message.stat}']`);
            if (statCell !== null){
                const statValue = parseInt(statCell.innerText);
                if (statValue >= message.points){
                    statCell.style.backgroundColor = 'green';
                }else{
                    statCell.style.backgroundColor = 'orangered';
                }
            }
        });
      }
      else if (message.command === "clear"){
        //remove background color styling
        console.log("BRHExt","clearing styles");
        trs.forEach((tr) => {
          tr.querySelectorAll("td").forEach((td) =>{
            td.removeAttribute("style");
          });
        });
      }else if (message.command === "highlightCellsOnConditions"){
        console.log("BRHExt","highlightCellsOnConditions",message);
        const conditions = message.conditions;
        trs.forEach((tr) => {
            conditions.forEach((condition: Object) => {
                const statCell = tr.querySelector(`td[data-stat='${condition.stat}']`);
                if (statCell !== null){
                    const statValue = parseFloat(statCell.innerText);
                    let highlight = false;
                    if (condition.type === 'over' && statValue >= condition.value){
                        highlight = true;
                    }else if (condition.type === 'under' && statValue <= condition.value){
                        highlight = true;
                    }
                    if (highlight){
                        statCell.style.backgroundColor = 'green';
                    }else{
                        statCell.style.backgroundColor = 'orangered';
                    }
                }
            });
        });
      }
    });
  },
});