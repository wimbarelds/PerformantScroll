window.addEventListener('DOMContentLoaded', () => {
    let allData = [];
    let itemDistance = 0;
    let topOffset = 0;
    let totalHeight = 0;
    let numItemsToRender = 15;
    let numItemsOffscreen = 1;
    let aboveSpacer = document.querySelector('.list-prepadding');
    let belowSpacer = document.querySelector('.list-postpadding');
    let listVM = new Vue({
        el: '#list',
        data: {
            comments: [],
            spaceAbove: 0,
            spaceBelow: 0
        },
        methods: {
            redraw: function(e) {
                let spaceAbove = this.$el.scrollTop;
                // Set space above
                let skipNum = 0;
                if(spaceAbove > (numItemsOffscreen * itemDistance)) {
                    skipNum = Math.floor((spaceAbove - (numItemsOffscreen * itemDistance)) / itemDistance);
                    this.spaceAbove = (skipNum * itemDistance) + 'px';
                }
                else {
                    this.spaceAbove = '0px';
                }

                // Set space below
                let spaceBelow = totalHeight - ((skipNum + numItemsToRender) * itemDistance) - this.$el.clientHeight;
                this.spaceBelow = spaceBelow + 'px';
                listVM.comments = allData.slice(skipNum, skipNum + numItemsToRender);
            }
        }
    });

    const init = () => {
        let _list = document.querySelector('#list');
        let listHeight = _list.clientHeight;

        let _comments = document.querySelectorAll('.__comment');
        topOffset = _comments[0].offsetTop;
        itemDistance = _comments[1].offsetTop - _comments[0].offsetTop;
        let itemHeight = _comments[0].clientHeight;
        totalHeight = (2 * topOffset) + (itemDistance * (allData.length - 1) + itemHeight);

        let itemsOnScreen = Math.ceil(listHeight / itemDistance);
        numItemsToRender = itemsOnScreen + (2 * numItemsOffscreen);

        listVM.redraw();
    };

    fetch('https://jsonplaceholder.typicode.com/comments')
        .then((response) => response.json())
        .then((jsonData) => {
            allData = jsonData;
            listVM.comments = allData.slice(0, 2);
            Vue.nextTick(init);
        });
});
