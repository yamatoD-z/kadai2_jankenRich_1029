
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

let ochiai_result = {daseki:0,single:0,double:0,triple:0,homerun:0,fourball:0,strikeout:0,mishit:0,hit_rate:0,average_score:0};


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

// // アウトが３未満なら、交代という表示を出さない
// if(out_num<3){
//     $("#stop-game").text("");
// }

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
//  // カウンタを動かす
// if(out_num===3){
//     $("#stop-game").text("3アウト交代");
// }

console.log(out_num,'out');
console.log(score,'score');
console.log(runner,'runner');
let averagecount = Math.floor(score/(inning /9)*100)/100;
ochiai_result.average_score=averagecount;
let hit_rate = Math.floor(
    (ochiai_result.single+ochiai_result.double+ochiai_result.triple+ochiai_result.homerun)/(ochiai_result.daseki-ochiai_result.fourball)*1000
    );
ochiai_result.hit_rate =hit_rate;
 // カウンタを表示
$("#status_ochiai").text('落合1985：'+inning+'回、'+out_num+'アウト、'+runner+'人が出塁中、'+'ここまで'+score+'点をとられました。1試合平均では'+averagecount+'点、とりました');
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
// 落合をコピー後、Ctrl+hで置換

let bass_result = {daseki:0,single:0,double:0,triple:0,homerun:0,fourball:0,strikeout:0,mishit:0,hit_rate:0,average_score:0};


//  左から、累計で［シングルヒット、2ベースヒット、3ベースヒット、ホームラン、三振、四球・死球、アウト（ゴロ、フライ）］
let bass_record=[96,127,129,176,246,330,541];
console.log(bass_record);

//  乱数は100で統一するので、上記結果を標準化
let bass_record_standard=[];
bass_record.forEach(function(value,index){
    bass_record_standard[index]=bass_record[index]/(bass_record[6]/100);
});
console.log(bass_record_standard);

// 関数の呼び出しのテスト
// function bass_console(msg){
//     console.log(msg);
// }
// $('#bass_nine').on('click',function(){
//     bass_console(bass_record);
// });



