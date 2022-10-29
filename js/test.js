
    // alert(111);
    let hitter_view = ['外角高め','内角高め','内角低め','外角低め'];
    

    // バッターの狙いとピッチャーの狙いが合致した
    // ときのホームラン、ヒット、ファール、空振りの確率配列、
    // 両者の狙いが不一致の場合の確率配列を作成
    // https://qiita.com/kkosuke/items/b6cf84cbb638255061b6
    // を見て、思いついたのが乱数を0-100として、それがどの分布に入るかで、判定。
    let same_view = [10,40,60,85,100];
    let different_view = [5,20,60,80,100];

//    各種カウントの設定
    let strike_num = 0;
    let out_num = 0;
    let score = 0;
    let runner = 0;
    let inning=1;

    $('#top-left-box').on('click',function(){
        // アウトが３未満なら、交代という表示を出さない
        if(out_num<3){
            $("#stop-game").text("");
        }
        // 打者の狙う位置をランダムで出す
        let random = Math.floor(Math.random() * 4);
        // 打者の結果をランダムで計算
        let probability = Math.random() * 100;
        let result_view =[];
        console.log(probability);
        console.log(hitter_view[random], "バッターの狙い");
        // 投げたところとバッターの狙いの一致、不一致を踏まえて、結果判定の目盛り配列を設定
        if( hitter_view[random]=='外角高め'){
            console.log('一致');
            result_view = same_view;
        }else{
            console.log('不一致');
            result_view = different_view;
        }
        // 100までの乱数が結果配列のどの範囲に含まれるかで、結果を分別
        if(probability<result_view[0]){
            // ホームランのときだけ、ホームラン動画を表示
            $('#homerun').show();
            let v = document.getElementById("homerun");
            v.play();
            setTimeout(function(){
                $('#homerun').fadeOut();
            },6500);
            $("#result").text("ホームラン");
            // カウンタを動かす
            score ++;
            score +=runner;
            runner=0;
            strike_num=0;
            console.log("ホームラン");
        }else if(probability<result_view[1]){
            $("#result").text("ヒット");
            runner ++;
            strike_num=0;
            console.log("ヒット");
            if(runner>3){
                runner = 3;
                score ++;
            }
        }else if(probability<result_view[2]){
            $("#result").text("内野ゴロ").fadeIn(5000);
            out_num++
            strike_num=0;
            console.log("内野ゴロ");
        }else if(probability<result_view[3]){
            $("#result").text("ファール");
            if(strike_num<2){
                strike_num++;
            }
            console.log("ファール");
        }else if(probability<result_view[4]){
            $("#result").text("空振り");
            strike_num++;
            console.log("空振り");
        }
        
         // カウンタを動かす
        if(strike_num===3){
            out_num++;
            strike_num=0;
        }
        if(out_num===3){
            $("#stop-game").text("3アウト交代");
        }

        
        console.log(strike_num, 'strike');
        console.log(out_num,'out');
        console.log(score,'score');
        console.log(runner,'runner');

         // カウンタを表示
        $("#status").text(inning+'回の守り、'+strike_num+'ストライク、'+out_num+'アウト、'+runner+'人が出塁中、'+'ここまで'+score+'点をとられました。');
            
        if(out_num<3){
        return{
            strike_num,
            out_num,
            score,
            runner,
        }
        }else{
        strike_num=0;
        out_num=0;
        runner=0;
        inning++;
        return{
            strike_num,
            out_num,
            score,
            runner,
            inning
            }
            }

    });

    // その他３つの場所を押したときも、同様の処理。冗長になったが、カウンタも問題なく動いたので、このまま

    $('#top-right-box').on('click',function(){
        if(out_num<3){
            $("#stop-game").text("");
        }
        let random = Math.floor(Math.random() * 4);

        let probability = Math.random() * 100;
        let result_view =[];
        console.log(probability);
        
        console.log(hitter_view[random], "バッターの狙い");
        if( hitter_view[random]=='外角高め'){
            console.log('一致');
            result_view = same_view;
        }else{
            console.log('不一致');
            result_view = different_view;
        }
            if(probability<result_view[0]){
                $('#homerun').show();
                let v = document.getElementById("homerun");
                v.play();
                setTimeout(function(){
                    $('#homerun').fadeOut();
                },6500);
                $("#result").text("ホームラン");
                score ++;
                score +=runner;
                runner=0;
                strike_num=0;
                console.log("ホームラン");
            }else if(probability<result_view[1]){
                $("#result").text("ヒット");
                runner ++;
                strike_num=0;
                console.log("ヒット");
                if(runner>3){
                    runner = 3;
                    score ++;
                }
            }else if(probability<result_view[2]){
                $("#result").text("内野ゴロ").fadeIn(5000);
                out_num++
                strike_num=0;
                console.log("内野ゴロ");
            }else if(probability<result_view[3]){
                $("#result").text("ファール");
                if(strike_num<2){
                    strike_num++;
                }
                console.log("ファール");
            }else if(probability<result_view[4]){
                $("#result").text("空振り");
                strike_num++;
                console.log("空振り");
            }
                        
            if(strike_num===3){
                out_num++;
                strike_num=0;
            }

            if(out_num===3){
                $("#stop-game").text("3アウト交代");
            }

            
            console.log(strike_num, 'strike');
            console.log(out_num,'out');
            console.log(score,'score');
            console.log(runner,'runner');

            $("#status").text(inning+'回の守り、'+strike_num+'ストライク、'+out_num+'アウト、'+runner+'人が出塁中、'+'ここまで'+score+'点をとられました。');
                
            if(out_num<3){
            return{
                strike_num,
                out_num,
                score,
                runner,
            }
        }else{
            strike_num=0;
            out_num=0;
            runner=0;
            inning++;
            return{
                strike_num,
                out_num,
                score,
                runner,
                inning
                }
                }

    });

    $('#bottom-left-box').on('click',function(){
        if(out_num<3){
            $("#stop-game").text("");
        }
        let random = Math.floor(Math.random() * 4);

        let probability = Math.random() * 100;
        let result_view =[];
        console.log(probability);
        
        console.log(hitter_view[random], "バッターの狙い");
        if( hitter_view[random]=='外角高め'){
            console.log('一致');
            result_view = same_view;
        }else{
            console.log('不一致');
            result_view = different_view;
        }
            if(probability<result_view[0]){
                $('#homerun').show();
                let v = document.getElementById("homerun");
                v.play();
                setTimeout(function(){
                    $('#homerun').fadeOut();
                },6500);
                $("#result").text("ホームラン");
                score ++;
                score +=runner;
                runner=0;
                strike_num=0;
                console.log("ホームラン");
            }else if(probability<result_view[1]){
                $("#result").text("ヒット");
                runner ++;
                strike_num=0;
                console.log("ヒット");
                if(runner>3){
                    runner = 3;
                    score ++;
                }
            }else if(probability<result_view[2]){
                $("#result").text("内野ゴロ").fadeIn(5000);
                out_num++
                strike_num=0;
                console.log("内野ゴロ");
            }else if(probability<result_view[3]){
                $("#result").text("ファール");
                if(strike_num<2){
                    strike_num++;
                }
                console.log("ファール");
            }else if(probability<result_view[4]){
                $("#result").text("空振り");
                strike_num++;
                console.log("空振り");
            }
                        
            if(strike_num===3){
                out_num++;
                strike_num=0;
            }

            if(out_num===3){
                $("#stop-game").text("3アウト交代");
            }

            
            console.log(strike_num, 'strike');
            console.log(out_num,'out');
            console.log(score,'score');
            console.log(runner,'runner');

            $("#status").text(inning+'回の守り、'+strike_num+'ストライク、'+out_num+'アウト、'+runner+'人が出塁中、'+'ここまで'+score+'点をとられました。');
                
            if(out_num<3){
            return{
                strike_num,
                out_num,
                score,
                runner,
            }
        }else{
            strike_num=0;
            out_num=0;
            runner=0;
            inning++;
            return{
                strike_num,
                out_num,
                score,
                runner,
                inning
                }
                }

    });

    $('#bottom-right-box').on('click',function(){
        if(out_num<3){
            $("#stop-game").text("");
        }
        let random = Math.floor(Math.random() * 4);

        let probability = Math.random() * 100;
        let result_view =[];
        console.log(probability);
        
        console.log(hitter_view[random], "バッターの狙い");
        if( hitter_view[random]=='外角高め'){
            console.log('一致');
            result_view = same_view;
        }else{
            console.log('不一致');
            result_view = different_view;
        }
            if(probability<result_view[0]){
                $('#homerun').show();
                let v = document.getElementById("homerun");
                v.play();
                setTimeout(function(){
                    $('#homerun').fadeOut();
                },6500);
                $("#result").text("ホームラン");
                score ++;
                score +=runner;
                runner=0;
                strike_num=0;
                console.log("ホームラン");
            }else if(probability<result_view[1]){
                $("#result").text("ヒット");
                runner ++;
                strike_num=0;
                console.log("ヒット");
                if(runner>3){
                    runner = 3;
                    score ++;
                }
            }else if(probability<result_view[2]){
                $("#result").text("内野ゴロ").fadeIn(5000);
                out_num++
                strike_num=0;
                console.log("内野ゴロ");
            }else if(probability<result_view[3]){
                $("#result").text("ファール");
                if(strike_num<2){
                    strike_num++;
                }
                console.log("ファール");
            }else if(probability<result_view[4]){
                $("#result").text("空振り");
                strike_num++;
                console.log("空振り");
            }
                        
            if(strike_num===3){
                out_num++;
                strike_num=0;
            }

            if(out_num===3){
                $("#stop-game").text("3アウト交代");
            }

            
            console.log(strike_num, 'strike');
            console.log(out_num,'out');
            console.log(score,'score');
            console.log(runner,'runner');

            $("#status").text(inning+'回の守り、'+strike_num+'ストライク、'+out_num+'アウト、'+runner+'人が出塁中、'+'ここまで'+score+'点をとられました。');
                
            if(out_num<3){
            return{
                strike_num,
                out_num,
                score,
                runner,
            }
        }else{
            strike_num=0;
            out_num=0;
            runner=0;
            inning++;
            return{
                strike_num,
                out_num,
                score,
                runner,
                inning
                }
                }

    });