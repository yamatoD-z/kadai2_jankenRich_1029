
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
// // 【精緻化や改善点】
// １．投球数、ヒット数など1試合の合計値、それに基づく打率などの表示。
// 2．選手毎の結果累計をローカルストレージに保存させる。
// 3.ヒットの内容を踏まえた進塁の考慮(ランナー3人いて二塁打なら２点はいる、など)

//    各種カウントの設定
    let out_num = 0;
    let out_num_total = 0;
    let score = 0;
    let runner = 0;
    let inning=1;

    // 複数選手の累計データを保有するには、以下の変数だと不便になったので、オブジェクトを利用。
    // let daseki =0;
    // let single =0;
    // let double =0;
    // let triple =0;
    // let homerun =0;
    // let fourball =0;
    // let strikeout =0;
    // let mishit =0;
    // let hit_rate = (single+double+triple+homerun)/(daseki-fourball);

    let ochiai_result = {daseki:0,single:0,double:0,triple:0,homerun:0,fourball:0,strikeout:0,mishit:0,hit_rate:0};


    //  左から、累計で［シングルヒット、2ベースヒット、3ベースヒット、ホームラン、三振、四球・死球、アウト（ゴロ、フライ）］
    let ochiai_record=[92,116,117,169,209,313,568];
    console.log(ochiai_record);

    //  乱数は100で統一するので、上記結果を標準化
    let ochiai_record_standard=[];
    ochiai_record.forEach(function(value,index){
        ochiai_record_standard[index]=ochiai_record[index]/(ochiai_record[6]/100);
    });
    console.log(ochiai_record_standard);

    // 関数の呼び出しのテスト
    // function ochiai_console(msg){
    //     console.log(msg);
    // }
    // $('#ochiai_nine').on('click',function(){
    //     ochiai_console(ochiai_record);
    // });



   // 関数の切り出し
    function ochiai_simulation(){

    ochiai_result.daseki ++;
    let daseki =0;
    daseki++


    // for文でアウト27個になるまで繰り返し

    // アウトが３未満なら、交代という表示を出さない
    if(out_num<3){
        $("#stop-game").text("");
    }
    
    let probability = Math.random() * 100;
    let record_view =ochiai_record_standard;
    console.log(probability);
    // console.log((single+double+triple+homerun)/(daseki-fourball));
    
    // 100までの乱数が結果配列のどの範囲に含まれるかで、結果を分別
    if(probability<record_view[0]){            
        $("#result").text("シングルヒット");
        runner ++;
        ochiai_result.single ++;
        console.log("ヒット");
        if(runner>3){
            runner = 3;
            score ++;
        }
        
    }else if(probability<record_view[1]){
        $("#result").text("2塁打");
        ochiai_result.double ++;
        console.log("2塁打");
        if(runner>=2){
            runner = 2;
            score = score + runner -1;
        }else{
            runner ++;
        }
    }else if(probability<record_view[2]){
        $("#result").text("3塁打");
        ochiai_result.triple ++;
        console.log("3塁打");
        score +=runner;
        runner=1;

    }else if(probability<record_view[3]){
        $("#result").text("ホームラン");
        score ++;
        ochiai_result.homerun ++;
        score +=runner;
        runner=0;
        console.log("ホームラン");
    }else if(probability<record_view[4]){
        $("#result").text("三振");
        out_num++;
        out_num_total++;
        ochiai_result.strikeout ++;
        console.log("三振");
    }else if(probability<record_view[5]){            
        $("#result").text("四球・死球");
        runner ++;
        ochiai_result.fourball ++;
        console.log("四球・死球");
        if(runner>3){
            runner = 3;
            score ++;
        }
    }else if(probability<record_view[6]){
        $("#result").text("アウト（ゴロ、フライ）");
        out_num++;
        out_num_total++;
        ochiai_result.mishit ++;
        console.log("アウト（ゴロ、フライ）");
    }
     // カウンタを動かす
    if(out_num===3){
        $("#stop-game").text("3アウト交代");
    }

    console.log(out_num,'out');
    console.log(score,'score');
    console.log(runner,'runner');
    let averagecount = Math.floor(score/(inning /9));
    let hit_rate = Math.floor(
        (ochiai_result.single+ochiai_result.double+ochiai_result.triple+ochiai_result.homerun)/(ochiai_result.daseki-ochiai_result.fourball)*1000
        );
     // カウンタを表示
    $("#status_ochiai").text('落合1985：'+inning+'回、'+out_num+'アウト、'+runner+'人が出塁中、'+'ここまで'+score+'点をとられました。1試合平均では'+averagecount+'点、とられています');
    $("#total_ochiai").text('落合1985：全'+ochiai_result.daseki+'打席のうち、1塁打'+ochiai_result.single+'回、2塁打'+ochiai_result.double+'回、3塁打'+ochiai_result.triple+'回、ホームラン'+ochiai_result.homerun+'回、三振'+ochiai_result.strikeout+'回、四球'+ochiai_result.fourball+'回、凡打'+ochiai_result.mishit+'回、打率は.'+hit_rate+'です。');
    if(out_num<3){
    return{
        out_num,
        score,
        runner,
    }
    }else{
    out_num=0;
    runner=0;
    inning++;
    return{
        out_num,
        score,
        runner,
        inning
        }
        }

    }

    // 1.1打席毎計算
    // clickのあとに直接、関数名を入れても動かなくてエラーが出る。
    $('#ochiai').on('click',function(){
        ochiai_simulation();
    });

    // 2.9イニング毎計算。whileでやるしかない。
    $('#ochiai_nine').on('click',function(){
        out_num_total=0;
        while(out_num_total<27){
        ochiai_simulation();
        }
    });

    // 3.100打席毎計算
    $('#ochiai_hundred').on('click',function(){
        for(let i =0; i<100; i++){
            
        ochiai_simulation();
        }
    });

    // 一気に結果が出てしまうのも味気ないので、経過を見れるようにtimeoutを使うも、変わらず。しかもエラーが残る。
    // $('#ochiai_hundred').on('click',function(){
    //     for(let i =0; i<100; i++){
    //     setTimeout(ochiai_simulation(),1000);}
    // });


