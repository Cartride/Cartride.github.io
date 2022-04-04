let myChart = echarts.init(document.getElementById('post-calendar'));
    <%
    var nameMap = (config.language && config.language.indexOf('zh') >= 0) ? 'cn' : 'en';
    var titleText = (config.language && config.language.indexOf('zh') >= 0) ? '文章日历' : 'Post Calendar';
    // calculate range.
    var startDate = moment().subtract(1, 'years');
    var endDate = moment();
    var rangeArr = '["' + startDate.format('YYYY-MM-DD') + '", "' + endDate.format('YYYY-MM-DD') + '"]';
    // post and count map.
    var dateMap = new Map();
    site.posts.forEach(function (post) {
        var date = post.date.format('YYYY-MM-DD');
        var count = dateMap.get(date);
        dateMap.set(date, count == null || count == undefined ? 1 : count + 1);
    });
    // loop the data for the current year, generating the number of post per day
    var i = 0;
    var datePosts = '[';
    var dayTime = 3600 * 24 * 1000;
    for (var time = startDate; time <= endDate; time += dayTime) {
        var date = moment(time).format('YYYY-MM-DD');
        datePosts = (i === 0 ? datePosts + '["' : datePosts + ', ["') + date + '", '
                + (dateMap.has(date) ? dateMap.get(date) : 0) + ']';
        i++;
    }
    datePosts += ']';
    %>
    let option = {
        title: {
            top: 0,
            text: '<%- titleText %>',
            left: 'center',
            textStyle: {
                color: '#3C4858'
            }
        },
        tooltip: {
            padding: 10,
            backgroundColor: '#555',
            borderColor: '#777',
            borderWidth: 1,
            formatter: function (obj) {
                var value = obj.value;
                return '<div style="font-size: 14px;">' + value[0] + '：' + value[1] + '</div>';
            }
        },
        visualMap: {
            show: true,
            showLabel: true,
            categories: [0, 1, 2, 3, 4],
            calculable: true,
            inRange: {
                symbol: 'rect',
                color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
            },
            itemWidth: 12,
            itemHeight: 12,
            orient: 'horizontal',
            left: 'center',
            bottom: 0
        },
        calendar: [{
            left: 'center',
            range: <%- rangeArr %>,
            cellSize: [13, 13],
            splitLine: {
                show: false
            },
            itemStyle: {
                color: '#196127',
                borderColor: '#fff',
                borderWidth: 2
            },
            yearLabel: {
                show: false
            },
            monthLabel: {
                nameMap: '<%- nameMap %>',
                fontSize: 11
            },
            dayLabel: {
                formatter: '{start}  1st',
                nameMap: '<%- nameMap %>',
                fontSize: 11
            }
        }],
        series: [{
            type: 'heatmap',
            coordinateSystem: 'calendar',
            calendarIndex: 0,
            data: <%- datePosts %>
        }]
    };
    myChart.setOption(option);