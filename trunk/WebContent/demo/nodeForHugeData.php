<?php ?>
[<?
$pId = $_REQUEST["id"];
$pCount = $_REQUEST["count"];

if ($pId==null) $pId = "0";
if ($pCount==null) $pCount = "10";

$max = (int)$pCount;
for ($i=1; $i<=$max; $i++) {
	$nId = $pId."_".$i;
	$nName = "tree".$nId;
	echo "{ id:'".$nId."',	name:'".$nName."'}";
	if ($i<$max) {
		echo ",";
	}
	
}
?>]