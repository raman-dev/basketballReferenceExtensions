export default defineContentScript({
  matches: ['https://www.basketball-reference.com/players/*/*/gamelog/*/*'],
  main() {
    console.log('Basketball Reference Content Script Loaded.');

    const trs = Array.from(document.querySelectorAll(".stats_table tbody tr")).filter((element,idx,array) => {
        return element.hasAttribute('id');
    });
    console.log(trs);
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
        console.log("Highlighting stat: ",message);
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
    });
  },
});