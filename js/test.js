
// alert(111);

// （古いバージョンに関するコメント、コード）
// let hitter_view = ['外角高め','内角高め','内角低め','外角低め'];
// バッターの狙いとピッチャーの狙いが合致した
// ときのホームラン、ヒット、ファール、空振りの確率配列、
// 両者の狙いが不一致の場合の確率配列を作成
// https://qiita.com/kkosuke/items/b6cf84cbb638255061b6
// を見て、思いついたのが乱数を0-100として、それがどの分布に入るかで、判定。
// let same_view = [10,40,60,85,100];
// let different_view = [5,20,60,80,100];

// （リッチバージョン）
// 【内容】
// ゲーム性は後退して、シミュレータ的なものに変更。
// 打者は過去に3冠王をとった選手から選択。その選手か9回全打席に出たとすると、
// 何点取られるのかシミュレーションする。
// 選手は85年の落合、86年のバース、04年松中、22年村上。
// 実際の結果をベースにパラメータを設定。
// 結果は1球ごとではなく、1打席毎。
// 確率は、年間結果を踏まえて、［シングルヒット、2ベースヒット、3ベースヒット、ホームラン、三振、四球、死球、アウト（ゴロ、フライ）］
// // もはや、1球ずつクリックする意味もないので、選手を選んだら、勝手にシミュレーションが始まる。
// 【精緻化や改善点】
// １．9回で終了
// ２．投球数、ヒット数など1試合の合計値、それに基づく打率などの表示。
// ３．選手毎の結果累計、最高の結果をローカルストレージに保存させる。
// 4.ヒットの内容を踏まえた進塁の考慮

//    各種カウントの設定
    let strike_num = 0;
    let out_num = 0;
    let out_num_total = 0;
    let score = 0;
    let runner = 0;
    let inning=1;

    //  左から、［シングルヒット、2ベースヒット、3ベースヒット、ホームラン、三振、四球、死球、アウト（ゴロ、フライ）］
    let ochiai_result=[77,98,99,155,283,401,408,612];
    console.log(ochiai_result);
    let ochiai_result_standard=[];
    //  乱数は100で統一するので、上記結果を標準化
    ochiai_result.forEach(function(value,index){
        ochiai_result_standard[index]=ochiai_result[index]/(ochiai_result[7]/100);
    });
    console.log(ochiai_result_standard);


    $('#ochiai').on('click',function(){
        // アウトが３未満なら、交代という表示を出さない
        if(out_num<3){
            $("#stop-game").text("");
        }
        
        let probability = Math.random() * 100;
        let result_view =ochiai_result;
        console.log(probability);
        
        // 100までの乱数が結果配列のどの範囲に含まれるかで、結果を分別
        if(probability<result_view[0]){
            // ホームランのときだけ、ホームラン動画を表示
            
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
