var ChartBLabel = d3.select("#ChartBLabel");
ChartBLabel.html("- ");

function optionChanged() {
  updateEachPortfolio();
  histogram();
}

function updatePortfolio() {
    var pv = document.getElementById("presentValue").value;
    var iv = document.getElementById("investmentValue").value;
    var yr = document.getElementById("horizon").value;
    var pf = document.getElementById("portfolio").value;

    var sampleData = "/portfolio?pv=" + pv + "&iv=" + iv + "&yr=" + yr + "&pf=" + pf;
    XX = ['Very_Conservative', 'Conservative', 'Moderate', 'Aggressive', 'Very_Aggressive']
    YY1 = [];
    YY2 = [];
    d3.json(sampleData).then((data) => {
        XX.forEach((p) => {
            YY1.push(data.High_Value[p])
            YY2.push(data.Low_Value[p])
        });

        var trace1 = {
          x: XX,
          y: YY1,
          name: 'Likely Case',
          type: 'bar'
        };

        var trace2 = {
          x: XX,
          y: YY2,
          name: 'Unlikely Case',
          type: 'bar'
        };

        var dataA = [trace1, trace2];
        var layoutA = {
            barmode: 'group',
            bargap: 0.25,
            bargroupgap: 0.1,
            barnorm: 'value',
            xaxis: {
                tickmode: "array",
                tickvals: ['Very_Conservative', 'Conservative', 'Moderate', 'Aggressive', 'Very_Aggressive'],
                ticktext: ['Very Conservative', 'Conservative', 'Moderate', 'Aggressive', 'Very Aggressive']
            },
            xaxis: {
                showline: true
            },
            yaxis: {
                showline: true
            }
        };

        Plotly.newPlot('ChartA', dataA, layoutA, {responsive: true});
    });

    updateEachPortfolio();
    histogram();
}

function histogram() {
    var pv = document.getElementById("presentValue").value;
    var iv = document.getElementById("investmentValue").value;
    var yr = document.getElementById("horizon").value;
    var pf = document.getElementById("portfolio").value;

    var sampleData = "/histogram?pv=" + pv + "&iv=" + iv + "&yr=" + yr + "&pf=" + pf;
    hist = [];
    d3.json(sampleData).then((data) => {
        for (let [key, value] of Object.entries(data)) {
          hist.push(value);
        }

        var traceHist = {
            x: hist,
            type: 'histogram',
        };
        var dataHist = [traceHist];
        var layoutC = {
            bargap: 0.05,
            bargroupgap: 0.2,
            barmode: "overlay",
            xaxis: {
                showline: true
            }
        };
        Plotly.newPlot('ChartC', dataHist, layoutC, {responsive: true});
    });
}

function endingAmount() {
    var pv = document.getElementById("presentValue").value;
    var iv = document.getElementById("investmentValue").value;
    var yr = document.getElementById("horizon").value;
    var pf = document.getElementById("portfolio").value;
    var ps = document.getElementById("probOfSuccess").value;

    var sampleData = "/probOfSuccess?pv=" + pv + "&iv=" + iv + "&yr=" + yr + "&pf=" + pf + "&ps=" + ps;
    d3.json(sampleData).then((data) => {
        var probOfSuccessLabel = d3.select("#probOfSuccessLabel");
        probOfSuccessLabel.html(data);
    });
}

function updateEachPortfolio() {
    var pv = document.getElementById("presentValue").value;
    var iv = document.getElementById("investmentValue").value;
    var yr = document.getElementById("horizon").value;
    var pf = document.getElementById("portfolio").value;
    if (document.getElementById("portfolio").value === "Very_Conservative") {
        ChartBLabel.html("Very Conservative");
    } else if (document.getElementById("portfolio").value === "Very_Aggressive") {
        ChartBLabel.html("Very Aggressive");
    } else {
        ChartBLabel.html(document.getElementById("portfolio").value);
    }

    var sampleData = "/eachPortfolio?pv=" + pv + "&iv=" + iv + "&yr=" + yr + "&pf=" + pf;
    arrCnt = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    X = [];
    d3.json(sampleData).then((data) => {
        dataB = [];
        arrCnt.forEach((i) => {
            Y = [];
            for (j = 0; j < parseInt(yr); j++) {
                Y.push(data[i][j]);
                if (i === '0') {
                    X.push(j);
                }
            }

            var trace = {
                x: X,
                y: Y,
                mode: 'lines',
                type: 'scatter',
                name: ''
            };
            dataB.push(trace);
        });

        var layoutB = {
          showlegend: false,
            xaxis: {
                showline: false,
                autorange: true
            }
        };

        Plotly.newPlot('ChartB', dataB, layoutB, {responsive: true});
    })
}

