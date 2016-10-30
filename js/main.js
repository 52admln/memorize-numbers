/**
 *
 * 关卡1： 6
 * 关卡2： 9
 * 关卡3： 12
 * 关卡4： 15
 * 关卡5： 18
 *
 */
(function () {

    // 数组乱序
    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function () {
            for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
            return this;
        };
    }

    var game_level = 1, item_num, rank, cur_num, gaming, clicked, username;


// 开始游戏
    function startGame() {
        $(".container").removeClass("not-in-game").addClass("ready");
        renderItems();
    }
// 重新开始
    function restartGame() {
        $(".container").attr("class", "container not-in-game");
        init();
        renderItems();
    }

    function bindEvent() {
        $(".js-start").on("click", startGame);
        $(".js-restart").on("click", restartGame);

        $('.num-items').delegate('li', 'click', function (e) {
            clickNum(this);
        });

        $(".js-nextLevel").on("click", nextLevel);
        $(".js-success").on("click", function () {
            var $stopedUser = $("#successUser");
            var myValue = $stopedUser.val();
            if (myValue == "") {
                $stopedUser.attr("placeholder", "请填写内容！").focus();
            } else {
                saveScore(myValue);
            }

        });
        $(".js-faild").on("click", function () {
            var $stopedUser = $("#stopedUser");
            var myValue = $stopedUser.val();
            if (myValue == "") {
                $stopedUser.attr("placeholder", "请填写内容！").focus();
            } else {
                saveScore(myValue);
            }
        });

        $(".js-stopGame").on("click", function () {
            $('#saveName').modal({
                keyboard: false,
                backdrop: 'static'
            });
        });

        $(".js-close").on("click", reloadPage);
        $(".js-stop").on("click", reloadPage);


    }
// 刷新页面
    function reloadPage() {
        window.location.reload();
    }
// 点击数字
    function clickNum(ele) {
        var data = ele.dataset.num;
        console.log(data);
        //debugger;

        if (data == 1 && gaming == false && clicked == false) {
            $(".container").removeClass("ready").addClass("gaming");
            gaming = true;
            clicked = true;
            $(ele).addClass("show-text");
        } else if (clicked == true) {
            if (data == cur_num && gaming == true) {
                $(ele).addClass("show-text");
            } else {
                stopGame();
            }
        }
        cur_num++;
        if (data == item_num && cur_num - 1 == item_num && clicked == true) {
            //$(".container").attr("class", "container not-in-game");
            $('#nextLevel').modal({
                keyboard: false,
                backdrop: 'static'
            });
            clicked = false;
            gaming = false;
        }
        //console.log("cur:"+cur_num);


    }
// 保存成绩
    function saveScore(username) {
        $('#gameStoped').modal("hide");
        rank.push({name: username, level: game_level});
        console.log(rank);
        saveToLocalStorage(rank);
        window.location.reload();
    }
// 下一等级
    function nextLevel() {
        item_num = item_num + 3;
        cur_num = 1;
        game_level = game_level + 1;
        renderItems();
        $('#nextLevel').modal("hide");
    }

// 游戏结束
    function stopGame() {
        $('#gameStoped').modal({
            keyboard: false,
            backdrop: 'static'
        });
        $(".item").removeClass("show-text").addClass("show-text");
        init();
    }

// 保存到 LocalStorage
    function saveToLocalStorage(date) {
        var STORAGE_ID = "GAMERANK";
        //存储，IE6~7 cookie 其他浏览器HTML5本地存储
        if (window.localStorage) {
            localStorage.setItem("GAMERANK", JSON.stringify(date));
        } else {
            Cookie.write("GAMERANK", JSON.stringify(date));
        }
        renderRank();
    }
// 创建乱序数字
    function creatData(length) {
        var arr = [];
        for (var i = 1; i <= length; i++) {
            arr.push(i);
        }
        return arr.shuffle();
    }
// 渲染数据
    function renderItems() {
        var numArr = creatData(item_num);
        var renderHtml = "";
        for (var i = 0; i < numArr.length; i++) {
            var index = Math.floor(Math.random() * (item_num + 1));
            renderHtml += '<li class="item" data-num="' + numArr[i] + '">'
                + numArr[i]
                + '</li>';
        }
        $(".num-items").html(renderHtml);
        $(".container").attr("class", "container ready");
    }
// 渲染排行榜
    function renderRank() {
        var sorted = sortData(rank);
        console.log(sorted);
        var sortedHtml = "";
        for (var i = 0; i < sorted.length; i++) {
            if (i < 10) {
                sortedHtml += '<tr>'
                    + '<td>' + (i + 1) + '</td>'
                    + '<td>' + sorted[i].name + '</td>'
                    + '<td>' + (sorted[i].level-1) + '</td>'
                    + '</tr>';
            }
        }
        $(".js-table").html(sortedHtml);
    }

    function sortData(data) {
        // 冒泡排序
        var temp;
        for (var i = 0; i < data.length; i++) { //比较多少趟，从第一趟开始
            for (var j = 0; j < data.length - i - 1; j++) { //每一趟比较多少次数
                if (data[j].level < data[j + 1].level) {
                    temp = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = temp;
                }
            }
        }
        return data;
    }
// 游戏初始化
    function init() {
        item_num = 6; // 关卡中的数字个数
        rank = getLocalStorage(); // 排名，存入localStorage
        cur_num = 1; // 点击数字后的下一个正确数字
        gaming = false; // 是否正在游戏中
        clicked = false;
        username = "";
    }
// 获取 本地数据
    function getLocalStorage() {
        if (JSON.parse(localStorage.getItem('GAMERANK')) == null) {
            return [];
        } else {
            return JSON.parse(localStorage.getItem('GAMERANK'));
        }
    }

    init(); // 初始化游戏
    bindEvent(); // 绑定事件
    renderRank();// 渲染排行榜
})();