// 関数の切り出し
function bass_simulation(){

bass_result.daseki ++;
let daseki =0;
daseki++

// // アウトが３未満なら、交代という表示を出さない
// if(out_num<3){
//     $("#stop-game").text("");
// }

let probability = Math.random() * 100;
let record_view =bass_record_standard;
console.log(probability);
// console.log((single+double+triple+homerun)/(daseki-fourball));

// 100までの乱数が結果配列のどの範囲に含まれるかで、結果を分別
if(probability<record_view[0]){            
    $("#result").text("シングルヒット");
    runner ++;
    bass_result.single ++;
    console.log("ヒット");
    if(runner>3){
        runner = 3;
        score ++;
    }
    
}else if(probability<record_view[1]){
    $("#result").text("2塁打");
    bass_result.double ++;
    console.log("2塁打");
    if(runner>=2){
        runner = 2;
        score = score + runner -1;
    }else{
        runner ++;
    }
}else if(probability<record_view[2]){
    $("#result").text("3塁打");
    bass_result.triple ++;
    console.log("3塁打");
    score +=runner;
    runner=1;

}else if(probability<record_view[3]){
    $("#result").text("ホームラン");
    score ++;
    bass_result.homerun ++;
    score +=runner;
    runner=0;
    console.log("ホームラン");
}else if(probability<record_view[4]){
    $("#result").text("三振");
    out_num++;
    out_num_total++;
    bass_result.strikeout ++;
    console.log("三振");
}else if(probability<record_view[5]){            
    $("#result").text("四球・死球");
    runner ++;
    bass_result.fourball ++;
    console.log("四球・死球");
    if(runner>3){
        runner = 3;
        score ++;
    }
}else if(probability<record_view[6]){
    $("#result").text("アウト（ゴロ、フライ）");
    out_num++;
    out_num_total++;
    bass_result.mishit ++;
    console.log("アウト（ゴロ、フライ）");
}
//  // カウンタを動かす
// if(out_num===3){
//     $("#stop-game").text("3アウト交代");
// }

console.log(out_num,'out');
console.log(score,'score');
console.log(runner,'runner');
let averagecount = Math.floor(score/(inning /9)*100)/100;
bass_result.average_score=averagecount;
let hit_rate = Math.floor(
    (bass_result.single+bass_result.double+bass_result.triple+bass_result.homerun)/(bass_result.daseki-bass_result.fourball)*1000
    );
bass_result.hit_rate =hit_rate;
 // カウンタを表示
$("#status_bass").text('バース1986：'+inning+'回、'+out_num+'アウト、'+runner+'人が出塁中、'+'ここまで'+score+'点をとりました。1試合平均では'+averagecount+'点、とられています');
$("#total_bass").text('バース1986：全'+bass_result.daseki+'打席のうち、1塁打'+bass_result.single+'回、2塁打'+bass_result.double+'回、3塁打'+bass_result.triple+'回、ホームラン'+bass_result.homerun+'回、三振'+bass_result.strikeout+'回、四球'+bass_result.fourball+'回、凡打'+bass_result.mishit+'回、打率は.'+hit_rate+'です。');
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
$('#bass').on('click',function(){
    bass_simulation();
});

// 2.9イニング毎計算。whileでやるしかない。
$('#bass_nine').on('click',function(){
    out_num_total=0;
    while(out_num_total<27){
    bass_simulation();
    }
});

// 3.100打席毎計算
$('#bass_hundred').on('click',function(){
    for(let i =0; i<100; i++){
        
    bass_simulation();
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
let matsunaka_result = {daseki:0,single:0,double:0,triple:0,homerun:0,fourball:0,strikeout:0,mishit:0,hit_rate:0,average_score:0};


//  左から、累計で［シングルヒット、2ベースヒット、3ベースヒット、ホームラン、三振、四球・死球、アウト（ゴロ、フライ）］
let matsunaka_record=[96,127,129,176,246,330,541];
console.log(matsunaka_record);

//  乱数は100で統一するので、上記結果を標準化
let matsunaka_record_standard=[];
matsunaka_record.forEach(function(value,index){
matsunaka_record_standard[index]=matsunaka_record[index]/(matsunaka_record[6]/100);
});
console.log(matsunaka_record_standard);

// 関数の呼び出しのテスト
// function matsunaka_console(msg){
//     console.log(msg);
// }
// $('#matsunaka_nine').on('click',function(){
//     matsunaka_console(matsunaka_record);
// });



// 関数の切り出し
function matsunaka_simulation(){

matsunaka_result.daseki ++;
let daseki =0;
daseki++

// // アウトが３未満なら、交代という表示を出さない
// if(out_num<3){
//     $("#stop-game").text("");
// }

let probability = Math.random() * 100;
let record_view =matsunaka_record_standard;
console.log(probability);
// console.log((single+double+triple+homerun)/(daseki-fourball));

// 100までの乱数が結果配列のどの範囲に含まれるかで、結果を分別
if(probability<record_view[0]){            
$("#result").text("シングルヒット");
runner ++;
matsunaka_result.single ++;
console.log("ヒット");
if(runner>3){
    runner = 3;
    score ++;
}

}else if(probability<record_view[1]){
$("#result").text("2塁打");
matsunaka_result.double ++;
console.log("2塁打");
if(runner>=2){
    runner = 2;
    score = score + runner -1;
}else{
    runner ++;
}
}else if(probability<record_view[2]){
$("#result").text("3塁打");
matsunaka_result.triple ++;
console.log("3塁打");
score +=runner;
runner=1;

}else if(probability<record_view[3]){
$("#result").text("ホームラン");
score ++;
matsunaka_result.homerun ++;
score +=runner;
runner=0;
console.log("ホームラン");
}else if(probability<record_view[4]){
$("#result").text("三振");
out_num++;
out_num_total++;
matsunaka_result.strikeout ++;
console.log("三振");
}else if(probability<record_view[5]){            
$("#result").text("四球・死球");
runner ++;
matsunaka_result.fourball ++;
console.log("四球・死球");
if(runner>3){
    runner = 3;
    score ++;
}
}else if(probability<record_view[6]){
$("#result").text("アウト（ゴロ、フライ）");
out_num++;
out_num_total++;
matsunaka_result.mishit ++;
console.log("アウト（ゴロ、フライ）");
}
//  // カウンタを動かす
// if(out_num===3){
//     $("#stop-game").text("3アウト交代");
// }

console.log(out_num,'out');
console.log(score,'score');
console.log(runner,'runner');
let averagecount = Math.floor(score/(inning /9)*100)/100;
matsunaka_result.average_score=averagecount;
let hit_rate = Math.floor(
(matsunaka_result.single+matsunaka_result.double+matsunaka_result.triple+matsunaka_result.homerun)/(matsunaka_result.daseki-matsunaka_result.fourball)*1000
);
matsunaka_result.hit_rate =hit_rate;
// カウンタを表示
$("#status_matsunaka").text('松中2004：'+inning+'回、'+out_num+'アウト、'+runner+'人が出塁中、'+'ここまで'+score+'点をとられました。1試合平均では'+averagecount+'点、とりました。');
$("#total_matsunaka").text('松中2004：全'+matsunaka_result.daseki+'打席のうち、1塁打'+matsunaka_result.single+'回、2塁打'+matsunaka_result.double+'回、3塁打'+matsunaka_result.triple+'回、ホームラン'+matsunaka_result.homerun+'回、三振'+matsunaka_result.strikeout+'回、四球'+matsunaka_result.fourball+'回、凡打'+matsunaka_result.mishit+'回、打率は.'+hit_rate+'です。');
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
$('#matsunaka').on('click',function(){
matsunaka_simulation();
});

// 2.9イニング毎計算。whileでやるしかない。
$('#matsunaka_nine').on('click',function(){
out_num_total=0;
while(out_num_total<27){
matsunaka_simulation();
}
});

// 3.100打席毎計算
$('#matsunaka_hundred').on('click',function(){
for(let i =0; i<100; i++){
    
matsunaka_simulation();
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


let murakami_result = {daseki:0,single:0,double:0,triple:0,homerun:0,fourball:0,strikeout:0,mishit:0,hit_rate:0,average_score:0};


//  左から、累計で［シングルヒット、2ベースヒット、3ベースヒット、ホームラン、三振、四球・死球、アウト（ゴロ、フライ）］
let murakami_record=[96,127,129,176,246,330,541];
console.log(murakami_record);

//  乱数は100で統一するので、上記結果を標準化
let murakami_record_standard=[];
murakami_record.forEach(function(value,index){
murakami_record_standard[index]=murakami_record[index]/(murakami_record[6]/100);
});
console.log(murakami_record_standard);

// 関数の呼び出しのテスト
// function murakami_console(msg){
//     console.log(msg);
// }
// $('#murakami_nine').on('click',function(){
//     murakami_console(murakami_record);
// });



// 関数の切り出し
function murakami_simulation(){

murakami_result.daseki ++;
let daseki =0;
daseki++

// // アウトが３未満なら、交代という表示を出さない
// if(out_num<3){
//     $("#stop-game").text("");
// }

let probability = Math.random() * 100;
let record_view =murakami_record_standard;
console.log(probability);
// console.log((single+double+triple+homerun)/(daseki-fourball));

// 100までの乱数が結果配列のどの範囲に含まれるかで、結果を分別
if(probability<record_view[0]){            
$("#result").text("シングルヒット");
runner ++;
murakami_result.single ++;
console.log("ヒット");
if(runner>3){
    runner = 3;
    score ++;
}

}else if(probability<record_view[1]){
$("#result").text("2塁打");
murakami_result.double ++;
console.log("2塁打");
if(runner>=2){
    runner = 2;
    score = score + runner -1;
}else{
    runner ++;
}
}else if(probability<record_view[2]){
$("#result").text("3塁打");
murakami_result.triple ++;
console.log("3塁打");
score +=runner;
runner=1;

}else if(probability<record_view[3]){
$("#result").text("ホームラン");
score ++;
murakami_result.homerun ++;
score +=runner;
runner=0;
console.log("ホームラン");
}else if(probability<record_view[4]){
$("#result").text("三振");
out_num++;
out_num_total++;
murakami_result.strikeout ++;
console.log("三振");
}else if(probability<record_view[5]){            
$("#result").text("四球・死球");
runner ++;
murakami_result.fourball ++;
console.log("四球・死球");
if(runner>3){
    runner = 3;
    score ++;
}
}else if(probability<record_view[6]){
$("#result").text("アウト（ゴロ、フライ）");
out_num++;
out_num_total++;
murakami_result.mishit ++;
console.log("アウト（ゴロ、フライ）");
}
//  // カウンタを動かす
// if(out_num===3){
//     $("#stop-game").text("3アウト交代");
// }

console.log(out_num,'out');
console.log(score,'score');
console.log(runner,'runner');
let averagecount = Math.floor(score/(inning /9)*100)/100;
murakami_result.average_score=averagecount;
let hit_rate = Math.floor(
(murakami_result.single+murakami_result.double+murakami_result.triple+murakami_result.homerun)/(murakami_result.daseki-murakami_result.fourball)*1000
);
murakami_result.hit_rate =hit_rate;
// カウンタを表示
$("#status_murakami").text('村上2022：'+inning+'回、'+out_num+'アウト、'+runner+'人が出塁中、'+'ここまで'+score+'点をとりました。1試合平均では'+averagecount+'点、とられています');
$("#total_murakami").text('村上2022：全'+murakami_result.daseki+'打席のうち、1塁打'+murakami_result.single+'回、2塁打'+murakami_result.double+'回、3塁打'+murakami_result.triple+'回、ホームラン'+murakami_result.homerun+'回、三振'+murakami_result.strikeout+'回、四球'+murakami_result.fourball+'回、凡打'+murakami_result.mishit+'回、打率は.'+hit_rate+'です。');
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
$('#murakami').on('click',function(){
murakami_simulation();
});

// 2.9イニング毎計算。whileでやるしかない。
$('#murakami_nine').on('click',function(){
out_num_total=0;
while(out_num_total<27){
murakami_simulation();
}
});

// 3.100打席毎計算
$('#murakami_hundred').on('click',function(){
for(let i =0; i<100; i++){
    
murakami_simulation();
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