window.onload=function(){
    //添加类名函数
    addClass=function(el,s){
        var tmp=el.getAttribute('class').split(' ');
        var dict={};
        for(var i=0;i<tmp.length;i++){
            dict[tmp[i]]=true;
        }
        if(!dict[s]){
            el.setAttribute('class',el.getAttribute('class')+' '+s);
        }
    };
    removeClass=function(el,s){
        var tmp=el.getAttribute('class').split(' ');
        var dict={};
        for(var i=0;i<tmp.length;i++){
            dict[tmp[i]]=true;
        }
        delete  dict[s];
        var ns='';
        for(var name in dict){
            ns+=' '+name;
        }
        el.setAttribute('class',ns);
    };
    //设置歌单
    var database=[
        {name:' 爱丫爱丫',geshou:'By2',duration:'03:51',src:'./music/By2 - 爱丫爱丫.mp3'},
        {name:'我们的爱',geshou:'f.i.r.',duration:'04:47',src:'./music/f.i.r. - 我们的爱.mp3'},
        {name:'下雨天',geshou:'南拳妈妈',duration:'04:13',src:'./music/南拳妈妈 - 下雨天.mp3'},
        {name:'一个人',geshou:'夏婉安',duration:'03:14',src:'./music/夏婉安 - 一个人.mp3'},
        {name:'我怀念的',geshou:'孙燕姿',duration:'04:47',src:'./music/孙燕姿 - 我怀念的.mp3'},
        {name:'生如夏花',geshou:'朴树',duration:'04:54',src:'./music/朴树 - 生如夏花.mp3'},
        {name:'东京不太热',geshou:'洛天依',duration:'04:04',src:'./music/洛天依 - 东京不太热.mp3'},
        {name:'野子',geshou:'流浪者',duration:'03:42',src:'./music/流浪者 - 野子.mp3'},
        {name:'苦笑不得',geshou:'网络歌手',duration:'04:31',src:'./music/苦笑不得.mp3'},
        {name:'故乡',geshou:'许巍',duration:'05:15',src:'./music/许巍 - 故乡.mp3'},
        {name:'新的心跳',geshou:'邓紫棋',duration:'03:36',src:'./music/邓紫棋 - 新的心跳.mp3'},
        {name:'我在人民广场吃炸鸡',geshou:'阿肆',duration:'03:35',src:'./music/阿肆 - 我在人民广场吃炸鸡.mp3'}
    ];

    var li;
    for(var i=0;i<database.length;i++){
        li=document.createElement('li');
        li.setAttribute('index',i);
        li.setAttribute('class','li');
        li.innerHTML= ' <strong class="music_name" title="database[i] .name">'+database[i].name+'</strong> <strong class="singer_name" title="'+database[i].geshou+'">'+database[i].geshou+'</strong> <strong class="play_time">'+database[i].duration+'</strong>';divsonglist.firstElementChild.appendChild(li);
    }

    var onmusicchange=(function(){
        var currentlist=null;
        return function(index){

            audio.play();
            if(currentlist){
                currentlist.setAttribute('class','li');
            }
            playlists[index].setAttribute('class','li play_current');
            currentlist=playlists[index];
            audio.src=database[index].src;
            geming.innerHTML=database[index].name;
            geshou.innerHTML=database[index].geshou;
            ptime.innerHTML=database[index].duration;
            audio.play();
        };
    })();

    var playlists=document.getElementsByClassName('li');
    var currentlist=null;
    var currentIndex=0;
    for(var i=0;i<playlists.length;i++){
        playlists[i].onclick=function(){
            var index=Number(this.getAttribute('index'));
            currentIndex=index;
            onmusicchange(index);
        }
    }
    //上一首
    var nextsong=function(){
        if(playbt=='unodered_bt'){
            var rd=Math.floor(Math.random()*database.length); onmusicchange(rd);return;
        }
        currentIndex+=1;
        currentIndex=(currentIndex==database.length)?0:currentIndex;
        onmusicchange(currentIndex);
    }
    next_bt.onclick=nextsong;
    var prevsong=function(){
        if(playbt=='unordered_bt'){
            var rd=Math.floor(Math.random()*database.length); onmusicchange(rd);return;
        }
        currentIndex-=1;
        currentIndex=(currentIndex==-1)?database.length-1:currentIndex;
        onmusicchange(currentIndex);
    }
    prev_bt.onclick=prevsong;

    //点击设置播放模式
    for(var i=0;i<divselect.children.length;i++){
        divselect.children[i].onclick=function(){
            this.parentElement.style.display='none';
            btnPlayway.className=this.className;
            playbt=this.className;
        }
    }


    //控制播放暂停
    //播放器:audio ;    播放暂停按钮:play_bt ;
    audio.volume=0.5;
    //播放暂停按钮
    audio.onplay=function(){
        play_bt.setAttribute('class','pause_bt')
    };
    audio.onpause=function(){
        play_bt.setAttribute('class','play_bt')
    };
    play_bt.onclick=function(){
        if(audio.paused){audio.play();}else{audio.pause()}
    };

    //声音大小调节
    //  长条spanvolume  点spanvolumeop  音量长spanvolumebar
    var jindutiao;
    audio.onvolumechange=function(){
        spanvolumebar.style.width=(this.volume*100)+'%';
        spanvolumeop.style.left=(this.volume*100)+'%';
        if(this.volume==0){
            spanmute.className='volume_mute';
        }else{
            spanmute.className='volume_icon';
        }
    };
    spanvolume.onclick=function(e){
       var yinliangjuchangtiaojuli= e.layerX;
        jindutiao=(yinliangjuchangtiaojuli/(this.offsetWidth))*100;
        spanvolumeop.style.left=jindutiao+'%';
        spanvolumebar.style.width=jindutiao+'%';
        audio.volume=(yinliangjuchangtiaojuli/(this.offsetWidth));
    };
    spanvolumeop.onclick = function(e){
        e.stopPropagation();
    };

    //静音设置  控制静音:spanmute
     spanmute.onclick=(function(){
         var previous;
         return  function(){
             if(audio.volume!=0){
                 previous=audio.volume;
                 audio.volume=0;
                 this.setAttribute('class','volume_mute');
             }  else{
                 audio.volume=previous;
                 this.setAttribute('class','volume_icon');
             }
         };
     })();

    //播放进度条的处理
    //播放进度点：spanprogress_op  播放进度条：spanplaybar
    var fengzhuang=function(){
        var t=audio.currentTime/audio.duration;
        spanplaybar.style.width=(t*100)+'%';
        spanprogress_op.style.left=(t*100)+'%';
    };
    audio.onseeked=function(){
        fengzhuang();
    };
    audio.ontimeupdate = function(){
        fengzhuang();
    };
    spanplayer_bgbar.parentElement.onclick = function(e){
        var t = e.layerX/this.offsetWidth;
        audio.currentTime = audio.duration * t;
    };
    spanprogress_op.onclick=function(e){
        e.stopPropagation();
    };

    //随机播放unordered_bt  顺序播放ordered_bt  列表循环cycle_bt  单曲循环cycle_single_bt
    btnPlayway.onclick=function(){
        divselect.style.display='block' ;
    };
    unordered_bt.onclick=function(){
        divselect.style.display='none';
        btnPlayway.setAttribute('class','unordered_bt');
    };
    ordered_bt.onclick=function(){
        divselect.style.display='none';
        btnPlayway.setAttribute('class','ordered_bt')
    };
    cycle_bt.onclick=function(){
        divselect.style.display='none';
        btnPlayway.setAttribute('class','cycle_bt')
    };
    cycle_single_bt.onclick=function(){
        divselect.style.display='none';
        btnPlayway.setAttribute('class','cycle_single_bt')
    };


    //播放进度条处理
    var handleprogress=function(){
        var w=(this.currentTime/this.duration)*100+'%';
        spanplaybar.style.width=w;
        var w2=spanplayer_bgbar.offsetWidth*(this.currentTime/this.duration)-3+'px';
        spanprogress_op.style.left=w2;
    };
    audio.onseeked=handleprogress;
    audio.ontimeupdate=handleprogress;

    //歌曲结束后的处理
    var playbt='cycle_bt';
    audio.onended=function(){
        if(playbt=='cycle_bt'){
            nextsong();
        }else if(playbt=='cycle_single_bt'){
            onmusicchange(currentIndex);
        }else if(playbt=='ordered_bt'){
            if(currentIndex!=database.length-1){
                nextsong();
            }
        }else if(playbt=='unordered_bt'){
            var rd=Math.floor(Math.random()*database.length); onmusicchange(rd);
        }
    }

   //拖动设置音量
    spanvolumeop.onmousedown=function(e){
        e.preventDefault();
        document.onmousemove=function(e){
            var v=(e.clientX-spanvolume.getBoundingClientRect().left)/spanvolume.offsetWidth;
            if(v>=0&&v<=1){audio.volume=v;}
        }
        document.onmouseup=function(){
            document.onmousemove=null;
            document.onmouseuo=null;
        }
    }
    spanvolumeop.onclick=function(e){e.stopPropagation();};

    //点击设置播放时间
    var setcurrenttime=function(e){
        audio.currentTime=audio.duration* e.layerX/this.offsetWidth;
    }
    spanplayer_bgbar.parentElement.onclick=setcurrenttime;
    spanprogress_op.onclick=function(e){e.stopPropagation();};

    //拖动设置播放时间
    spanprogress_op.onmousedown=function(e){
        e.preventDefault();
        audio.pause();
        document.onmousemove=function(e){
            var t= e.clientX/spanplayer_bgbar.offsetWidth;
            if(t>=0&&t<=1){audio.currentTime=audio.duration*t;}
        };
            document.onmouseup=function(){
                audio.play();
                document.onmousemove=null;
                document.onmouseup=null;
            }
        }

//鼠标hover显示当前位置时长
    var formatetime=function(s){
        if(isNaN(s))return'--:--';
        s=Math.round(s);
        var mi=parseInt(s/60);var se=s%60;
        mi=mi<10?'0'+mi:mi;
        se=se<10?'0'+se:se;
        return mi+':'+se;
    };
    spanplayer_bgbar.parentElement.onmouseover=function(e){
        time_show.parentElement.style.display='block';
        time_show.parentElement.style.left= e.clientX-0.5*time_show.offsetWidth+'px';
    }
    spanplayer_bgbar.parentElement.onmouseout=function(){
        time_show.parentElement.style.display='none';
    };
    spanplayer_bgbar.parentElement.onmouseover=function(e){
        time_show.parentElement.style.left= e.clientX-0.5*time_show.offsetWidth+'px';
        time_show.innerHTML=formatetime(audio.duration*(e.clientX/this.offsetWidth));
    }

    //歌词列表显示隐藏btnlrc   歌词框player_lyrics_pannel
    var kaiguan=true;
    btnlrc .onclick=function(){

        if(kaiguan){
          player_lyrics_pannel.style.display='none';
          btnlrc.setAttribute('class','btn_lyrics_disabled');
            kaiguan=false;
        }else if(kaiguan==false){
             player_lyrics_pannel.style.display='block';
            btnlrc.setAttribute('class','btn_lyrics_enabled') ;
            kaiguan=true;
        }
    }

    //歌单显示隐藏 小箭头:btnclose   歌单框：divplayframe  显示列表spansongnum1
    btnclose.onclick=function(){
      var oo=1;
        var timeid=setInterval(function(){
            divplayframe.style.opacity=oo;
            oo-=0.9/10;
            if(oo<=0){clearInterval(timeid);
                divplayframe.style.display='none';
            }
        },1);
    };
    spansongnum1.onclick=function(){
        var oo=0;
            var time1=setInterval(function(){
                divplayframe.style.opacity=oo;
                oo+=0.9/10;
                if(oo>=1){clearInterval(time1);
                    divplayframe.style.display='block';
                }kaiguan=false;
            },5);
    };

    //收起歌单键 btnfold   divsongframe
    var m_player=document.getElementsByClassName('m_player')[0];
    var folded_bt=document.getElementsByClassName('folded_bt')[0];
        var kaiguan=true;
        btnfold.onclick=function(){
            if(kaiguan){
                animate(m_player,{left:-541},800);kaiguan=false;
                btnfold.setAttribute('class','folded_bt1')
            }else if(kaiguan==false){
                animate(m_player,{left:0},800);kaiguan=true;
                btnfold.setAttribute('class','folded_bt')
            }

            //m_player_dock.style.left='- 541px'
        };

    //关闭歌词closelrcpannel  歌词框player_lyrics_pannel
    closelrcpannel.onclick=function(){
        player_lyrics_pannel.style.display='none';
        btnlrc.setAttribute('class','btn_lyrics_disabled');
    }

    //清空列表  clear_list
    clear_list.onclick=function(){
        divsonglist.innerHTML='';
        audio.src='';
    }


};