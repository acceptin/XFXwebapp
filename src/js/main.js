//导航
//执行计划
function openModal(){
  $('.modal').modal('show')
}
var openBox = setTimeout("openModal()",15000);//10000

function startModal(){
  setTimeout("openModal()",60000);//75秒后再次弹出
}

$('.modal').on('hidden.bs.modal',function (e) {
    startModal();
})

$('.navbar-offcanvas').on('show.bs.offcanvas', function () {
    $('#menu-trigger').addClass('is-clicked');
  }).on('hide.bs.offcanvas', function () {
    $('#menu-trigger').removeClass('is-clicked');
    $('.modal').modal('hide');
  })
document.writeln("<script language=\"javascript\" src=\"http://testserver.shifind.com/JS/LsJS.aspx?siteid=LTX79308962&lng=cn\"></script>");
function swt_hm(obj){
var swt="http://testserver.shifind.com/LR/Chatpre.aspx?id=LTX79308962";
window.open(swt);
}//引用结束