//知其然知其所以然 
'use strict';
function ajax(url,fnSucc,fnFail){
	if(window.XMLHttpRequest){
		var oAjax=new XMLHttpRequest();
	}else{
		var oAjax=new ActiveXObject('Microsoft.XMLHTTP');
	}
	oAjax.open('GET',url,true);
	oAjax.send();
	oAjax.onreadystatechange=function(){
		if(oAjax.readyState==4){
			if(oAjax.status>=200&&oAjax.status<300||oAjax.status==304){
				fnSucc&&fnSucc(oAjax.responseText);
			}else{
				fnFail&&fnFail(oAjax.status);
			}
		}
	};
}

