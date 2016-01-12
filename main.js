var dotLine = angular.module("DotLineApp", []);

dotLine.controller("DotLineCtrl", function ($scope) {
    // variables
    $scope.curPerson = 1;
    //$scope.curBlinkedDots = [];

    // !!! input
    $scope.propmtNumber = function (str) {
        // improve this
        var n = prompt(str);
        while (true) {
            n = parseInt(n);
            if (n) {
                if (n > 0) {
                    return n;
                }
            }
            //n = prompt("اشتباه است، طبق مقررات عمل کنید. ... "+str);
            n = prompt("something is wrong, follow rules... " + str + " (it must be a number bigger than 0)");
        }
    };

      //!!!! add last add this..
    $scope.n = $scope.propmtNumber('insert the number of rows:');
    //$scope.n = 3;
    $scope.m = $scope.propmtNumber('insert the number of columns:');
    //$scope.n = $scope.propmtNumber('تعداد سطر را وارد نماد.');
    //$scope.n = 3;
    //$scope.m = $scope.propmtNumber('تعداد ستون را وارد نماد.');
    //$scope.m = 2;


    $scope.sqrWidthPerc = (parseInt(100 / $scope.m) - 10) + '%';

    // temp
    //$scope.isRtl = false;
    //alert('dd');


    $scope.newGame = function () {
        //!!!! add last add this..
        $scope.n = $scope.propmtNumber('insert the number of rows:');
        $scope.m = $scope.propmtNumber('insert the number of columns:');
        $scope.restartGame();
    };

    var i,
        j,
        tmp;
    // controller matrix init
    $scope.mainMat = [
        [0]
    ]; // n+1,m+1

    $scope.initMainMat = function () {

        for (i = 0; i < $scope.n + 1; i++) {
            tmp = [];
            for (j = 0; j < $scope.m + 1; j++) {
                tmp[j] = {};

                tmp[j]['name'] = "" + i + j;
                // Dots: 0 default, 1 on blink, 3 selected, 10 deactive
                tmp[j]['dot'] = 0;

                // lines: 0 default, 1 on blink, 2 selected, 9 merged...
                if (i <= $scope.n) {
                    tmp[j]['lineX'] = 0;
                } else {
                    tmp[j]['lineX'] = 113; // no
                }
                if (j <= $scope.m) {
                    tmp[j]['lineY'] = 0;
                } else {
                    tmp[j]['lineY'] = 113; // no
                }

                // squre 0 deactive 1 gamer 1 ,, gamer 2 win...
                if (j < $scope.m && i < $scope.n) {
                    tmp[j]['sqr'] = 0;
                } else {
                    tmp[j]['sqr'] = 113; // no
                }
            }
            $scope.mainMat[i] = tmp;
        }
    };
    $scope.initMainMat();

    $scope.isAnyDotSelected = false;

    // update:
    $scope.refreshData = function () {
        // set !!!!
    };


    $scope.blinks = [];
    $scope.selected = null;

    $scope.player = 1;

    $scope.resultOfGame = [0, 0];


    // events
    $scope.dotOnClick = function (myi, myj) {
        // if default
        if ($scope.mainMat[myi][myj]['dot'] === 0) {
            if (!$scope.isAnyDotSelected) {
                // become selected
                $scope.mainMat[myi][myj]['dot'] = 3;
                $scope.isAnyDotSelected = true;
                $scope.selected = {
                    i: myi,
                    j: myj
                };

                // update blinks if not disable
                $scope.checkBlinks(myi, myj);

            } else {
                // nothing
            }
        }

        // if on select
        else if ($scope.mainMat[myi][myj]['dot'] == 3) {
            if (!$scope.isAnyDotSelected) {
                alert('!!!!! not shoul');
            } else {
                $scope.mainMat[myi][myj]['dot'] = 0;
                $scope.isAnyDotSelected = false;
                $scope.selected = null;
                // reset blink
                $scope.resetBlinkDots();
            }
        }

        // if on blink
        else if ($scope.mainMat[myi][myj]['dot'] == 1) {

            // do line...
            $scope.drawLine(myi, myj);

            // select and blink reset
            $scope.resetBlinkDots();
            $scope.isAnyDotSelected = false;
            $scope.mainMat[$scope.selected.i][$scope.selected.j]['dot'] = 0;
            $scope.selected = null;


            // !!! check disabled dot

            // check sqr full
            $scope.checkForFullSqr();

            // change score...

            // change user.
            $scope.player = ($scope.player == 1) ? 2 : 1;
            var t = window.setTimeout(function() {
                if ($scope.m * $scope.n == $scope.resultOfGame[1] + $scope.resultOfGame[0]) {
                    //finish
                    var winner;
                    if ($scope.resultOfGame[0] > $scope.resultOfGame[1]) {
                        winner = 1;
                    } else if ($scope.resultOfGame[0] < $scope.resultOfGame[1]) {
                        winner = 2;
                    } else {
                        winner = noOne;
                    }
                    alert('player ' + winner + " wins");

                    var doReset = confirm('Restart game?');
                    if (doReset) {
                        $scope.restartGame();
                    }
                }
            }, 500);


        }


        // if disabled: nothing
    };
    $scope.restartGame = function () {
        $scope.initMainMat();
        $scope.isAnyDotSelected = false;
        $scope.blinks = [];
        $scope.selected = null;
        $scope.player = 1;
        $scope.resultOfGame = [0, 0];
    };
    $scope.resetBlinkDots = function () {
        for (var ii in $scope.blinks) {
            dd = $scope.blinks[ii];
            $scope.mainMat[dd.i][dd.j]['dot'] = 0;
        }
        $scope.blinks = [];
    };
    $scope.checkForFullSqr = function () {
        var k = false;
        for (var myi = 0; myi < $scope.n; myi++) {
            for (var myj = 0; myj < $scope.m; myj++) {
                if ($scope.mainMat[myi][myj]['sqr'] === 0) {
                    if ($scope.mainMat[myi][myj]['lineX'] == 2 && $scope.mainMat[myi][myj]['lineY'] == 2) {
                        if ($scope.mainMat[myi + 1][myj]['lineX'] == 2 && $scope.mainMat[myi][myj + 1]['lineY'] == 2) {
                            $scope.mainMat[myi][myj]['sqr'] = $scope.player;
                            $scope.resultOfGame[$scope.player - 1]++;
                            k = true;
                        }
                    }
                }
            }
        }
        if (k) {
            $scope.player = ($scope.player == 1) ? 2 : 1
        }
        // check disabled dot and line
    };
    $scope.checkBlinks = function (myi, myj) {
        var blinkCanBe = [{
            i: myi + 1,
            j: myj
        }, {
            i: myi - 1,
            j: myj
        }, {
            i: myi,
            j: myj + 1
        }, {
            i: myi,
            j: myj - 1
        }];
        for (var ii in blinkCanBe) {
            dd = blinkCanBe[ii];
            var k = false;
            if (dd.i <= $scope.n && dd.j <= $scope.m && dd.i >= 0 && dd.j >= 0) { // is limited?
                if ($scope.mainMat[dd.i][dd.j]['dot'] === 0) {
                    //k = true; //!!!!!!!!!! fix it
                    if (dd.i == $scope.selected.i) {
                        if (dd.j == $scope.selected.j + 1) {
                            if ($scope.mainMat[dd.i][dd.j - 1]['lineX'] === 0) {
                                k = true;
                            }
                        } else {
                            if ($scope.mainMat[dd.i][dd.j]['lineX'] === 0) {
                                k = true;
                            }
                        }
                    } else {
                        if (dd.i == $scope.selected.i + 1) {
                            if ($scope.mainMat[dd.i - 1][dd.j]['lineY'] === 0) {
                                k = true;
                            }
                        } else {
                            if ($scope.mainMat[dd.i][dd.j]['lineY'] === 0) {
                                k = true;
                            }
                        }
                    }
                    if (k) {
                        $scope.mainMat[dd.i][dd.j]['dot'] = 1;
                        $scope.blinks[$scope.blinks.length] = dd;
                    }
                }
            }
        }
    };
    $scope.drawLine = function (myi, myj) {
        //
        if (myi == $scope.selected.i) {
            if (myj == $scope.selected.j + 1) {
                // prev X
                $scope.mainMat[myi][myj - 1]['lineX'] = 2;

            } else if (myj == $scope.selected.j - 1) {
                // this X
                $scope.mainMat[myi][myj]['lineX'] = 2;
            }
        } else {
            if (myi == $scope.selected.i + 1) {
                // prev Y
                $scope.mainMat[myi - 1][myj]['lineY'] = 2;
            } else if (myi == $scope.selected.i - 1) {
                // prev Y
                $scope.mainMat[myi][myj]['lineY'] = 2;
            }
        }
    };

  
});