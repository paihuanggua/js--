<?php
$page=$_GET['page'];
$page_size=10;
$start=($page-1)*$page_size;
mysql_connect('localhose','root','');
mysql_select_db('flow');
mysql_query('set names utf8');
$sql="select * from flow limit {$start} {$page_size}";
$query=mysql_query($sql);
if($query&&mysql_num_rows($query)){
	while($row=mysql_fetch_assoc($query)){
		$data[]=$row;
	}
	echo $data;
}

?>