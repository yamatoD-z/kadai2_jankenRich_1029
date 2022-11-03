
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
// 2．選手毎の結果累計をローカルストレージに保存させる。ブラウザ更新後も継承を行うことで、続きからデータを足していける
// 3.ヒットの内容を踏まえた進塁の考慮(ランナー3人いて二塁打なら２点はいる、など)
// ４．9回一括、100打席一括の繰り返し処理

//    各種カウントの設定
// 実際のゲームだと、同じアウトカウントを共有するので、グローバル変数が妥当。ただ、今回の想定は、すべての打席を同じ選手が立つ場合なので、グローバル変数だと、
// 落合が1打席打ってアウトになると、バースは1アウトの状態で始まる。100打席とか一気に計算するうえでは誤差だけど、選手データにもたせることで精緻化
// もはや不要になったものの、どういうことになるのか、コンソールで確認できるように残しておく
    let out_num = 0;
    let out_num_total = 0;
    let runner = 0;
    

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

// 選手打席データ
// 当初、イニング数、スコアは前回からの流れで全体共通の変数としていた。ただ、そうすると、9回を一気に進める機能を使った際、
// 落合が９０回に進んだあとで、バースの9回進行ボタンを押すと、バースの結果が99回になってしまう。点数も引き継がれたような結果となった。
// そのため、イニング数、スコアも、各自のデータとして保有するように変更。
// アウト数も、よくよく見てみると、おかしな動き。選手データに入れることにする。
    let ochiai_result = {daseki:0,single:0,double:0,triple:0,homerun:0,fourball:0,strikeout:0,mishit:0,hit_rate:0,average_score:0,innings:1,scores:0,out_num:0,out_num_total:0,runner:0};
    let bass_result = {daseki:0,single:0,double:0,triple:0,homerun:0,fourball:0,strikeout:0,mishit:0,hit_rate:0,average_score:0,innings:1,scores:0,out_num:0,out_num_total:0,runner:0};
    let matsunaka_result = {daseki:0,single:0,double:0,triple:0,homerun:0,fourball:0,strikeout:0,mishit:0,hit_rate:0,average_score:0,innings:1,scores:0,out_num:0,out_num_total:0,runner:0};
    let murakami_result = {daseki:0,single:0,double:0,triple:0,homerun:0,fourball:0,strikeout:0,mishit:0,hit_rate:0,average_score:0,innings:1,scores:0,out_num:0,out_num_total:0,runner:0};

//  左から、累計で［シングルヒット、2ベースヒット、3ベースヒット、ホームラン、三振、四球・死球、アウト（ゴロ、フライ）］
    let ochiai_record=[92,116,117,169,209,313,568];
    let bass_record=[96,127,129,176,246,330,541];
    let matsunaka_record=[89,126,127,171,238,334,577];
    let murakami_record=[77,98,99,155,283,408,612];

//  乱数は100で統一するので、上記結果を標準化
    let ochiai_record_standard=[];
    ochiai_record.forEach(function(value,index){
        ochiai_record_standard[index]=ochiai_record[index]/(ochiai_record[6]/100);
    });
        
    let bass_record_standard=[];
    bass_record.forEach(function(value,index){
        bass_record_standard[index]=bass_record[index]/(bass_record[6]/100);
    });
    
    let matsunaka_record_standard=[];
    matsunaka_record.forEach(function(value,index){
        matsunaka_record_standard[index]=matsunaka_record[index]/(matsunaka_record[6]/100);
    });

    let murakami_record_standard=[];
    murakami_record.forEach(function(value,index){
        murakami_record_standard[index]=murakami_record[index]/(murakami_record[6]/100);
    });


// 選手毎の回数、総得点カウンタ
    let ochiai_inning;
    let bass_inning;
    let matsunaka_inning;
    let murakami_inning;

    let ochiai_score=0;
    let bass_score=0;
    let matsunaka_score=0;
    let murakami_score=0;

