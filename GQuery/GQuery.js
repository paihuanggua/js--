'use strict';
function $(xxx){
	return new GQuery(xxx);
	alert(xxx);
}
function GQuery(xxx){
	this.elements=[];	//存元素
	this.domString='';	//待创建的字符串
	var arr=[];
	switch(typeof xxx){
		case 'function'://DOMContentLoaded、onreadystatechange
			addReady(xxx);
			break;
		case 'string':
			if(xxx.indexOf('<')==-1){//找不到<>->选择器
				this.elements=getEle(xxx);
				this.length=this.elements.length;
			}else{//创建元素
				this.domString=xxx;
				console.log(xxx);
			}
			break;
		case 'object':
			console.log('object');
			this.elements.push(xxx);
			this.length=this.elements.length;
			break;
	}
	//return this.elements;
}

function addReady(fn){
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded',fn,false);
	}else{
		document.attachEvent('onreadystatechange',function(){
			if(document.readyState=='conplete'){
				fn();
			}
		});
	}
}
function getEle(str){//选择器
	//切割字符串
	//1->str.split(' ');
	//2->str.replace(/^\s+|\s+$/g,'').replace(/^\s+$/g,' ').split(' ');
	//3->str.replace(/^\s+|\s+$/g,'').split(/\s+/g);
	var arr=str.match(/\S+/g);
	//alert(arr);
	var aParent=[document];
	var aChild=[];
	for(var i=0;i<arr.length;i++){
		aChild=_getByStr(aParent, arr[i]);
		aParent=aChild;
	}
	for(var i=0;i<aChild.length;i++){
		arr.push(aChild[i]);
	}
	return aChild;
	
}
function _getByStr(aParent,str){
	var aResult=[];//结果
	for(var i=0;i<aParent.length;i++){
		switch(str.charAt(0)){
			case '#':
				//console.log('#######');
				var obj=document.getElementById(str.substring(1));
				aResult.push(obj);
				break;
			case '.':
				console.log('。。。。。。。。');
				var arr=getByClass(aParent[i],str.substring(1));
				for(var j=0;j<arr.length;j++){
					aResult.push(arr[j]);
				}
				break;
			default:
				//console.log('下');
				//1->li.box
				if(/^[a-z0-9]+\.[\w\-]+$/i.test(str)){
					//console.log('下1111111');
					var aStr=str.split('.');
					var arr=aParent[i].getElementsByTagName(aStr[0]);
					var re=new RegExp('\\b'+aStr[1]+'\\b');
					for(var j=0;j<arr.length;j++){
						if(re.test(arr[j].className)){
							aResult.push(arr[j]);
						}
					}
				//li#li-1
				}else if(/^[a-z0-9]+#[\w\-]+$/i.test(str)){
					//console.log('下222222222222');
					var aStr=str.split('#');
					var arr=aParent[i].getElementsByTagName(aStr[0]);
					for(var j=0;j<arr;j++){
						if(arr[j].id==aStr[1]){
							aResult.push(arr[j]);
						}
					}
				//input[xxx=xx]
				}else if(/^[a-z0-9]+\[.+\=.+\]$/i.test(str)){
					//console.log('下333333333333');
					var aStr=str.split(/\[|=|\]/g);
					var arr=aParent[i].getElementsByTagName(aStr[0]);
					for(var j=0;j<arr.length;j++){
						if(arr[j].getAttribute(aStr[1])==aStr[2]){
							aResult.push(arr[j]);
						}
					}
				//li:eq(10)	li:first
				}else if(/^[a-z0-9]+:[a-z]+(\(.+\))?$/i.test(str)){
					//console.log('下44444444444444');
					var aStr=str.split(/:|\(|\)/g);
					var arr=aParent[i].getElementsByTagName(aStr[0]);
					switch(aStr[1]){
						case 'eq':
							aResult.push(arr[parseInt(aStr[2])]);
							break;
						case 'first':
							aResult.push(arr[0]);
							break;
						case 'last':
							aResult.push(arr[arr.length-1]);
							break;
						case 'odd':
							for(var j=1;j<arr.length;j+=2){
								aResult.push(arr[j]);
							}
							break;
						case 'even':
							for(var j=0;j<arr.length;j+=2){
								aResult.push(arr[j]);
							}
							break;
					}
				}else{
					//console.log('下555555');
					var arr=aParent[i].getElementsByTagName(str);
					for(var j=0;j<arr.length;j++){
						aResult.push(arr[j]);
					}
				}
				break;
		}
	}
	
	return aResult;
}
function getByClass(oParent, sClass){
	if(oParent.getElementsByClassName){
		return oParent.getElementsByClassName(sClass);
	}else{
		var result=[];
		var re=new RegExp('\\b'+sClass+'\\b');
		var aEle=oParent.getElementsByTagName('*');
		for(var i=0;i<aEle.length;i++){
			if(re.test(aEle[i].className)){
				result.push(aEle[i])
			}
		}
		return result;
	}
}
//添加事件-------------------------------------------------------------------------
var arr='click mouseover mouseout dblclick mousedown mouseup mousemove keydown keyup focus blur change input load error scroll resize contextmenu mouseenter mouseleave'.split(' ');
for(var i=0;i<arr.length;i++){
	_addEv(arr[i]);
}
function addEvent(obj,name,fn){
	if(obj.addEventListener){
		obj.addEventListener(name,fn,false)
	}else{
		obj.attachEvent('on'+name,function(){
			fn.call(obj,event);
		});
	}
}
function _addEv(name){
	GQuery.prototype[name]=function(fn){
		//给所有选中元素添加事件
		for(var i=0;i<this.elements.length;i++){
			addEvent(this.elements[i],name,fn)
		}
	}
}
//功能效果------------------------------------------------------------------------
		//hover
