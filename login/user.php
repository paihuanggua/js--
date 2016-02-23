<?php

$act=$_GET['act'];
$user=$_GET['user'];
$pass=$_GET['pass'];
switch($act){
	case 'login':
		mysql_connect('localhost','root','');
		mysql_select_db('login');
		mysql_query('set names utf8');
		$sql="select * from user_table where username='".$user."'";
		$res=mysql_query($sql);
		$row=mysql_fetch_assoc($res);
		if(!$row){
			echo '{ok: false, msg: "此用户名不存在"}';
		}else{
			if($row.password==$pass){
				echo '{ok: true, msg: "登录成功"}';
			}else{
				echo '{ok: false, msg: "密码有错"}';
			}
		}
		break;
	case 'add':
		mysql_connect('localhost','root','');
		mysql_select_db('login');
		mysql_query('set names utf8');
		$sql="select * from user_table where username='".$user."'";
		$res=mysql_query($sql);
		$row=mysql_fetch_assoc($res);
		if($row){
			echo '{ok: false, msg: "用户名已存在"}';
		}else{
			$sql="insert into user_table valus('".$user."','".$pass."')";
			mysql_query($sql);
			echo '{ok: true, msg: "注册成功"}';
		}
		break;

}

?>





