// 関数の切り出し
    function simulation(result, record_standard, status_id, total_id, name_year){

    result.daseki ++;

    let probability = Math.random() * 100;
    let record_view =record_standard;
    console.log(probability);

    // 100までの乱数が結果配列のどの範囲に含まれるかで、結果を分別
    if(probability<record_view[0]){            
        $("#result").text("シングルヒット");
        runner ++;
        result.single ++;
        console.log("ヒット");
        // ランナーを加算した結果、3人より多くなれば、1点入って、ランナーは3人にする。
        if(runner>3){
            runner = 3;
            result.scores ++;
        }        
    }else if(probability<record_view[1]){
        $("#result").text("2塁打");
        result.double ++;
        console.log("2塁打");
        // ランナーが2人以上いれば、ホームに帰ってくるので、点数に加算。合わせて、残っているランナーを調整。
        if(runner>=2){
            runner = 2;
            result.scores = result.scores + runner -1;
        }else{
            runner ++;
        }
    }else if(probability<record_view[2]){
        $("#result").text("3塁打");
        result.triple ++;
        // すでにいるランナーはホームに帰ってくるので、点数に加算
        console.log("3塁打");
        result.scores +=runner;
        runner=1;
    }else if(probability<record_view[3]){
        $("#result").text("ホームラン");
        result.scores ++;
        result.homerun ++;
        result.scores +=runner;
        runner=0;
        console.log("ホームラン");
    }else if(probability<record_view[4]){
        $("#result").text("三振");
        out_num++;
        out_num_total++;
        result.out_num++;
        result.out_num_total++;
        result.strikeout ++;
        console.log("三振");
    }else if(probability<record_view[5]){            
        $("#result").text("四球・死球");
        runner ++;
        result.fourball ++;
        console.log("四球・死球");
        if(runner>3){
            runner = 3;
            result.scores ++;
        }
    }else if(probability<record_view[6]){
        $("#result").text("アウト（ゴロ、フライ）");
        out_num++;
        out_num_total++;
        result.out_num++;
        result.out_num_total++;
        result.mishit ++;
        console.log("アウト（ゴロ、フライ）");
    }

    console.log(out_num,'out');
    console.log(out_num_total,'out_total');
    console.log(result.out_num,'result.out');
    console.log(result.out_num_total,'result.out_total');
    console.log(result.scores,'score');
    console.log(runner,'runner');
    console.log(result.runner,'result.runner');

    // 1試合（9回）平均の得点数。小数点を出すために、100倍してから端数を落として、その後100で割る
    let average_count = Math.floor(result.scores/(result.innings /9)*100)/100;
    result.average_score=average_count;
    // 打率の計算
    // ローカルストレージから呼び出すと、数字がおかしくなる。記録されているデータは正しく見える。
    let hit_rate = Math.floor(
        (result.single+result.double+result.triple+result.homerun)/(result.daseki-result.fourball)*1000
        );
    result.hit_rate =hit_rate;     
    // 結果の表示
    $(status_id).text(name_year+'：'+result.innings+'回、'+result.out_num+'アウト、'+result.runner+'人が出塁中、'+'ここまで'+result.scores+'点をとられました。1試合平均では'+average_count+'点、とりました');
    $(total_id).text(name_year+'：全'+result.daseki+'打席のうち、1塁打'+result.single+'回、2塁打'+result.double+'回、3塁打'+result.triple+'回、ホームラン'+result.homerun+'回、三振'+result.strikeout+'回、四球'+result.fourball+'回、凡打'+result.mishit+'回、打率は.'+hit_rate+'です。');
    
    if(result.out_num===3){
        result.out_num=0;
        result.runner=0;
        result.innings++;
        }

    if(out_num<3){
    return{
        out_num,
        runner
    }
    }else{
    out_num=0;
    runner=0;
    return{
        out_num,
        runner
        }
    }

    }

// まとめた関数を利用して、選手毎の引数を設定

// 落合対応
    // 1.1打席毎計算
    // clickのあとに直接、関数名を入れても動かなくてエラーが出る。文法通り、function()とする。
    // セレクタ部分はコロン付きで引数にしてみたら、そのままjQueryは動いた
    $('#ochiai').on('click',function(){
        simulation(ochiai_result, ochiai_record_standard, "#status_ochiai", "#total_ochiai", '落合1985');
    });
    // 2.9イニング毎計算。whileでやるしかない。
    $('#ochiai_nine').on('click',function(){
        out_num_total=0;
        while(out_num_total<27){
        simulation(ochiai_result, ochiai_record_standard, "#status_ochiai", "#total_ochiai", '落合1985');
        }
    });

    // 3.100打席毎計算
    $('#ochiai_hundred').on('click',function(){
        for(let i =0; i<100; i++){
        simulation(ochiai_result, ochiai_record_standard, "#status_ochiai", "#total_ochiai", '落合1985');
        }
    });

    // 4.総データを記録
    $('#ochiai_add').on('click',function(){
        Object.keys(ochiai_result).forEach(function(key){
        localStorage.setItem('ochiai_result_'+key,ochiai_result[key]);
        });
        alert("successfully saved");
        });

    // 5.総データを破棄
    $('#ochiai_delete').on('click',function(){
        Object.keys(ochiai_result).forEach(function(key){
        localStorage.removeItem('ochiai_result_'+key);
        });
        alert("successfully deleted");
        });

    // 6.データを継承（ローカルストレージの内容を取り込む）
    // ブラウザを更新しても、継承後、続きから再開できる。ただし、記録していることが前提
    $('#ochiai_inherit').on('click',function(){
        Object.keys(ochiai_result).forEach(function(key){
        ochiai_result[key]=localStorage.getItem('ochiai_result_'+key);
        });
        console.log(ochiai_result);
        alert("successfully inherited");
        });


    // 一気に結果が出てしまうのも味気ないので、経過を見れるようにtimeoutを使うも、変わらず。しかもエラーが残る。
    // $('#ochiai_hundred').on('click',function(){
    //     for(let i =0; i<100; i++){
    //     setTimeout(ochiai_simulation(),1000);}
    // });