GQuery.prototype.hover=function(fnOver,fnOut){
	this.mouseenter(fnOver);
	this.mouseleave(fnOut);
};
		//toggle
/*GQuery.prototype.toggle=function(){
	var _args=arguments;
	var _this=this;
	for(var i=0;i<this.elements.length;i++){
		(function(count,index){
			addEvent(_this.elements[i],'click',function(ev){
				_args[count%_args.length].call(_this.elements[index],ev);
				count++;
			})	
		})(0,i);
	}
};*/
		//removeClass
GQuery.prototype.removeClass=function(sClass){
	var re=new RegExp('\\b'+sClass+'\\b','g');
	for(var i=0;i<this.elements.length;i++){
		var obj=this.elements[i];
		obj.className=obj.className.replace(re,'').replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');
		if(!obj.className){
			obj.removeAttribute('class');
		}
	}
};
		//addClass
GQuery.prototype.addClass=function(sClass){
	var re=new RegExp('\\b'+sClass+'\\b');
	for(var i=0;i<this.elements.length;i++){
		var obj=this.elements[i];
		if(!re.test(obj.className)){
			if(obj.className){
				obj.className+=' '+sClass
			}else{
			obj.className=sClass;
			}
		}
	}
};
		//animate
GQuery.prototype.animate=function(json,time,type){
	console.log(json);
	for(var i=0;i<this.elements.length;i++){
		move(this.elements[i], json, {time: time, type: type});
	}
};
GQuery.prototype.appendTo=function (str){
	var aParent=getEle(str);
	for(var i=0;i<aParent.length;i++){
		var oTmp=document.createElement('div');
		oTmp.innerHTML=this.domString;
		while(oTmp.childNodes.length>0){
			aParent[i].appendChild(oTmp.childNodes[0]);
		}
	}
};
/*GQuery.prototype.remove=function (){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].parentNode.removeChild(this.elements[i]);
	}
};
GQuery.prototype.each=function(fn){
	for(var i=0;i<this.elements.length;i++){
		fn.call(this.elements[i],i,this.elements[i]);
	}
};*/
GQuery.prototype.css=function(name, value){
	if(arguments.length==2){//设置
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].style[name]=value;
		}
	}else{
		if(typeof name=='string'){
			return getStyle(this.elements[0],name);
		}else{
			for(var i=0;i<this.elements.length;i++){
				for(var j in name){
					this.elements[i].style[j]=name[j];
				}
			}
		}
	}
};
GQuery.prototype.show=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='block';
	}
};
GQuery.prototype.hide=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='none';
	}
};
GQuery.prototype.attr=function(name,value){
	if(arguments.length==2){//设置
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].setAttribute(name,value);
		}
	}else{
		if(typeof name=='string'){//获取
			 for(var i=0;i<this.elements.length;i++){
				if(this.elements[i].getAttribute(name)){
					return this.elements[i].getAttribute(name);
				}
			}
			
		}else{//设置
			for(var i=0;i<this.elements.length;i++){
				for(var j in name){
					this.elements[i].setAttribute(j,name[j]);
				}
			}
		}
	}
};

//封装函数---------------------------
function move(obj,json,options){
	options=options||{};
	options.time=options.time||700;
	options.type=options.type||'ease-out';
	var count=Math.round(options.time/30);
	var n=0;
	var start={};
	var dis={};
	for(var name in json){
		start[name]=parseInt(getStyle(obj,name));
		dis[name]=json[name]-start[name];
	}
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		n++;
		for(var name in json){
			switch(options.type){
				case 'linear':
					var cur=start[name]+dis[name]*n/count;
					break;
				case 'ease-in':
					var a=n/count;
					var cur=start[name]+dis[name]*Math.pow(a,3);
					break;
				case 'ease-out':
					var a=1-n/count;
					var cur=start[name]+dis[name]*(1-Math.pow(a,3));
					break;
			}
			if(name=='opacity'){
				obj.style.filter='alpha(opacity:'+cur*100+')';
				obj.style.opacity=cur;
			}else{
				obj.style[name]=cur+'px';
			}
		}
		if(n==count){
			clearInterval(obj.timer);
			options.end && options.end();
		}
	},30);
}
function getStyle(obj,sName){
	return (obj.currentStyle||getComputedStyle(obj,false))[sName];
}






























