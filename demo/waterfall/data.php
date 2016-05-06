<?php

// 实际应用中 data 一般从数据库读取,在此直接用php直接处理了数据
//也可以通过php进行后台数据库的访问，运用数据库查询

$data = array();

$data[] = (object)array(
	'image'=>'images/(1).jpg',
	'title'=>'芭蕾舞大师',
	'inf'=>'色调幽静，那湖面上，天鹅伸展着美丽的双翅，翩翩起舞，犹如两张风帆，又像两朵白絮在随风漂流~那只飞翔在梦想之路的冰天鹅,无论路途的遥远与艰辛,向着未来的那缕彩色的光束奋力拍打翅膀！'
);
$data[] = (object)array(
	'image'=>'images/(2).jpg',
	'title'=>'冰天雪地', 'inf'=>'冰天雪地树全白，抬头望天云似盖。'
);
$data[] = (object)array(
	'image'=>'images/(3).jpg',
	'title'=>'乘风而去',
	'inf'=>'我们能走多久，靠的不是双脚，而是志向，鸿鹄志在苍宇，燕雀心系檐下；我们能登多高，靠的不是身躯，而是意志，强者遇挫越勇，弱者逢败弥伤；我们能做什么，靠的不是双手，而是智慧，勤劳砥砺品性，思想创造未来；我们能看多远，靠的不是双眼，而是胸怀，你装得下世界，世界才会容你。'
);
$data[] = (object)array(
	'image'=>'images/(4).jpg',
	'title'=>'风尘俗世',
	'inf'=>'人活着，其实就是一种心态，你若觉得快乐，幸福无处不在；你为自己悲鸣，世界必将灰暗。是非常有，不听当无；祸福相依，顺其自然。多行善，福必近；多为恶，祸难远。不奢求，心易安；不冒进，则身全。心小不容蝼蚁，胸阔能纳百川。顺境淡然，逆境泰然。不自重者取辱，不自足者博学，不自满者受益。'
);
$data[] = (object)array(
	'image'=>'images/(5).jpg',
	'title'=>'翠鸟捕食',
	'inf'=>'神兵天降~翠鸟入水捕食一瞬间'
);
$data[] = (object)array(
	'image'=>'images/(6).jpg',
	'title'=>'倒挂金钟',
	'inf'=>'灯笼花，玲珑心，红了岁月紫了芯。不惧黑，何畏黯，照亮人间尽温馨。'
);
$data[] = (object)array(
	'image'=>'images/(7).jpg',
	'title'=>'飞跃江山',
	'inf'=>'江山如此多娇,引无数英雄竞折腰'
);
$data[] = (object)array(
	'image'=>'images/(8).jpg',
	'title'=>'寒雪', 
	'inf'=>'风啸雪纷飞，群鸟立独枝。身冷抱取暖，心寒有谁怜？'
);
$data[] = (object)array(
	'image'=>'images/(9).jpg',
	'title'=>'感悟生命',
	'inf'=>'生命'
);
$data[] = (object)array(
	'image'=>'images/(10).jpg',
	'title'=>'超广角效果',
	'inf'=>'广角构图拍蓝天，层林对称分两边。疑是照镜真假面，奇妙美景留人间'
);
$data[] = (object)array(
	'image'=>'images/(11).jpg',
	'title'=>'海岸',
	'inf'=>'命运中的拥有，皆源于不断的选择，不泯的追求，不弃的坚持。那些走过的印迹，丈量着起点至终点的距离，又何尝不是我们心路的苦旅。每一次聚散、喜悲、爱恨，让我们的生命有了起承转合。镌刻在岁月里的记忆，终是要淡漠的，那些放下的，就忘了吧，今天的剧情，是明朝的伏笔，当下的灌溉，是来日的花开。'
);
$data[] = (object)array(
	'image'=>'images/(12).jpg',
	'title'=>'彩虹云',
	'inf'=>'幸福不是邂逅的，而是修炼出来的。人生如天空的云朵，总是变幻莫测。等待幸福如同期待晴天，命运由天不由人；寻找幸福如同自备雨伞，晴可乘凉，阴可避雨。修炼一颗淡然的心，就是为自己备下人生的雨伞。淡然，既不畏惧于凄风苦雨，又不动心于名利诱惑。修炼一颗淡然的心，才能固守人生的幸福。'
);
$data[] = (object)array(
	'image'=>'images/(13).jpg',
	'title'=>'落日长河',
	'inf'=>'单车欲问边，属国过居延。征蓬出汉塞，归雁入胡天。大漠孤烟直，长河落日圆。萧关逢候骑，都护在燕然。'
);
$data[] = (object)array(
	'image'=>'images/(14).jpg',
	'title'=>'回忆',
	'inf'=>'回忆是一种很奇妙的东西，它生活在过去，存在于现在，却能够影响未来'
);
$data[] = (object)array(
	'image'=>'images/(15).jpg',
	'title'=>'家',
	'inf'=>'温馨的家'
);
$data[] = (object)array(
	'image'=>'images/(16).jpg',
	'title'=>'猫狗',
	'inf'=>'净身出户狗忧郁，小三生活猫香睡'
);
$data[] = (object)array(
	'image'=>'images/(17).jpg',
	'title'=>'双日同辉',
	'inf'=>'双日同辉，天机无限。清澈的湖面，美丽的倒影。'
);
$data[] = (object)array(
	'image'=>'images/(18).jpg',
	'title'=>'旅途',
	'inf'=>'一件事，某个人，你若放弃，可以找到万千理由，但你要学会真的放下，过后别回头，别懊悔，别无端的折磨自己。如果放不下，那就再咬牙再坚持一下，在绝望中寻求生机，在卑微中强健身心，潜心笃行者终尝所愿，坚忍不拔者多能功成。要经常对自己说：我想得到，我一定行，我能撑住，我不服输，我不后悔。'
);
$data[] = (object)array(
	'image'=>'images/(19).jpg',
	'title'=>'雪松鼠',
	'inf'=>'冰雪天地，可爱的雪松鼠'
);
$data[] = (object)array(
	'image'=>'images/(20).jpg',
	'title'=>'无瑕',
	'inf'=>'没有瑕疵，没有污染的光'
);
//$data[] = (object)array('image'=>'images/().jpg', 'title'=>'', 'inf'=>'');

// 随机抽取8条记录以模拟实际情况
$keys = array_rand($data, 8);
$json = array();
foreach($keys as $key)
{
	$json[] = $data[$key];
}
echo json_encode( $json );

?>