// バース対応
    // 1.1打席毎計算
    // clickのあとに直接、関数名を入れても動かなくてエラーが出る。
    $('#bass').on('click',function(){
        simulation(bass_result, bass_record_standard, "#status_bass", "#total_bass", 'バース1986');
    });

    // 2.9イニング毎計算。whileでやるしかない。
    $('#bass_nine').on('click',function(){
        out_num_total=0;
        while(out_num_total<27){
            simulation(bass_result, bass_record_standard, "#status_bass", "#total_bass", 'バース1986');
        }
    });

    // 3.100打席毎計算
    $('#bass_hundred').on('click',function(){
        for(let i =0; i<100; i++){
            simulation(bass_result, bass_record_standard, "#status_bass", "#total_bass", 'バース1986');
        }
    });

    // 4.総データを記録
    $('#bass_add').on('click',function(){
        Object.keys(bass_result).forEach(function(key){
        localStorage.setItem('bass_result_'+key,bass_result[key]);
        });
        alert("successfully saved");
        });

    // 5.総データを破棄
    $('#bass_delete').on('click',function(){
        Object.keys(bass_result).forEach(function(key){
        localStorage.removeItem('bass_result_'+key);
        });
        alert("successfully deleted");
        });

    // 6.データを継承（ローカルストレージの内容を取り込む）
    // ブラウザを更新しても、継承後、続きから再開できる。ただし、記録していることが前提
    $('#bass_inherit').on('click',function(){
        Object.keys(bass_result).forEach(function(key){
        bass_result[key]=localStorage.getItem('bass_result_'+key);
        });
        console.log(bass_result);
        alert("successfully inherited");
        });

// 松中対応
    // 1.1打席毎計算
    // clickのあとに直接、関数名を入れても動かなくてエラーが出る。
    $('#matsunaka').on('click',function(){
        simulation(matsunaka_result, matsunaka_record_standard, "#status_matsunaka", "#total_matsunaka", '松中2004');
    });

    // 2.9イニング毎計算。whileでやるしかない。
    $('#matsunaka_nine').on('click',function(){
        out_num_total=0;
        while(out_num_total<27){
            simulation(matsunaka_result, matsunaka_record_standard, "#status_matsunaka", "#total_matsunaka", '松中2004');
        }
    });

    // 3.100打席毎計算
    $('#matsunaka_hundred').on('click',function(){
        for(let i =0; i<100; i++){        
            simulation(matsunaka_result, matsunaka_record_standard, "#status_matsunaka", "#total_matsunaka", '松中2004');
        }
    });

    // 4.総データを記録
    $('#matsunaka_add').on('click',function(){
        Object.keys(matsunaka_result).forEach(function(key){
        localStorage.setItem('matsunaka_result_'+key,matsunaka_result[key]);
        });
        alert("successfully saved");
        });

    // 5.総データを破棄
    $('#matsunaka_delete').on('click',function(){
        Object.keys(matsunaka_result).forEach(function(key){
        localStorage.removeItem('matsunaka_result_'+key);
        });
        alert("successfully deleted");
        });

    // 6.データを継承（ローカルストレージの内容を取り込む）
    // ブラウザを更新しても、継承後、続きから再開できる。ただし、記録していることが前提
    $('#matsunaka_inherit').on('click',function(){
        Object.keys(matsunaka_result).forEach(function(key){
        matsunaka_result[key]=localStorage.getItem('matsunaka_result_'+key);
        });
        console.log(matsunaka_result);
        alert("successfully inherited");
        });



// 村上対応
    // 1.1打席毎計算
    // clickのあとに直接、関数名を入れても動かなくてエラーが出る。
    $('#murakami').on('click',function(){
        simulation(murakami_result, murakami_record_standard, "#status_murakami", "#total_murakami", '村上2022');
    });

    // 2.9イニング毎計算。whileでやるしかない。
    $('#murakami_nine').on('click',function(){
        out_num_total=0;
        while(out_num_total<27){
        simulation(murakami_result, murakami_record_standard, "#status_murakami", "#total_murakami", '村上2022');
        }
    });

    // 3.100打席毎計算
    $('#murakami_hundred').on('click',function(){
        for(let i =0; i<100; i++){        
        simulation(murakami_result, murakami_record_standard, "#status_murakami", "#total_murakami", '村上2022');
        }
    });

    // 4.総データを記録
    $('#murakami_add').on('click',function(){
        Object.keys(murakami_result).forEach(function(key){
        localStorage.setItem('murakami_result_'+key,murakami_result[key]);
        });
        alert("successfully saved");
        });

    // 5.総データを破棄
    $('#murakami_delete').on('click',function(){
        Object.keys(murakami_result).forEach(function(key){
        localStorage.removeItem('murakami_result_'+key);
        });
        alert("successfully deleted");
        });

    // 6.データを継承（ローカルストレージの内容を取り込む）
    // ブラウザを更新しても、継承後、続きから再開できる。ただし、記録していることが前提
    $('#murakami_inherit').on('click',function(){
        Object.keys(murakami_result).forEach(function(key){
        murakami_result[key]=localStorage.getItem('murakami_result_'+key);
        });
        console.log(murakami_result);
        alert("successfully inherited");
        });