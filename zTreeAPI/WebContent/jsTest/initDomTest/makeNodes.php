<?php ?>[<?php
$num = 1;
$t = "";
if(array_key_exists( 't',$_REQUEST)) {
	$t = $_REQUEST['t'];
}
if ($t==null || $t=="") $t = "r";
$n = "";
if(array_key_exists( 'n',$_REQUEST)) {
	$n = $_REQUEST['n'];
}
if ($n==null || $n=="") $n = "1";
$num = (int) $n;

for ($i=1; $i<=$num; $i++) {
	$pId = 0;
	if ($t == "l") $pId = $i - 1;
	else if ($t == "n") $pId = (int)($i/10-1);
	echo "{ id:'".$i."', pId:'".$pId."', name:'z".$i."' , open: true}";
	if ($i<$num) {
		echo ",";
	}
}
?>]
